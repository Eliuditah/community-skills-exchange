const Exchange = require('../models/Exchange');
const Skill = require('../models/Skill');
const User = require('../models/User'); // Import User to find receiver emails
const nodemailer = require('nodemailer');

// @desc    Create a new exchange request
// @route   POST /api/exchanges
// @access  Private
const createExchange = async (req, res) => {
  try {
    const { skillOffered, skillRequested, message } = req.body;
    const requester = req.user._id;

    // Validate required fields
    if (!skillOffered || !skillRequested) {
      return res.status(400).json({ 
        message: 'Please provide skillOffered and skillRequested' 
      });
    }

    // Check if skills exist
    const offeredSkill = await Skill.findById(skillOffered);
    const requestedSkill = await Skill.findById(skillRequested);

    if (!offeredSkill || !requestedSkill) {
      return res.status(404).json({ message: 'One or both skills not found' });
    }

    // Check if user owns the offered skill
    if (offeredSkill.provider.toString() !== requester.toString()) {
      return res.status(403).json({ 
        message: 'You can only offer skills that you own' 
      });
    }

    // Create exchange
    const exchange = await Exchange.create({
      skillOffered,
      skillRequested,
      requester,
      provider: requestedSkill.provider,
      message: message || '',
      status: 'pending'
    });

    // ==================================================
    // 🌟 SEND EMAIL NOTIFICATION TO THE RECEIVER (Optional)
    // ==================================================
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const receiver = await User.findById(requestedSkill.provider);
        
        if (receiver && receiver.email) {
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS
              }
          });

          const mailOptions = {
              from: `"SkillExchange" <${process.env.EMAIL_USER}>`,
              to: receiver.email,
              subject: '💡 New Skill Exchange Request!',
              html: `
                  <h3>You have a new exchange request!</h3>
                  <p><strong>Sender:</strong> ${req.user.name || 'A User'}</p>
                  <p><strong>Offering:</strong> ${offeredSkill.name}</p>
                  <p><strong>Requesting:</strong> ${requestedSkill.name}</p>
                  <p><strong>Message:</strong> ${message || 'No message provided'}</p>
                  <br>
                  <a href="http://localhost:3000/dashboard" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Request in Dashboard</a>
              `
          };
          
          // Send email in the background
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) console.error('Error sending email:', error);
              else console.log('Email sent: ' + info.response);
          });
        }
      } catch (emailError) {
        // Log but don't stop exchange creation
        console.error('Failed to send email:', emailError);
      }
    } else {
      console.log('Email credentials not configured - skipping email notification');
    }
    // ==================================================

    // Populate exchange with details
    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('skillOffered', 'name category description')
      .populate('skillRequested', 'name category description provider')
      .populate('requester', 'name email profilePicture')
      .populate('provider', 'name email profilePicture');

    res.status(201).json(populatedExchange);
  } catch (error) {
    console.error('❌ Exchange creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create exchange: ' + error.message 
    });
  }
};

// @desc    Get all exchanges for current user
// @route   GET /api/exchanges
// @access  Private
const getExchanges = async (req, res) => {
  try {
    const userId = req.user._id;

    const exchanges = await Exchange.find({
      $or: [
        { requester: userId },
        { provider: userId }
      ]
    })
    .populate('skillOffered', 'name category description')
    .populate('skillRequested', 'name category description')
    .populate('requester', 'name email profilePicture')
    .populate('provider', 'name email profilePicture')
    .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    console.error('❌ Get exchanges error:', error);
    res.status(500).json({ 
      message: 'Failed to get exchanges: ' + error.message 
    });
  }
};

// @desc    Get exchange by ID
// @route   GET /api/exchanges/:id
// @access  Private
const getExchangeById = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('skillOffered', 'name category description level')
      .populate('skillRequested', 'name category description level')
      .populate('requester', 'name email profilePicture')
      .populate('provider', 'name email profilePicture');

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // Check if user is part of this exchange
    const userId = req.user._id;
    if (exchange.requester.toString() !== userId.toString() && 
        exchange.provider.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to view this exchange' 
      });
    }

    res.json(exchange);
  } catch (error) {
    console.error('❌ Get exchange error:', error);
    res.status(500).json({ 
      message: 'Failed to get exchange: ' + error.message 
    });
  }
};

