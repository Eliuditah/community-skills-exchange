import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, Chip, 
  Button, Tabs, Tab, Avatar, Divider, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Rating, Snackbar, Alert
} from '@mui/material';
import { 
  SwapHoriz, CheckCircle, Cancel, Pending, 
  People, Star, Message, AccessTime 
} from '@mui/icons-material';
import axios from 'axios';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/exchanges/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setExchanges(response.data);
    } catch (error) {
      console.error('Error fetching exchanges:', error);
      showSnackbar('Failed to load exchanges', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (exchangeId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/exchanges/${exchangeId}/${action}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Update the exchange in the list
      setExchanges(exchanges.map(ex => 
        ex._id === exchangeId ? response.data : ex
      ));
      
      showSnackbar(`Exchange ${action}ed successfully!`, 'success');
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(error.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleOpenDialog = (exchange, action) => {
    setSelectedExchange(exchange);
    setDialogAction(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExchange(null);
    setFeedback('');
    setRating(0);
  };

  const handleSubmitFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const isRequester = selectedExchange.requester._id === currentUser?._id;
      
      const feedbackData = {
        rating: rating,
        feedback: feedback
      };

      // In a real app, you'd have a dedicated feedback endpoint
      // For now, we'll just update the exchange with the feedback
      const response = await axios.put(
        `http://localhost:5000/api/exchanges/${selectedExchange._id}/complete`,
        { 
          rating: feedbackData.rating,
          feedback: feedbackData.feedback 
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setExchanges(exchanges.map(ex => 
        ex._id === selectedExchange._id ? response.data : ex
      ));

      showSnackbar('Feedback submitted successfully!', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showSnackbar('Failed to submit feedback', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      accepted: '#2196f3',
      ongoing: '#9c27b0',
      completed: '#4caf50',
      cancelled: '#f44336',
      rejected: '#f44336'
    };
    return colors[status] || '#999';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending sx={{ fontSize: 20 }} />,
      accepted: <CheckCircle sx={{ fontSize: 20 }} />,
      ongoing: <SwapHoriz sx={{ fontSize: 20 }} />,
      completed: <CheckCircle sx={{ fontSize: 20 }} />,
      cancelled: <Cancel sx={{ fontSize: 20 }} />,
      rejected: <Cancel sx={{ fontSize: 20 }} />
    };
    return icons[status] || null;
  };

  const getFilteredExchanges = () => {
    const statuses = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];
    const currentStatus = statuses[tabValue];
    if (tabValue === 0) return exchanges;
    return exchanges.filter(ex => ex.status === currentStatus);
  };

  const isProvider = (exchange) => {
    return exchange.provider._id === currentUser?._id;
  };

  const canAct = (exchange, action) => {
    const actions = {
      accept: exchange.status === 'pending' && isProvider(exchange),
      complete: exchange.status === 'accepted' && !isProvider(exchange),
      cancel: exchange.status !== 'completed' && exchange.status !== 'cancelled'
    };
    return actions[action] || false;
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

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 3, color: '#1a237e', fontWeight: 'bold' }}>
        📊 Exchange Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', p: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h3">{exchanges.length}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', p: 2 }}>
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h3">
              {exchanges.filter(e => e.status === 'pending').length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', p: 2 }}>
            <Typography variant="h6">Active</Typography>
            <Typography variant="h3">
              {exchanges.filter(e => e.status === 'accepted' || e.status === 'ongoing').length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fce4ec', p: 2 }}>
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h3">
              {exchanges.filter(e => e.status === 'completed').length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All" />
        <Tab label="Pending" />
        <Tab label="Accepted" />
        <Tab label="Ongoing" />
        <Tab label="Completed" />
        <Tab label="Cancelled" />
      </Tabs>

      {/* Exchanges List */}
      {getFilteredExchanges().length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No exchanges found in this category
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {getFilteredExchanges().map((exchange) => (
            <Grid item xs={12} key={exchange._id}>
              <Card sx={{ 
                p: 3,
                borderLeft: `4px solid ${getStatusColor(exchange.status)}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateX(8px)' }
              }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Exchange Details */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        label={exchange.status.toUpperCase()}
                        sx={{ 
                          bgcolor: getStatusColor(exchange.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        icon={getStatusIcon(exchange.status)}
                      />
                      <Chip 
                        label={`${exchange.requester?.name || 'Unknown'} → ${exchange.provider?.name || 'Unknown'}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary">Offering:</Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {exchange.skillOffered?.name || 'Unknown'}
                        </Typography>
                      </Box>
                      <SwapHoriz color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">Requesting:</Typography>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {exchange.skillRequested?.name || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>

                    {exchange.message && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Message sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="caption" color="textSecondary">
                          "{exchange.message}"
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <AccessTime sx={{ fontSize: 14, color: '#666' }} />
                      <Typography variant="caption" color="textSecondary">
                        {new Date(exchange.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {exchange.status === 'pending' && isProvider(exchange) && (
                        <>
                          <Button 
                            variant="contained" 
                            color="success"
                            size="small"
                            onClick={() => handleAction(exchange._id, 'accept')}
                          >
                            <CheckCircle sx={{ mr: 1 }} /> Accept
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error"
                            size="small"
                            onClick={() => handleAction(exchange._id, 'cancel')}
                          >
                            <Cancel sx={{ mr: 1 }} /> Decline
                          </Button>
                        </>
                      )}

                      {exchange.status === 'pending' && !isProvider(exchange) && (
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="small"
                          onClick={() => handleAction(exchange._id, 'cancel')}
                        >
                          <Cancel sx={{ mr: 1 }} /> Cancel Request
                        </Button>
                      )}

                      {exchange.status === 'accepted' && !isProvider(exchange) && (
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="small"
                          onClick={() => handleAction(exchange._id, 'complete')}
                        >
                          <CheckCircle sx={{ mr: 1 }} /> Mark Complete
                        </Button>
                      )}

                      {exchange.status === 'completed' && (
                        <Button 
                          variant="outlined" 
                          color="secondary"
                          size="small"
                          onClick={() => handleOpenDialog(exchange, 'feedback')}
                        >
                          <Star sx={{ mr: 1 }} /> Rate & Feedback
                        </Button>
                      )}

                      {exchange.status === 'accepted' && isProvider(exchange) && (
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="small"
                          onClick={() => handleAction(exchange._id, 'cancel')}
                        >
                          <Cancel sx={{ mr: 1 }} /> Cancel
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Feedback Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Star color="warning" /> Rate Your Exchange Experience
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              How was your experience with {selectedExchange?.requester?.name || 'this user'}?
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Rating
                value={rating}
                onChange={(e, v) => setRating(v || 0)}
                size="large"
                precision={1}
                sx={{ fontSize: 40 }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Feedback"
              placeholder="Share your experience with this exchange..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Skip</Button>
          <Button 
            onClick={handleSubmitFeedback} 
            variant="contained"
            disabled={rating === 0}
            sx={{ bgcolor: '#1a237e' }}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Dashboard;