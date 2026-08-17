import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Tooltip } from '@mui/material';
import { EmojiEvents, Star, TrendingUp, Whatshot, School, People, Verified, Rocket } from '@mui/icons-material';

const BadgeSystem = ({ user }) => {
  const exchanges = user?.exchanges || 0;
  const skills = user?.skills || 0;

  const badges = [
    { id: 'first_exchange', icon: <EmojiEvents />, label: 'First Exchange', unlocked: exchanges >= 1, color: '#ffd700' },
    { id: 'skill_expert', icon: <School />, label: 'Skill Expert', unlocked: skills >= 5, color: '#4caf50' },
    { id: 'popular', icon: <People />, label: 'Popular Provider', unlocked: exchanges >= 10, color: '#2196f3' },
    { id: 'trending', icon: <TrendingUp />, label: 'Trending', unlocked: exchanges >= 5, color: '#ff9800' },
    { id: 'superstar', icon: <Whatshot />, label: 'Superstar', unlocked: exchanges >= 20, color: '#f44336' },
    { id: 'verified', icon: <Verified />, label: 'Verified', unlocked: exchanges >= 3 && skills >= 2, color: '#9c27b0' },
    { id: 'rocket', icon: <Rocket />, label: 'Early Adopter', unlocked: true, color: '#00bcd4' },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalBadges = badges.length;

  return (
    <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="warning" /> Badges & Achievements
          <Chip 
            label={`${unlockedCount}/${totalBadges}`}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {badges.map((badge) => (
            <Grid item xs={6} sm={4} md={3} key={badge.id}>
              <Tooltip title={badge.unlocked ? `✅ ${badge.label}` : `🔒 Locked: ${badge.label}`}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: badge.unlocked ? `${badge.color}20` : '#f5f5f5',
                  opacity: badge.unlocked ? 1 : 0.4,
                  transition: 'all 0.3s',
                  border: badge.unlocked ? `2px solid ${badge.color}` : '2px solid #e0e0e0',
                  '&:hover': { transform: badge.unlocked ? 'scale(1.1)' : 'none' }
                }}>
                  <Box sx={{ fontSize: 40, color: badge.unlocked ? badge.color : '#999' }}>
                    {badge.icon}
                  </Box>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, fontWeight: badge.unlocked ? 'bold' : 'normal' }}>
                    {badge.label}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            {exchanges} exchanges completed • {skills} skills posted
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BadgeSystem;