// @desc    Update exchange status
// @route   PUT /api/exchanges/:id/status
// @access  Private
const updateExchangeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // Check if user is authorized (only provider can update status)
    const userId = req.user._id;
    if (exchange.provider.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Only the provider can update exchange status' 
      });
    }

    // Validate status
    const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    exchange.status = status;
    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('skillOffered', 'name category description')
      .populate('skillRequested', 'name category description')
      .populate('requester', 'name email profilePicture')
      .populate('provider', 'name email profilePicture');

    res.json(populatedExchange);
  } catch (error) {
    console.error('❌ Update exchange status error:', error);
    res.status(500).json({ 
      message: 'Failed to update exchange status: ' + error.message 
    });
  }
};

// @desc    Accept exchange
// @route   PUT /api/exchanges/:id/accept
// @access  Private
const acceptExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // Check if user is the provider
    const userId = req.user._id;
    if (exchange.provider.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Only the provider can accept this exchange' 
      });
    }

    if (exchange.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Exchange can only be accepted when status is pending' 
      });
    }

    exchange.status = 'accepted';
    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('skillOffered', 'name category description')
      .populate('skillRequested', 'name category description')
      .populate('requester', 'name email profilePicture')
      .populate('provider', 'name email profilePicture');

    res.json(populatedExchange);
  } catch (error) {
    console.error('❌ Accept exchange error:', error);
    res.status(500).json({ 
      message: 'Failed to accept exchange: ' + error.message 
    });
  }
};

// @desc    Complete exchange
// @route   PUT /api/exchanges/:id/complete
// @access  Private
const completeExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // Check if user is part of this exchange
    const userId = req.user._id;
    if (exchange.requester.toString() !== userId.toString() && 
        exchange.provider.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to complete this exchange' 
      });
    }

    if (exchange.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Exchange can only be completed when status is accepted' 
      });
    }

    exchange.status = 'completed';
    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('skillOffered', 'name category description')
      .populate('skillRequested', 'name category description')
      .populate('requester', 'name email profilePicture')
      .populate('provider', 'name email profilePicture');

    res.json(populatedExchange);
  } catch (error) {
    console.error('❌ Complete exchange error:', error);
    res.status(500).json({ 
      message: 'Failed to complete exchange: ' + error.message 
    });
  }
};

// @desc    Cancel exchange
// @route   PUT /api/exchanges/:id/cancel
// @access  Private
const cancelExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    // Check if user is part of this exchange
    const userId = req.user._id;
    if (exchange.requester.toString() !== userId.toString() && 
        exchange.provider.toString() !== userId.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to cancel this exchange' 
      });
    }

    if (exchange.status === 'completed') {
      return res.status(400).json({ 
        message: 'Cannot cancel a completed exchange' 
      });
    }

    exchange.status = 'cancelled';
    await exchange.save();

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('skillOffered', 'name category description')
      .populate('skillRequested', 'name category description')
      .populate('requester', 'name email profilePicture')
      .populate('provider', 'name email profilePicture');

    res.json(populatedExchange);
  } catch (error) {
    console.error('❌ Cancel exchange error:', error);
    res.status(500).json({ 
      message: 'Failed to cancel exchange: ' + error.message 
    });
  }
};

// @desc    Get user exchanges
// @route   GET /api/exchanges/user
// @access  Private
const getUserExchanges = async (req, res) => {
  try {
    const userId = req.user._id;

    const exchanges = await Exchange.find({
      $or: [
        { requester: userId },
        { provider: userId }
      ]
    })
    .populate('skillOffered', 'name category description')
    .populate('skillRequested', 'name category description')
    .populate('requester', 'name email profilePicture')
    .populate('provider', 'name email profilePicture')
    .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    console.error('❌ Get user exchanges error:', error);
    res.status(500).json({ 
      message: 'Failed to get user exchanges: ' + error.message 
    });
  }
};

module.exports = {
  createExchange,
  getExchanges,
  getExchangeById,
  updateExchangeStatus,
  acceptExchange,
  completeExchange,
  cancelExchange,
  getUserExchanges
};