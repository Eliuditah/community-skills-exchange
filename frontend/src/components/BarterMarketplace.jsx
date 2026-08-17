import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Grid, Button, 
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Checkbox, FormControlLabel, TextField, IconButton
} from '@mui/material';
import { ShoppingCart, Add, Remove, SwapHoriz, Close } from '@mui/icons-material';
import axios from 'axios';

const BarterMarketplace = () => {
  const [skills, setSkills] = useState([]);
  const [basket, setBasket] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [proposedSkills, setProposedSkills] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchSkills();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/skills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSkills(response.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleOpenBarter = () => {
    setOpenDialog(true);
    setSelectedSkills([]);
    setProposedSkills([]);
  };

  const handleCloseBarter = () => {
    setOpenDialog(false);
  };

  const handleSubmitBarter = async () => {
    try {
      const token = localStorage.getItem('token');
      // Create multiple exchange requests
      for (const skill of selectedSkills) {
        const exchangeData = {
          skillOffered: proposedSkills[0]?._id, // User's skill
          skillRequested: skill._id,
          message: `Barter offer: ${proposedSkills.map(s => s.name).join(', ')} for ${selectedSkills.map(s => s.name).join(', ')}`
        };
        
        await axios.post(`${API_URL}/exchanges`, exchangeData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      alert('✅ Barter offers sent successfully! The receiver will be notified via email.');
      handleCloseBarter();
    } catch (error) {
      console.error('Error submitting barter:', error);
      alert('Failed to submit barter offers');
    }
  };

  const toggleSkillSelection = (skill) => {
    setSelectedSkills(prev => 
      prev.some(s => s._id === skill._id) ? prev.filter(s => s._id !== skill._id) : [...prev, skill]
    );
  };

  return (
    <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCart color="primary" /> Barter Marketplace
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<SwapHoriz />}
            onClick={handleOpenBarter}
            sx={{ bgcolor: '#1a237e' }}
          >
            Start Barter
          </Button>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Bundle multiple skills and offer them as a package deal!
        </Typography>

        <Dialog open={openDialog} onClose={handleCloseBarter} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">🔄 Barter Multiple Skills</Typography>
              <IconButton onClick={handleCloseBarter}><Close /></IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Select skills you want to acquire:
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {skills
                .filter(s => s.provider?._id !== currentUser?._id)
                .map((skill) => (
                  <Grid item xs={12} sm={6} key={skill._id}>
                    <Box sx={{ 
                      p: 1.5, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1,
                      bgcolor: selectedSkills.some(s => s._id === skill._id) ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={() => toggleSkillSelection(skill)}
                    >
                      <FormControlLabel
                        control={<Checkbox checked={selectedSkills.some(s => s._id === skill._id)} />}
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{skill.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              by {skill.provider?.name || 'Unknown'}
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </Grid>
                ))}
            </Grid>

            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              You offer (select from your skills):
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {skills
                .filter(s => s.provider?._id === currentUser?._id)
                .map((skill) => (
                  <Grid item xs={12} sm={6} key={skill._id}>
                    <Box sx={{ 
                      p: 1.5, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1,
                      bgcolor: proposedSkills.some(s => s._id === skill._id) ? '#e8f5e9' : 'white',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                    onClick={() => {
                      setProposedSkills(prev => 
                        prev.some(s => s._id === skill._id) ? prev.filter(s => s._id !== skill._id) : [...prev, skill]
                      );
                    }}
                    >
                      <FormControlLabel
                        control={<Checkbox checked={proposedSkills.some(s => s._id === skill._id)} />}
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{skill.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              Your skill
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseBarter}>Cancel</Button>
            <Button 
              onClick={handleSubmitBarter}
              variant="contained"
              disabled={selectedSkills.length === 0 || proposedSkills.length === 0}
              sx={{ bgcolor: '#1a237e' }}
            >
              Send Barter ({selectedSkills.length} skills)
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BarterMarketplace;