import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Container, 
  Avatar, Menu, MenuItem, Box, Badge, IconButton,
  Tooltip  // Removed Grid from here
} from '@mui/material';
import { 
  AccountCircle, ExitToApp, Dashboard, Person, 
  Explore, PostAdd, Home
} from '@mui/icons-material';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Don't render user-specific elements while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar position="sticky" sx={{ backgroundColor: '#1a237e' }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'white',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { opacity: 0.9 }
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🤝</span>
              SkillExchange
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <div>Loading...</div>
        </Container>
      </div>
    );
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="sticky" sx={{ backgroundColor: '#1a237e' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { opacity: 0.9 }
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🤝</span>
            SkillExchange
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Explore Skills">
              <Button 
                color="inherit" 
                component={Link} 
                to="/explore"
                startIcon={<Explore />}
                sx={{ 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Explore
              </Button>
            </Tooltip>
            
            {user ? (
              <>
                <Tooltip title="Dashboard">
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/dashboard"
                    startIcon={<Dashboard />}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Dashboard
                  </Button>
                </Tooltip>
                
                <Tooltip title="Post a Skill">
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/post-skill"
                    startIcon={<PostAdd />}
                    sx={{ 
                      bgcolor: 'rgba(76, 175, 80, 0.2)',
                      '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.3)' }
                    }}
                  >
                    Post Skill
                  </Button>
                </Tooltip>
                
                <NotificationBell />
                
                <Tooltip title="Profile Settings">
                  <Avatar 
                    onClick={handleMenu}
                    sx={{ 
                      cursor: 'pointer', 
                      bgcolor: '#4caf50',
                      width: 40,
                      height: 40,
                      border: '2px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s',
                      '&:hover': { 
                        border: '2px solid white',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </Avatar>
                </Tooltip>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      borderRadius: 2
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <MenuItem component={Link} to="/profile" onClick={handleClose}>
                    <Person sx={{ mr: 1 }} /> My Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                    <Dashboard sx={{ mr: 1 }} /> Dashboard
                  </MenuItem>
                  <MenuItem component={Link} to="/explore" onClick={handleClose}>
                    <Explore sx={{ mr: 1 }} /> Explore Skills
                  </MenuItem>
                  <Box sx={{ borderTop: '1px solid #e0e0e0', mt: 1 }}>
                    <MenuItem onClick={handleLogout} sx={{ color: '#f44336' }}>
                      <ExitToApp sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Box>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/register"
                  sx={{ 
                    bgcolor: '#4caf50', 
                    '&:hover': { bgcolor: '#388e3c' } 
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>

      <footer className="bg-gray-800 text-white py-6 mt-8">
        <Container maxWidth="lg">
          {/* Using Box instead of Grid to avoid the error */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                SkillExchange
              </Typography>
              <Typography variant="caption" display="block" color="gray">
                Connect, Learn, and Exchange Skills
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="caption" display="block" color="gray">
                <Link to="/explore" style={{ color: 'gray', textDecoration: 'none' }}>Explore Skills</Link>
              </Typography>
              <Typography variant="caption" display="block" color="gray">
                <Link to="/post-skill" style={{ color: 'gray', textDecoration: 'none' }}>Post a Skill</Link>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                About
              </Typography>
              <Typography variant="caption" display="block" color="gray">
                Community Skills Exchange System
              </Typography>
              <Typography variant="caption" display="block" color="gray">
                Version 2.0
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #37474f' }}>
            <Typography variant="body2" align="center" color="gray">
              © 2026 Community Skills Exchange System. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;