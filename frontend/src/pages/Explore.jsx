import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Grid, Card, CardContent, Typography, Chip, Box, 
  TextField, MenuItem, CircularProgress,
  CardMedia, CardActions, Button, Modal,
  Select, FormControl, InputLabel, IconButton
} from '@mui/material';
import { Search, Person, Close } from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Explore = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', level: '' });
  const [userSkills, setUserSkills] = useState([]);
  
  // Exchange Modal States
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedOfferSkill, setSelectedOfferSkill] = useState('');
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSkills();
    if (user && user._id) {
      fetchUserSkills(user._id);
    }
  }, [user]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/skills`);
      console.log('Skills fetched:', response.data);
      setSkills(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Failed to load skills. Please try again.');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSkills = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/skills/user/${userId}`);
      setUserSkills(Array.isArray(response.data) ? response.data : []);
      if (response.data.length > 0) {
        setSelectedOfferSkill(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  const categories = [
    'programming', 'design', 'cybersecurity', 'data_science', 
    'cloud_computing', 'devops', 'mobile_dev', 'web_dev',
    'ai_ml', 'blockchain', 'networking', 'database',
    'ui_ux', 'project_management', 'carpentry', 'electrical',
    'plumbing', 'welding', 'auto_mechanics', 'culinary',
    'graphic_design', 'healthcare', 'agriculture', 'business',
    'personal_development', 'other'
  ];
  
  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

  const filteredSkills = Array.isArray(skills) ? skills.filter(skill => {
    if (!skill) return false;
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = !searchTerm || 
      (skill.name && skill.name.toLowerCase().includes(searchTerm)) ||
      (skill.description && skill.description.toLowerCase().includes(searchTerm));
    const matchesCategory = !filters.category || skill.category === filters.category;
    const matchesLevel = !filters.level || skill.level === filters.level;
    return matchesSearch && matchesCategory && matchesLevel;
  }) : [];

  // Open exchange modal
  const handleOpenExchangeModal = (skill) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to request an exchange');
      window.location.href = '/login';
      return;
    }

    if (userSkills.length === 0) {
      alert('You need to create at least one skill before requesting an exchange.');
      return;
    }

    if (user && skill.provider?._id === user._id) {
      alert('You cannot request an exchange for your own skill');
      return;
    }

    setSelectedSkill(skill);
    setExchangeModalOpen(true);
    setExchangeMessage('');
    if (userSkills.length > 0) {
      setSelectedOfferSkill(userSkills[0]._id);
    }
  };

  // Close exchange modal
  const handleCloseExchangeModal = () => {
    setExchangeModalOpen(false);
    setSelectedSkill(null);
    setExchangeMessage('');
    setSubmitting(false);
  };

  // Submit exchange request
  const handleSubmitExchange = async () => {
    if (!selectedOfferSkill) {
      alert('Please select a skill to offer');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const exchangeData = {
        skillOffered: selectedOfferSkill,
        skillRequested: selectedSkill._id,
        message: exchangeMessage.trim() || 'I would like to exchange skills with you.'
      };

      console.log('Sending exchange request:', exchangeData);

      const response = await axios.post(
        `${API_URL}/exchanges`,
        exchangeData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Exchange created:', response.data);
      alert('Exchange request sent successfully!');
      handleCloseExchangeModal();

    } catch (error) {
      console.error('Exchange error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to send exchange request');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Button onClick={fetchSkills} variant="contained" sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </Layout>
    );
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    maxWidth: '90%',
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
  };

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 3, color: '#1a237e', fontWeight: 'bold' }}>
        🔍 Explore Skills
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search skills..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          select
          size="small"
          label="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.replace('_', ' ').toUpperCase()}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Level"
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Levels</MenuItem>
          {levels.map((level) => (
            <MenuItem key={level} value={level}>
              {level.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Skills Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredSkills.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No skills found. Be the first to post a skill!
          </Typography>
          <Button 
            component={Link} 
            to="/post-skill" 
            variant="contained" 
            sx={{ mt: 2, bgcolor: '#4caf50' }}
          >
            Post a Skill
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredSkills.map((skill) => {
            const isOwnSkill = user && skill.provider?._id === user._id;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={skill._id || Math.random()}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  }
                }}>
                  {skill.image ? (
                    <CardMedia
                      component="img"
                      height="160"
                      image={skill.image}
                      alt={skill.name || 'Skill'}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ 
                      height: 160, 
                      bgcolor: '#e3f2fd', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '3rem'
                    }}>
                      📚
                    </Box>
                  )}

                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {skill.name || 'Unnamed Skill'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={skill.category ? skill.category.replace('_', ' ').toUpperCase() : 'Unknown'} 
                        size="small"
                        sx={{ bgcolor: '#e3f2fd', color: '#1a237e' }}
                      />
                      <Chip 
                        label={skill.level ? skill.level.toUpperCase() : 'Unknown'} 
                        size="small"
                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {skill.description?.substring(0, 100) || 'No description provided'}
                      {skill.description?.length > 100 && '...'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Person sx={{ fontSize: 16, color: '#666' }} />
                      <Typography variant="caption" color="textSecondary">
                        {skill.provider?.name || 'Unknown User'}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleOpenExchangeModal(skill)}
                      disabled={isOwnSkill}
                      sx={isOwnSkill ? { 
                        bgcolor: '#ccc', 
                        '&:hover': { bgcolor: '#ccc' } 
                      } : { 
                        bgcolor: '#1a237e', 
                        '&:hover': { bgcolor: '#0d1445' } 
                      }}
                    >
                      {isOwnSkill ? 'Your Skill' : 'Request Exchange'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Exchange Modal */}
      <Modal
        open={exchangeModalOpen}
        onClose={handleCloseExchangeModal}
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Request Skill Exchange
            </Typography>
            <IconButton onClick={handleCloseExchangeModal}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="textSecondary">
              You Want:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {selectedSkill?.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              by {selectedSkill?.provider?.name || user?.name || 'Unknown'}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Skill to Offer</InputLabel>
            <Select
              value={selectedOfferSkill}
              onChange={(e) => setSelectedOfferSkill(e.target.value)}
              label="Select Skill to Offer"
            >
              {userSkills.map((skill) => (
                <MenuItem key={skill._id} value={skill._id}>
                  {skill.name} ({skill.level})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message (optional)"
            placeholder="Hi! I'm interested in exchanging my skill for yours."
            value={exchangeMessage}
            onChange={(e) => setExchangeMessage(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              onClick={handleCloseExchangeModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmitExchange}
              disabled={submitting || !selectedOfferSkill}
              sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1445' } }}
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Explore;