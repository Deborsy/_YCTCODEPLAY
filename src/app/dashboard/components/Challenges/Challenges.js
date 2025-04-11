// Challenges.js
"use client";
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import dynamic from 'next/dynamic';
import { collection, getDocs, getFirestore, doc, setDoc, updateDoc, deleteDoc, getDoc, query, where, serverTimestamp, addDoc } from 'firebase/firestore'; // Import serverTimestamp and addDoc
import { useSelector } from 'react-redux';
import styles from './Challenges.module.css';
import Loader from '../Loader';
import MonacoEditorComponent from '../MonacoEditor';
import DOMPurify from 'dompurify';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector((state) => state.user.user?.uid);
    const firestore = getFirestore();
    const iframeRef = useRef(null); // Initialize useRef
    const [userCode, setUserCode] = useState("");
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        fetchChallenges();
        if (userId) {
            fetchTotalPoints();
        }
    }, [userId]); // Fetch total points when userId changes

    const fetchTotalPoints = async () => {
        try {
            const completedChallengesRef = collection(firestore, 'users', userId, 'completedChallenges');
            const completedSnapshot = await getDocs(completedChallengesRef);
            let points = 0;
            completedSnapshot.forEach(doc => {
                const data = doc.data();
                points += data.pointsAwarded || 0;
            });
            setTotalPoints(points);
        } catch (error) {
            console.error('Error fetching total points:', error);
            toast.error('Failed to fetch total points.');
        }
    };

    const fetchChallenges = async () => {
        setLoading(true);
        setError(null);
        try {
            const challengesSnapshot = await getDocs(collection(firestore, 'challenges'));
            const fetchedChallenges = challengesSnapshot.docs.map(doc => {
                const data = doc.data();
                if (data.description) {
                    data.description = data.description.replace(/\\n/g, '\n');
                }
                if (data.initialCode) {
                    data.initialCode = data.initialCode.replace(/\\n/g, '\n');
                }
                if (data.solutionCode) {
                    data.solutionCode = data.solutionCode.replace(/\\n/g, '\n');
                }
                return { id: doc.id, ...data };
            });

            if (userId) {
                const userChallengesSnapshot = await getDocs(collection(firestore, 'users', userId, 'userChallenges'));
                const userChallengeData = {};
                userChallengesSnapshot.docs.forEach(doc => {
                    userChallengeData[doc.id] = doc.data();
                });

                const challengesWithUserStatus = fetchedChallenges.map(challenge => ({
                    ...challenge,
                    userStatus: userChallengeData[challenge.id]?.status || 'not_started',
                }));
                setChallenges(challengesWithUserStatus);
            } else {
                setChallenges(fetchedChallenges.map(challenge => ({ ...challenge, userStatus: 'not_started' })));
            }

        } catch (err) {
            setError('Failed to fetch challenges.');
            console.error('Fetch Challenges Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChallengeClick = async (challenge) => {
        if (challenge.userStatus === 'completed') {
            if (window.confirm(`This challenge is completed. Do you want to completely reset your progress for "${challenge.title}"? This will remove all your saved data for this challenge.`)) {
                await handleResetProgress(challenge);
                return;
            } else {
                return;
            }
        }

        setSelectedChallenge(challenge);
        setUserCode(challenge.initialCode);
        if (iframeRef.current) {
            iframeRef.current.srcdoc = "";
        }

        if (userId && challenge.id) {
            const userChallengeRef = doc(firestore, 'users', userId, 'userChallenges', challenge.id);
            const userChallengeSnap = await getDoc(userChallengeRef);

            if (!userChallengeSnap.exists()) {
                await setDoc(userChallengeRef, {
                    status: 'pending',
                    code: challenge.initialCode,
                });
                console.log(`userChallenges document created for challenge ${challenge.id}`);
            }
        }
    };

    const handleResetProgress = async (challenge) => {
        if (userId && challenge.id) {
            try {
                const challengeId = challenge.id;

                const completedChallengesRef = collection(firestore, 'users', userId, 'completedChallenges');
                const completedQuery = query(completedChallengesRef, where('challengeId', '==', challengeId));
                const completedSnapshot = await getDocs(completedQuery);
                completedSnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                    console.log(`Removed from completedChallenges: ${doc.id}`);
                });

                const userChallengeRef = doc(firestore, 'users', userId, 'userChallenges', challengeId);
                await deleteDoc(userChallengeRef);
                console.log(`Removed from userChallenges: ${challengeId}`);

                setChallenges(prevChallenges =>
                    prevChallenges.map(c =>
                        c.id === challengeId ? { ...c, userStatus: 'not_started' } : c
                    )
                );
                setTotalPoints(prevPoints => prevPoints - (challenge.points || 0)); // Update total points on reset

                toast.info(`Progress for "${challenge.title}" has been completely reset.`);
                setSelectedChallenge(null);
            } catch (error) {
                console.error('Error resetting progress:', error);
                toast.error('Failed to reset progress. Please try again.');
            }
        }
    };

    const handleRunCode = async () => {
        if (selectedChallenge?.language === 'javascript') {
            try {
                if (iframeRef.current) {
                    const html = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>JavaScript Output</title>
                        </head>
                        <body>
                            <div id="output"></div>
                            <script>
                                function logToOutput(message) {
                                    document.getElementById('output').textContent += message + '\\n';
                                }
                                const originalConsoleLog = console.log;
                                console.log = logToOutput;
    
                                try {
                                    ${userCode}
                                } catch (error) {
                                    logToOutput('Error: ' + error);
                                } finally {
                                    console.log = originalConsoleLog;
                                }
                            </script>
                        </body>
                        </html>
                    `;
                    iframeRef.current.srcdoc = DOMPurify.sanitize(html);
                }
            } catch (error) {
                console.error('Error running JavaScript:', error);
                if (iframeRef.current) {
                    iframeRef.current.srcdoc = `<div style="color: red;">Error running JavaScript.</div>`;
                }
            }
        } else if (selectedChallenge?.language === 'html') { // Or any other language you want to handle as HTML/CSS
            try {
                let htmlContent = userCode;
                let cssContent = '';
    
                // Simple separation logic (can be improved with more robust parsing if needed)
                if (userCode.includes('<style>')) {
                    const styleStart = userCode.indexOf('<style>');
                    const styleEnd = userCode.indexOf('</style>') + 8; // Include </style>
                    cssContent = userCode.substring(styleStart, styleEnd);
                    htmlContent = userCode.substring(0, styleStart) + userCode.substring(styleEnd);
                }
    
                const completeHTML = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>HTML/CSS Output</title>
                        ${cssContent}
                    </head>
                    <body>
                        ${htmlContent}
                    </body>
                    </html>
                `;
    
                const sanitizedHTML = DOMPurify.sanitize(completeHTML);
                if (iframeRef.current) {
                    iframeRef.current.srcdoc = sanitizedHTML;
                }
            } catch (error) {
                console.error('Error rendering HTML/CSS:', error);
                if (iframeRef.current) {
                    iframeRef.current.srcdoc = `<div style="color: red;">Error rendering HTML/CSS.</div>`;
                }
            }
        } else {
            //  Handling other cases (e.g., displaying an error message)
            console.warn(`Unsupported language: ${selectedChallenge?.language}`);
            if (iframeRef.current) {
                iframeRef.current.srcdoc = `<div style="color: orange;">Unsupported language.</div>`;
            }
        }
    };

    const handleSubmitCode = async () => {
        try {
            const solutionDoc = await getDoc(doc(firestore, 'challenges', selectedChallenge.id));

            if (solutionDoc.exists()) {
                const solutionData = solutionDoc.data();
                const solutionCode = solutionData.solutionCode;

                const normalizedUserCode = userCode.trim().replace(/\s/g, '').replace(/(\r\n|\r|\n)/g, '').toLowerCase();
                const normalizedSolutionCode = solutionCode.trim().replace(/\s/g, '').replace(/(\r\n|\r|\n)/g, '').toLowerCase();

                if (normalizedUserCode === normalizedSolutionCode) {
                    toast.success('Congratulations! Challenge completed.');
                    const pointsAwarded = selectedChallenge.points || 0;
                    setTotalPoints(prevPoints => prevPoints + pointsAwarded); // Update total points on completion

                    await addDoc(collection(firestore, 'users', userId, 'completedChallenges'), {
                        challengeId: selectedChallenge.id,
                        status: 'completed',
                        pointsAwarded: pointsAwarded,
                        completedAt: serverTimestamp(),
                        userCode: userCode,
                    });

                    await updateDoc(doc(firestore, 'users', userId, 'userChallenges', selectedChallenge.id), {
                        status: 'completed',
                    });

                    setChallenges(prevChallenges =>
                        prevChallenges.map(c =>
                            c.id === selectedChallenge.id ? { ...c, userStatus: 'completed' } : c
                        )
                    );
                    setSelectedChallenge(null);

                } else {
                    toast.error('Incorrect code. Try again.');
                    await updateDoc(doc(firestore, 'users', userId, 'userChallenges', selectedChallenge.id), {
                        status: 'incorrect',
                    });
                    setChallenges(prevChallenges =>
                        prevChallenges.map(c =>
                            c.id === selectedChallenge.id ? { ...c, userStatus: 'incorrect' } : c
                        )
                    );
                }
            } else {
                console.error("Solution document not found!");
                toast.error("Error fetching solution.");
            }
        } catch (error) {
            console.error('Error submitting code:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const renderChallenges = () => {
        if (loading) {
            return <Loader />;
        }
        if (error) {
            return <div className={styles.error}>{error}</div>;
        }

        return challenges.map((challenge) => (
            <div key={challenge.id} className={styles.challengeTile} onClick={() => handleChallengeClick(challenge)}>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
                <div className={styles.challengeInfo}>
                    <span className={styles.difficulty}>difficulty : {challenge.difficulty}</span> <br />
                    <span className={styles.points}>points : {challenge.points}</span> <br />
                    <span className={styles.status}>status : {challenge.userStatus}</span>
                </div>
            </div>
        ));
    };

    return (
        <div className={styles.challengesContainer}>
            <div className={styles.challengesHeader}> {/* Container for title and points */}
                <h1 className={styles.challengesTitle}>Challenges</h1>
                {userId && <div className={styles.totalPoints}>Total Points: {totalPoints}</div>}
            </div>
            {!selectedChallenge ? (
                <div className={styles.challengesList}>{renderChallenges()}</div>
            ) : (
                <div className={styles.challengeDetail}>
                    <h2>{selectedChallenge.title}</h2>
                    <p>{selectedChallenge.description}</p>
                    <br />
                    <div className={styles.editorOutputContainer}>
                        <div className={styles.editorContainer}>
                            <MonacoEditorComponent
                                code={selectedChallenge.initialCode}
                                codeType="initial"
                                onCodeChange={(newCode) => setUserCode(newCode)}
                                language={selectedChallenge.language}
                            />
                            <br />
                            <div className={styles.btns}>
                                <button onClick={handleRunCode}>Run Code</button>
                                <button onClick={handleSubmitCode}>Submit Code</button>
                            </div>
                        </div>
                        <div className={styles.outputBox}>
                            <h3>Output</h3>
                            <iframe ref={iframeRef} className={styles.renderedOutput} title="HTML Output" />
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            )}
        </div>
    );
};

export default Challenges;