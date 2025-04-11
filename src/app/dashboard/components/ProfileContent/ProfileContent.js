"use client";

import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc, collection, query, where, getDocs, Firestore } from 'firebase/firestore';
import styles from './Profile.module.css';
import { auth, db } from '@/app/Firebase/config';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fullname, setFullname] = useState('');
    const [completedChallenges, setCompletedChallenges] = useState([]);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser(currentUser);
            setDisplayName(currentUser.displayName || '');
            setEmail(currentUser.email || '');
            fetchFirestoreData(currentUser.uid);
            fetchCompletedChallenges(currentUser.uid);
        }
        setLoading(false);
    }, [auth.currentUser]);

    const fetchFirestoreData = async (uid) => {
        try {
            const userDoc = doc(db, 'users', uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setFullname(userData.fullname || '');
                setPhoneNumber(userData.phoneNumber || '');
            }
        } catch (err) {
            setError('Error fetching profile data.');
        }
    };

    const fetchCompletedChallenges = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const completedChallengesRef = collection(userDocRef, 'completedChallenges');
            const querySnapshot = await getDocs(completedChallengesRef);
            const completed = [];

            for (const docSnap of querySnapshot.docs) { 
                // Changed 'doc' to 'docSnap'
                const data = docSnap.data();
                try {
                    const challengeDocRef = doc(db, 'challenges', data.challengeId);
                    const challengeDocSnap = await getDoc(challengeDocRef);
                    const challengeData = challengeDocSnap.data() || {};

                    completed.push({
                        // Access ID from docSnap
                        id: docSnap.id,
                        ...data,
                        challengeTitle: challengeData.title || 'Unknown Title',
                    });
                } catch (challengeErr) {
                    completed.push({ 
                        // Push basic data even if challenge fetch fails
                        id: docSnap.id,
                        ...data,
                        challengeTitle: 'Error Loading Title',
                    });
                }
            }

            setCompletedChallenges(completed);

        } catch (err) {
            setError('Error fetching completed challenges.');
        }
    };

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
        setIsChanged(true);
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            if (user) {
                await updateProfile(user, {
                    displayName: displayName,
                });
                if (user.email !== email) {
                    await user.updateEmail(email);
                }

                await updateDoc(doc(db, 'users', user.uid), {
                    fullname: fullname,
                    phoneNumber: phoneNumber,
                });
                setTimeout(() => {
                    toast.success('Profile updated successfully!');
                }, 200);
            }
        } catch (err) {
            setError('Failed to update profile: ' + err.message);
            toast.error('Failed to update profile: ' + err.message);
        } finally {
            setLoading(false);
            setIsChanged(false);
        }
    };

    const isSaveDisabled = () => {
        if (loading) return true;
        return !isChanged;
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <ToastContainer />
            <div className={styles.profileHeader}>
                <div>
                    <h2>Welcome, {fullname || displayName || email}</h2>
                </div>
            </div>

            <div className={styles.infoSection}>
                {/* Add info section content if needed */}
            </div>

            <div className={styles.formSection}>
                <div className={styles.inputGroup}>
                    <label htmlFor="fullname">Full Name</label>
                    <input
                        type="text"
                        id="fullname"
                        value={fullname}
                        onChange={(e) => handleInputChange(e, setFullname)}
                        placeholder="Full Name"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => handleInputChange(e, setEmail)}
                        placeholder="Email"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => handleInputChange(e, setPhoneNumber)}
                        placeholder="Phone Number"
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button className={styles.cancelButton}>Cancel</button>
                    <button
                        className={styles.saveButton}
                        onClick={handleUpdateProfile}
                        disabled={isSaveDisabled()}
                    >
                        {loading ? 'Updating...' : 'Save changes'}
                    </button>
                </div>
            </div>

            <div className={styles.completedChallengesSection}>
                <h3>Completed Challenges</h3>
                {completedChallenges.length > 0 ? (
                    <ul className={styles.completedChallengesList}>
                        {completedChallenges.map((challenge) => (
                            <li key={challenge.id} className={styles.completedChallengeItem}>
                                {challenge.challengeTitle} ({challenge.pointsAwarded} points)
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No completed challenges yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;