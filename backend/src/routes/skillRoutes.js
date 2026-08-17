const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { protect } = require('../middleware/auth'); // ADD THIS LINE

// Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true })
      .populate('provider', 'name email profilePicture')
      .sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single skill (public)
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('provider', 'name email profilePicture');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create skill (protected - uses auth middleware)
router.post('/', protect, async (req, res) => {  // ADDED 'protect' HERE
  try {
    const { name, category, description, level, tags, image } = req.body;
    
    console.log('📝 Received skill data:', req.body);
    console.log('👤 User from request:', req.user);

    // Get user ID from auth middleware
    let userId;
    if (req.user && req.user._id) {
      userId = req.user._id;
    } else {
      // This should not happen if protect middleware is working
      console.warn('⚠️ No user ID found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Validate required fields
    if (!name || !category || !description || !level) {
      return res.status(400).json({ 
        message: 'Please provide name, category, description, and level' 
      });
    }

    // Create skill with provider
    const skill = await Skill.create({
      name: name.trim(),
      category,
      description: description.trim(),
      level,
      tags: tags || [],
      image: image || '',
      provider: userId,
    });

    // Populate provider info for response
    const populatedSkill = await Skill.findById(skill._id)
      .populate('provider', 'name email profilePicture');

    console.log('✅ Skill created successfully:', populatedSkill);
    res.status(201).json(populatedSkill);
  } catch (error) {
    console.error('❌ Skill creation error:', error);
    res.status(500).json({ 
      message: 'Failed to post skill: ' + error.message 
    });
  }
});

// Update skill (protected)
router.put('/:id', protect, async (req, res) => {  // ADDED 'protect' HERE
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if user owns the skill
    const userId = req.user?._id;
    if (!userId || skill.provider.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this skill' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('provider', 'name email profilePicture');

    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete skill (protected)
router.delete('/:id', protect, async (req, res) => {  // ADDED 'protect' HERE
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // Check if user owns the skill
    const userId = req.user?._id;
    if (!userId || skill.provider.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }

    // Soft delete
    skill.isActive = false;
    await skill.save();
    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get skills by user (public)
router.get('/user/:userId', async (req, res) => {
  try {
    const skills = await Skill.find({ 
      provider: req.params.userId,
      isActive: true 
    })
    .populate('provider', 'name email profilePicture')
    .sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;