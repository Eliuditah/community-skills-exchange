import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Grid, Tooltip, CircularProgress } from '@mui/material';
import { EmojiPeople, School, Groups, TrendingUp, Star } from '@mui/icons-material';
import axios from 'axios';

const ImpactScore = () => {
  const [impact, setImpact] = useState({
    peopleHelped: 0,
    skillsShared: 0,
    totalValue: 0,
    impactScore: 0,
    certificates: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const exchangesRes = await axios.get(`${API_URL}/exchanges/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const skillsRes = await axios.get(`${API_URL}/skills/user/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const exchanges = exchangesRes.data || [];
      const completed = exchanges.filter(e => e.status === 'completed');
      const userSkills = skillsRes.data || [];

      // Calculate impact metrics
      const peopleHelped = new Set(completed.map(e => 
        e.provider?._id === user._id ? e.requester?._id : e.provider?._id
      )).size;

      const skillsShared = userSkills.length;
      const totalValue = completed.reduce((acc, e) => acc + 5, 0); // 5 points per exchange

      // Impact score calculation
      const impactScore = Math.min(
        (peopleHelped * 10) + (skillsShared * 5) + (totalValue * 0.1),
        100
      );

      setImpact({
        peopleHelped,
        skillsShared,
        totalValue,
        impactScore: Math.round(impactScore),
        certificates: [
          { name: 'Community Helper', unlocked: peopleHelped >= 5 },
          { name: 'Skill Master', unlocked: skillsShared >= 5 },
          { name: 'Impact Maker', unlocked: impactScore >= 50 }
        ]
      });
    } catch (error) {
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <EmojiPeople color="primary" /> Your Impact Score
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              variant="determinate" 
              value={impact.impactScore}
              size={80}
              thickness={8}
              sx={{ color: impact.impactScore >= 50 ? '#4caf50' : '#ff9800' }}
            />
            <Box sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h5" fontWeight="bold">
                {impact.impactScore}%
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {impact.peopleHelped} people helped
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {impact.skillsShared} skills shared
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {impact.totalValue} impact points
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={1}>
          {impact.certificates.map((cert, index) => (
            <Grid item xs={4} key={index}>
              <Tooltip title={cert.unlocked ? '✅ Unlocked' : '🔒 Locked'}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 1,
                  bgcolor: cert.unlocked ? '#e8f5e9' : '#f5f5f5',
                  borderRadius: 1,
                  opacity: cert.unlocked ? 1 : 0.5
                }}>
                  <Typography variant="h4">{cert.unlocked ? '🏅' : '🔒'}</Typography>
                  <Typography variant="caption">{cert.name}</Typography>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ImpactScore;