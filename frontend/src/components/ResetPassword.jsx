import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import Layout from './Layout';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setIsError(true);
            return;
        }
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            setIsError(true);
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, { password });
            setMessage(res.data.message);
            setIsError(false);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error resetting password. The link may have expired.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
                <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
                    <CardContent>
                        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#1a237e' }}>
                            New Password
                        </Typography>
                        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                            Enter your new password below
                        </Typography>

                        {message && (
                            <Alert severity={isError ? 'error' : 'success'} sx={{ mb: 2 }}>
                                {message}
                                {!isError && ' Redirecting to login...'}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                disabled={loading}
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }, py: 1.5 }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>

                        <Typography align="center" sx={{ mt: 2 }}>
                            <Link to="/login" style={{ color: '#1a237e', fontWeight: 'bold' }}>
                                Back to Login
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
};

export default ResetPassword;
