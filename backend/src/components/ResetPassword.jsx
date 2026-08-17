import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setMessage("Password reset successfully! Login now.");
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Enter New Password</h2>
            <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Reset Password</button>
            {message && <p>{message}</p>}
        </form>
    );
};
export default ResetPassword;