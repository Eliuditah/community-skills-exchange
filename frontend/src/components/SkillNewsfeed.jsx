import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, Avatar, 
  Chip, IconButton, Divider, Paper, CircularProgress
} from '@mui/material';
import { 
  Favorite, Comment, Share, TrendingUp, 
  Whatshot, EmojiEvents, Person, AccessTime
} from '@mui/icons-material';
import axios from 'axios';

const SkillNewsfeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const exchangesRes = await axios.get(`${API_URL}/exchanges/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const exchanges = exchangesRes.data || [];
      
      const feedItems = exchanges.map(ex => {
        let type = 'exchange';
        let message = '';
        let icon = null;
        let color = '#2196f3';
        
        if (ex.status === 'completed') {
          type = 'completed';
          message = `${ex.requester?.name} completed an exchange for ${ex.skillRequested?.name}`;
          icon = <EmojiEvents sx={{ color: '#ffd700' }} />;
          color = '#4caf50';
        } else if (ex.status === 'pending') {
          type = 'request';
          message = `${ex.requester?.name} requested ${ex.skillRequested?.name}`;
          icon = <TrendingUp sx={{ color: '#2196f3' }} />;
          color = '#ff9800';
        } else if (ex.status === 'accepted') {
          type = 'accepted';
          message = `${ex.provider?.name} accepted an exchange for ${ex.skillOffered?.name}`;
          icon = <Whatshot sx={{ color: '#ff9800' }} />;
          color = '#4caf50';
        }

        return {
          id: ex._id,
          type,
          message,
          icon,
          color,
          timestamp: new Date(ex.createdAt),
          user: ex.requester || ex.provider,
          likes: Math.floor(Math.random() * 10),
          comments: Math.floor(Math.random() * 5)
        };
      });

      const sorted = feedItems.sort((a, b) => b.timestamp - a.timestamp);
      setFeed(sorted.slice(0, 10));
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) return <CircularProgress size={30} />;
  if (feed.length === 0) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Whatshot color="error" /> Activity Feed
        </Typography>
        
        {feed.map((item, index) => (
          <Paper key={item.id} sx={{ 
            p: 2, 
            mb: 1.5, 
            bgcolor: '#f8f9fa',
            borderLeft: `4px solid ${item.color}`,
            '&:hover': { bgcolor: '#e3f2fd' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: item.color, width: 36, height: 36 }}>
                {item.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {item.message}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <AccessTime sx={{ fontSize: 14, color: '#999' }} />
                  <Typography variant="caption" color="textSecondary">
                    {getTimeAgo(item.timestamp)}
                  </Typography>
                  <Chip 
                    label={item.type.toUpperCase()}
                    size="small"
                    sx={{ 
                      height: 20, 
                      fontSize: '0.6rem',
                      bgcolor: item.color,
                      color: 'white'
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleLike(item.id)}>
                  <Favorite sx={{ color: liked[item.id] ? '#f44336' : '#999' }} />
                </IconButton>
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {liked[item.id] ? item.likes + 1 : item.likes}
                </Typography>
                <IconButton size="small">
                  <Comment sx={{ color: '#999' }} />
                </IconButton>
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {item.comments}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </CardContent>
    </Card>
  );
};

export default SkillNewsfeed;