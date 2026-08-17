import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip, Tooltip } from '@mui/material';
import { Whatshot, EmojiEvents, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const SkillStreak = () => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    dailyProgress: 0,
    lastExchange: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/exchanges/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const exchanges = response.data || [];
      const completed = exchanges.filter(e => e.status === 'completed');
      
      // Calculate streak from completed exchanges
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Sort by date
      const sorted = completed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Simple streak calculation
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0 || new Date(sorted[i].createdAt).getDate() === new Date(sorted[i-1].createdAt).getDate() - 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      }
      
      currentStreak = tempStreak;

      setStreakData({
        currentStreak,
        longestStreak,
        dailyProgress: Math.min((currentStreak / 7) * 100, 100),
        lastExchange: sorted[0]?.createdAt
      });
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return '🔥🔥🔥';
    if (streakData.currentStreak >= 14) return '🔥🔥';
    if (streakData.currentStreak >= 7) return '🔥';
    if (streakData.currentStreak >= 3) return '💪';
    return '🌱';
  };

  const getStreakColor = () => {
    if (streakData.currentStreak >= 30) return '#f44336';
    if (streakData.currentStreak >= 14) return '#ff9800';
    if (streakData.currentStreak >= 7) return '#ffc107';
    return '#4caf50';
  };

  return (
    <Card sx={{ 
      mb: 3, 
      background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
      border: `2px solid ${getStreakColor()}`
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Whatshot sx={{ color: getStreakColor() }} /> 
            Skill Streak
          </Typography>
          <Chip 
            label={`${streakData.currentStreak} Days`}
            sx={{ 
              bgcolor: getStreakColor(), 
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: '3rem' }}>
            {getStreakEmoji()}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={streakData.dailyProgress}
              sx={{ 
                height: 12, 
                borderRadius: 6,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getStreakColor()
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption">Day 1</Typography>
              <Typography variant="caption">Day 7 🎯</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Box textAlign="center">
            <Typography variant="h4" sx={{ color: getStreakColor() }}>
              {streakData.currentStreak}
            </Typography>
            <Typography variant="caption" color="textSecondary">Current Streak</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" sx={{ color: '#ffd700' }}>
              {streakData.longestStreak}
            </Typography>
            <Typography variant="caption" color="textSecondary">Best Streak</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" sx={{ color: '#2196f3' }}>
              {streakData.currentStreak >= 7 ? '🏆' : '🌱'}
            </Typography>
            <Typography variant="caption" color="textSecondary">Status</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillStreak;