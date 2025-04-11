"use client";
import React, { useState } from 'react';
import { auth } from '@/app/Firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import '../styles/forgotpassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError(null);
        setLoading(true); // Set loading to true

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset link sent to your email.");
        } catch (err) {
            setError(err.message);
            if (err.code === 'auth/user-not-found') {
                setError("User not found. Please check your email.");
            }
            if (err.code === 'auth/invalid-email') {
                setError("Invalid email. Please enter a valid email.");
            }
        } finally {
            setLoading(false); // Set loading to false, regardless of success or error
        }
    };

    return (
        <div className="container">
            <div className="forgot-password-card">
                <h1>Reset Your Password</h1>
                <p className="subtitle">Enter your email to receive a password reset link</p>

                <form id="forgotPasswordForm" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        placeholder="Enter your email"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="back-to-login">
                    <a href="/login">Back to Sign In</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;