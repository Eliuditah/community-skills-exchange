import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { VideoCall, Videocam, Schedule, People } from '@mui/icons-material';

const VideoCallComponent = ({ exchange }) => {
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [callSchedule, setCallSchedule] = useState('');
  const [callLink, setCallLink] = useState('');

  const generateCallLink = () => {
    // Generate a random meeting ID
    const meetingId = Math.random().toString(36).substring(2, 10);
    return `https://meet.jit.si/SkillExchange-${meetingId}`;
  };

  const handleScheduleCall = () => {
    const link = generateCallLink();
    setCallLink(link);
    alert(`✅ Video call scheduled! Link: ${link}`);
    setOpenCallDialog(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <VideoCall sx={{ color: '#4caf50', fontSize: 40 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Live Skill Session
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Schedule a real-time video call for hands-on skill sharing
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Videocam />}
            onClick={() => setOpenCallDialog(true)}
            sx={{ bgcolor: '#4caf50' }}
          >
            Schedule Call
          </Button>
        </Box>

        <Dialog open={openCallDialog} onClose={() => setOpenCallDialog(false)}>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Videocam color="primary" /> Schedule Video Session
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Schedule a live video call to exchange skills in real-time.
              </Typography>
              <TextField
                fullWidth
                label="Preferred Time"
                type="datetime-local"
                value={callSchedule}
                onChange={(e) => setCallSchedule(e.target.value)}
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={<Schedule />} label="30 min session" size="small" />
                <Chip icon={<People />} label="1-on-1" size="small" />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCallDialog(false)}>Cancel</Button>
            <Button onClick={handleScheduleCall} variant="contained" color="primary">
              Create Call Link
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default VideoCallComponent;