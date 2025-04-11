"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth } from '@/app/Firebase/config';

const SigninForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const router = useRouter();

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Set loading to true
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <form onSubmit={handleEmailSignIn} id="signInForm">
            {error && <p className="error-message">{error}</p>}
            <label htmlFor="email">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email"
                required
                disabled={loading} // Disable input when loading
            />

            <label htmlFor="password">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Enter your password"
                required
                disabled={loading} // Disable input when loading
            />

            <div className="form-footer">
                <a href="/forgotpassword" id="forgotPassword">
                    Forgot Password?
                </a>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
};

export default SigninForm;