import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Avatar, Grid, 
  Chip, Button, Divider, CircularProgress, LinearProgress,
  Paper
} from '@mui/material';
import { 
  Person, Email, LocationOn, Star, Code, SwapHoriz, 
  Edit, Settings, EventNote, ThumbUp, People,
  CheckCircle, Pending // Added CheckCircle, Pending icons
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';
import BadgeSystem from '../components/BadgeSystem';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// WhatsApp Button Component to be used inside Profile
const WhatsAppConnectButton = ({ phoneNumber }) => {
  const handleWhatsAppClick = () => {
    if (!phoneNumber) {
      alert("No phone number associated with this account.");
      return;
    }
    // Clean the number to remove dashes/spaces, keeping '+' for country codes
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent("Hi! I connected with you through SkillExchange. Let's exchange skills!");
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <Button 
      variant="contained"
      onClick={handleWhatsAppClick}
      disabled={!phoneNumber}
      sx={{
        bgcolor: phoneNumber ? '#25D366' : '#bdbdbd',
        color: 'white',
        '&:hover': {
          bgcolor: phoneNumber ? '#128C7E' : '#bdbdbd',
        },
        textTransform: 'none'
      }}
      startIcon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      }
    >
      {phoneNumber ? 'Chat on WhatsApp' : 'No Phone Number'}
    </Button>
  );
};

const Profile = () => {
  const { user: authUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [userExchanges, setUserExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExchanges: 0,
    completedExchanges: 0,
    pendingExchanges: 0,
    rating: 0
  });

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      fetchProfile();
    }
  }, [authUser]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch user skills
      const skillsRes = await axios.get(`${API_URL}/skills/user/${authUser._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch user exchanges
      const exchangesRes = await axios.get(`${API_URL}/exchanges/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const exchanges = exchangesRes.data || [];
      const completed = exchanges.filter(e => e.status === 'completed');
      const pending = exchanges.filter(e => e.status === 'pending' || e.status === 'accepted');

      setUser(response.data);
      setUserSkills(skillsRes.data || []);
      setUserExchanges(exchanges);
      setStats({
        totalExchanges: exchanges.length,
        completedExchanges: completed.length,
        pendingExchanges: pending.length,
        rating: completed.length > 0 ? 4.5 : 0 // Placeholder
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const achievements = [
    { label: 'Total Exchanges', value: stats.totalExchanges, icon: <SwapHoriz />, color: '#2196f3' },
    { label: 'Completed', value: stats.completedExchanges, icon: <CheckCircle />, color: '#4caf50' },
    { label: 'Pending', value: stats.pendingExchanges, icon: <Pending />, color: '#ff9800' },
    { label: 'Rating', value: stats.rating ? `${stats.rating}⭐` : 'N/A', icon: <Star />, color: '#ffd700' },
  ];

  return (
    <Layout>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Card sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #1a237e 0%, #0d1445 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: -100, 
              right: -100, 
              width: 300, 
              height: 300, 
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)'
            }} />
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: '#4caf50',
                    fontSize: 40,
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" fontWeight="bold">
                  {user?.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Email sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{user?.email}</Typography>
                </Box>
                {user?.bio && (
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {user.bio}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Star />} 
                    label={`${stats.rating || 0} Rating`}
                    sx={{ bgcolor: '#ffd700', color: '#1a237e', fontWeight: 'bold' }}
                  />
                  <Chip 
                    icon={<Code />} 
                    label={`${userSkills.length} Skills`}
                    sx={{ bgcolor: '#4caf50', color: 'white' }}
                  />
                  <Chip 
                    icon={<SwapHoriz />} 
                    label={`${stats.totalExchanges} Exchanges`}
                    sx={{ bgcolor: '#2196f3', color: 'white' }}
                  />
                  <Chip 
                    icon={<People />} 
                    label={`${stats.completedExchanges} Completed`}
                    sx={{ bgcolor: '#9c27b0', color: 'white' }}
                  />
                </Box>
              </Grid>
              <Grid item sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Edit />}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Edit Profile
                </Button>
                
                {/* 🌟 NEW: WhatsApp Button */}
                <WhatsAppConnectButton phoneNumber={user?.phone} />
                
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {achievements.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card sx={{ 
                  textAlign: 'center', 
                  p: 2,
                  borderTop: `4px solid ${stat.color}`,
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <Box sx={{ color: stat.color, fontSize: 32 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Badges */}
        <Grid item xs={12}>
          <BadgeSystem user={{ 
            ...user, 
            skills: userSkills.length, 
            exchanges: stats.totalExchanges 
          }} />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventNote /> Recent Activity
              </Typography>
              {userExchanges.slice(0, 5).length === 0 ? (
                <Typography color="textSecondary">
                  No recent activity. Start exchanging skills!
                </Typography>
              ) : (
                userExchanges.slice(0, 5).map((exchange) => (
                  <Box key={exchange._id} sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    bgcolor: '#f5f5f5', 
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {exchange.skillRequested?.name || 'Skill'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        with {exchange.provider?.name || 'Unknown'}
                      </Typography>
                    </Box>
                    <Chip 
                      label={exchange.status.toUpperCase()}
                      size="small"
                      sx={{ 
                        bgcolor: exchange.status === 'completed' ? '#4caf50' : 
                                exchange.status === 'pending' ? '#ff9800' : '#2196f3',
                        color: 'white'
                      }}
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User's Skills */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code /> My Skills
              </Typography>
              {userSkills.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="textSecondary" gutterBottom>
                    You haven't posted any skills yet.
                  </Typography>
                  <Button 
                    component={Link} 
                    to="/post-skill" 
                    variant="contained" 
                    size="small"
                    sx={{ mt: 1, bgcolor: '#4caf50' }}
                  >
                    Post Your First Skill
                  </Button>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {userSkills.map((skill) => (
                    <Paper key={skill._id} sx={{ 
                      p: 1.5, 
                      mb: 1, 
                      bgcolor: '#f8f9fa',
                      '&:hover': { bgcolor: '#e3f2fd' }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {skill.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            <Chip 
                              label={skill.category?.replace('_', ' ').toUpperCase()}
                              size="small"
                              sx={{ bgcolor: '#e3f2fd', height: 20, fontSize: '0.65rem' }}
                            />
                            <Chip 
                              label={skill.level?.toUpperCase()}
                              size="small"
                              sx={{ bgcolor: '#e8f5e9', height: 20, fontSize: '0.65rem' }}
                            />
                          </Box>
                        </Box>
                        <Button 
                          size="small" 
                          variant="outlined"
                          component={Link}
                          to={`/explore`}
                        >
                          View
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;