import axios from 'axios';
import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || "Error sending email");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send Reset Email</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
export default ForgotPassword;