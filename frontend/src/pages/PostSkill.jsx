import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Typography, 
  Alert, Box, MenuItem, Paper,
  IconButton, CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';

const PostSkill = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    level: 'beginner',
    tags: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Get token and user data
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.name.trim()) {
        setError('Please enter a skill name');
        setLoading(false);
        return;
      }
      if (!formData.category) {
        setError('Please select a category');
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError('Please enter a description');
        setLoading(false);
        return;
      }

      // Process tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Prepare skill data
      const skillData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        level: formData.level,
        tags: tags,
        image: formData.image || '',
        userId: userData._id || userData.id // Send user ID as fallback
      };

      console.log('📤 Sending skill data:', skillData);

      // Make API request
      const response = await axios.post(
        'http://localhost:5000/api/skills',
        skillData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('✅ Skill posted successfully:', response.data);
      setSuccess('✅ Skill posted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        level: 'beginner',
        tags: '',
        image: ''
      });
      setImagePreview('');
      
      // Navigate to dashboard after delay
      setTimeout(() => navigate('/dashboard'), 2000);
      
    } catch (err) {
      console.error('❌ Error posting skill:', err);
      
      // Handle different error types
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(err.response.data?.message || 'Failed to post skill. Please try again.');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Cannot connect to server. Please check if backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError('Failed to post skill. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <Paper sx={{ maxWidth: 700, width: '100%', p: 4, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ mb: 1, color: '#1a237e', fontWeight: 'bold' }}>
            📝 Post a Skill
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Share your knowledge and expertise with the community
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Skill Name */}
            <TextField
              fullWidth
              label="Skill Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., React Development, Carpentry, Python"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            {/* Category */}
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              disabled={loading}
            >
              <MenuItem value="">Select a category</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.replace('_', ' ').toUpperCase()}
                </MenuItem>
              ))}
            </TextField>

            {/* Level */}
            <TextField
              fullWidth
              select
              label="Level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
              disabled={loading}
            >
              {levels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              placeholder="Describe your skill, experience level, and what you can teach..."
              sx={{ mb: 2 }}
              disabled={loading}
            />

            {/* Tags */}
            <TextField
              fullWidth
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., react, javascript, web-development"
              helperText="Separate tags with commas"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            {/* Image Upload */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Upload Skill Image
              </Typography>
              
              {imagePreview ? (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={imagePreview} 
                    alt="Skill preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0'
                    }} 
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      bgcolor: 'white',
                      boxShadow: 1,
                      '&:hover': { bgcolor: '#ffebee' }
                    }}
                    disabled={loading}
                  >
                    <CloseIcon sx={{ color: 'red' }} />
                  </IconButton>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    width: '100%', 
                    py: 3,
                    borderStyle: 'dashed',
                    borderWidth: '2px'
                  }}
                  disabled={loading}
                >
                  Click to upload image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                    disabled={loading}
                  />
                </Button>
              )}
              <Typography variant="caption" color="textSecondary">
                Upload a photo of your skill or project (optional, max 5MB)
              </Typography>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#4caf50', 
                '&:hover': { bgcolor: '#388e3c' },
                '&:disabled': { bgcolor: '#a5d6a7' },
                py: 1.5,
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                  Posting...
                </>
              ) : (
                <>
                  <AddIcon sx={{ mr: 1 }} />
                  Post Skill
                </>
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
};

export default PostSkill;