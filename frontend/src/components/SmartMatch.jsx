import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Button, Chip, Box, CircularProgress } from '@mui/material';
import { Recommend, TrendingUp, People } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SmartMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findMatches();
  }, []);

  const findMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user._id) {
        setLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Get user's skills
      const userSkillsRes = await axios.get(`${API_URL}/skills/user/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Get all skills
      const allSkillsRes = await axios.get(`${API_URL}/skills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const userSkills = userSkillsRes.data || [];
      const allSkills = allSkillsRes.data || [];

      // Find complementary matches
      const userSkillIds = userSkills.map(s => s._id);
      const matches = allSkills
        .filter(skill => 
          !userSkillIds.includes(skill._id) && 
          skill.provider?._id !== user._id
        )
        .map(skill => ({
          ...skill,
          matchScore: calculateMatchScore(skill, userSkills)
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);

      setMatches(matches);
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (targetSkill, userSkills) => {
    let score = 0;
    if (userSkills.some(s => s.category === targetSkill.category)) score += 30;
    const levels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    if (userSkills.some(s => Math.abs(levels[s.level] - levels[targetSkill.level]) <= 1)) score += 20;
    const userTags = userSkills.flatMap(s => s.tags || []);
    const targetTags = targetSkill.tags || [];
    const overlap = userTags.filter(tag => targetTags.includes(tag)).length;
    score += overlap * 10;
    return Math.min(score, 100);
  };

  if (loading) return <CircularProgress size={30} />;
  if (matches.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Recommend color="primary" /> Smart Matches for You
      </Typography>
      <Grid container spacing={2}>
        {matches.map((match) => (
          <Grid item xs={12} sm={6} md={4} key={match._id}>
            <Card sx={{ 
              border: `2px solid ${match.matchScore > 70 ? '#4caf50' : match.matchScore > 50 ? '#ff9800' : '#2196f3'}`,
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.02)' }
            }}>
              <CardContent>
                <Typography variant="h6" noWrap>{match.name}</Typography>
                <Chip 
                  label={`${match.matchScore}% Match`}
                  sx={{ 
                    bgcolor: match.matchScore > 70 ? '#4caf50' : match.matchScore > 50 ? '#ff9800' : '#2196f3',
                    color: 'white',
                    mt: 1
                  }}
                  size="small"
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, height: 40, overflow: 'hidden' }}>
                  {match.description?.substring(0, 60)}...
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="small"
                  sx={{ mt: 2, bgcolor: '#1a237e' }}
                  onClick={() => navigate(`/explore`)}
                >
                  View Skill
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SmartMatch;