"use client";
import React, { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { auth, googleProvider } from "@/app/Firebase/config";
import { signInWithPopup, OAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation';
import '../styles/signin.css';
import SigninForm from './component/SigninForm';
import { useDispatch } from 'react-redux';
import { login } from '@/lib/features/authSlice'; // Import login action

const Login = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch(); // Get dispatch function

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      dispatch(login({ // Dispatch login action with user data
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const appleProvider = new OAuthProvider('apple.com');
      const userCredential = await signInWithPopup(auth, appleProvider);
      const user = userCredential.user;
      dispatch(login({ // Dispatch login action with user data
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="container">
        <div className="signin-form">
          <h1>Welcome Back!</h1>
          <p className="subtitle">Sign in to your account</p>

          <SigninForm />

          <div className="divider">OR</div>

          <div className="social-buttons">
            <button className='social-btn google' onClick={handleGoogleSignIn}>
              <FaGoogle size={20} color='red' />
              <span style={{ marginLeft: '.5em' }}>Sign in with Google</span>
            </button>

            <button className='social-btn apple' onClick={handleAppleSignIn}>
              <FaApple size={20} />
              <span style={{ marginLeft: '.5em' }}>Sign in with Apple</span>
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <p className="signup-link">
            Don't have an account? <a href="/signup" id="signUpLink">Sign up here</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;