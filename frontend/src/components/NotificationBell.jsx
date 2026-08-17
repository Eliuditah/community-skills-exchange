import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Notifications, CheckCircle, Pending, Cancel } from '@mui/icons-material';
import axios from 'axios';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/exchanges/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Filter to get pending exchanges (notifications)
      const pending = response.data.filter(ex => ex.status === 'pending');
      const notifications = pending.map(ex => ({
        id: ex._id,
        title: `New exchange request for ${ex.skillRequested?.name || 'a skill'}`,
        message: `${ex.requester?.name || 'Someone'} wants to exchange with you`,
        time: new Date(ex.createdAt).toLocaleString(),
        read: false
      }));

      setNotifications(notifications);
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUnreadCount(0);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>
            <Typography color="textSecondary">No new notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem key={notif.id} onClick={handleClose}>
              <Box>
                <Typography variant="subtitle2">{notif.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {notif.message} • {notif.time}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;