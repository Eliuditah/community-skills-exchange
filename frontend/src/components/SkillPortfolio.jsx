import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Grid, Chip, 
  Avatar, Paper, LinearProgress, IconButton
} from '@mui/material';
import { 
  Folder, Star, TrendingUp, Verified, 
  Code, DesignServices, Business, Science,
  GitHub, LinkedIn, Twitter
} from '@mui/icons-material';
import axios from 'axios';

const SkillPortfolio = ({ userId }) => {
  const [portfolio, setPortfolio] = useState({
    skills: [],
    totalExchanges: 0,
    averageRating: 0,
    categories: [],
    featuredSkill: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const skillsRes = await axios.get(`http://localhost:5000/api/skills/user/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const exchangesRes = await axios.get('http://localhost:5000/api/exchanges/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const skills = skillsRes.data || [];
      const exchanges = exchangesRes.data || [];
      const completed = exchanges.filter(e => e.status === 'completed');

      // Get unique categories
      const categories = [...new Set(skills.map(s => s.category))];

      // Find featured skill (most requested)
      const skillRequestCount = {};
      exchanges.forEach(e => {
        const id = e.skillRequested?._id;
        if (id) skillRequestCount[id] = (skillRequestCount[id] || 0) + 1;
      });
      
      const featuredSkill = skills.sort((a, b) => 
        (skillRequestCount[b._id] || 0) - (skillRequestCount[a._id] || 0)
      )[0];

      setPortfolio({
        skills,
        totalExchanges: completed.length,
        averageRating: 4.5, // Placeholder
        categories,
        featuredSkill
      });
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      programming: <Code />,
      design: <DesignServices />,
      business: <Business />,
      data_science: <Science />,
      web_dev: <Code />,
      mobile_dev: <Code />,
      ai_ml: <Science />
    };
    return icons[category] || <Folder />;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Folder /> Skill Portfolio
        </Typography>

        {/* Featured Skill */}
        {portfolio.featuredSkill && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd', border: '2px solid #1a237e' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#1a237e' }}>⭐</Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Featured: {portfolio.featuredSkill.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Most requested skill • {portfolio.totalExchanges} exchanges
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Skills Grid */}
        <Grid container spacing={2}>
          {portfolio.skills.slice(0, 6).map((skill) => (
            <Grid item xs={12} sm={6} key={skill._id}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getCategoryIcon(skill.category)}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {skill.name}
                    </Typography>
                    <Chip 
                      label={skill.category?.replace('_', ' ').toUpperCase()}
                      size="small"
                      sx={{ bgcolor: '#e3f2fd', height: 20, fontSize: '0.6rem' }}
                    />
                    <Chip 
                      label={skill.level?.toUpperCase()}
                      size="small"
                      sx={{ bgcolor: '#e8f5e9', height: 20, fontSize: '0.6rem', ml: 0.5 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Social Links */}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <IconButton size="small"><GitHub /></IconButton>
          <IconButton size="small"><LinkedIn /></IconButton>
          <IconButton size="small"><Twitter /></IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillPortfolio;