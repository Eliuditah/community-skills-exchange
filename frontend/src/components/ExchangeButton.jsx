import React, { useState, useEffect } from 'react';
import exchangeService from '../services/exchangeService';
import './ExchangeButton.css';

const ExchangeButton = ({ skillOffered, skillRequested, onExchangeCreated }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [error, setError] = useState('');

  // Get current user and their skills
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchUserSkills(user._id);
  }, []);

  const fetchUserSkills = async (userId) => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/skills/user/${userId}`);
      const data = await response.json();
      setUserSkills(data);
      if (data.length > 0) {
        setSelectedSkill(data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  const handleRequestExchange = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to request an exchange');
      window.location.href = '/login';
      return;
    }

    // Check if user has any skills to offer
    if (userSkills.length === 0) {
      alert('You need to create at least one skill before requesting an exchange. Click "POST SKILL" to create one.');
      return;
    }

    // Check if user is trying to exchange with themselves
    if (skillRequested.provider?._id === currentUser._id) {
      alert('You cannot request an exchange for your own skill');
      return;
    }

    setError('');
    setShowModal(true);
  };

  const handleSubmitExchange = async () => {
    if (!selectedSkill) {
      setError('Please select a skill to offer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const exchangeData = {
        skillOffered: selectedSkill,
        skillRequested: skillRequested._id,
        message: message.trim() || `I would like to exchange skills with you. My skill: ${userSkills.find(s => s._id === selectedSkill)?.name || 'a skill'}`,
      };

      console.log('📤 Sending exchange request:', exchangeData);

      const result = await exchangeService.createExchange(exchangeData);
      
      console.log('✅ Exchange created successfully:', result);
      
      setShowModal(false);
      setMessage('');
      setSelectedSkill(userSkills[0]?._id || '');
      
      // Call success callback
      if (onExchangeCreated) {
        onExchangeCreated(result);
      }
      
      // Show success message
      alert('✅ Exchange request sent successfully! The provider will be notified.');
      
    } catch (error) {
      console.error('❌ Exchange request failed:', error);
      setError(error.message || 'Failed to send exchange request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setMessage('');
    setError('');
  };

  return (
    <>
      <button 
        onClick={handleRequestExchange}
        className="exchange-btn"
        disabled={loading}
      >
        {loading ? '⏳ Processing...' : '🔄 REQUEST EXCHANGE'}
      </button>

      {/* Exchange Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔄 Request Skill Exchange</h3>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>
            
            <div className="exchange-summary">
              <div className="exchange-item">
                <div className="exchange-label">You Want:</div>
                <div className="exchange-value skill-requested">
                  <strong>{skillRequested?.name}</strong>
                  <span className="skill-provider">by {skillRequested?.provider?.name || 'Unknown'}</span>
                </div>
              </div>
              <div className="exchange-arrow">⇄</div>
              <div className="exchange-item">
                <div className="exchange-label">You Offer:</div>
                <div className="exchange-value">
                  <select 
                    value={selectedSkill} 
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="skill-select"
                  >
                    {userSkills.map(skill => (
                      <option key={skill._id} value={skill._id}>
                        {skill.name} ({skill.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">💬 Message (optional):</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'm interested in exchanging my skill for yours. Let me know if you're interested!"
                maxLength="500"
                rows="3"
                className="message-input"
              />
              <div className="char-counter">{message.length}/500</div>
            </div>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <div className="modal-actions">
              <button 
                onClick={handleCancel}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitExchange}
                className="btn-primary"
                disabled={loading || !selectedSkill}
              >
                {loading ? '⏳ Sending...' : '📤 Send Exchange Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExchangeButton;