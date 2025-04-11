"use client"
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import MonacoEditorComponent from '../MonacoEditor';
import OutputBox from './OutputBox';
import styles from './Challenges.module.css';
import { db } from '@/app/Firebase/config';

const ChallengeDetails = ({ challenge, onChallengeUpdated }) => {
    const [userCode, setUserCode] = useState(challenge.initialCode);
    const [output, setOutput] = useState('');
    const userId = useSelector((state) => state.user.user?.uid);
    const firestore = getFirestore(db);

    useEffect(() => {
        setOutput(challenge.initialCode);
    }, [challenge.initialCode]);

    const handleCodeChange = (code) => {
        setUserCode(code);
    };

    const handleRunCode = () => {
        // Replace this with actual code execution logic
        setOutput(userCode);
    };

    const handleSubmitCode = async () => {
        // Replace this with actual code comparison logic
        const isCorrect = userCode === challenge.solutionCode;

        let status = isCorrect ? 'completed' : 'incorrect';

        try {
            const userChallengeDocRef = doc(firestore, 'users', userId, 'userChallenges', challenge.id);
            await updateDoc(userChallengeDocRef, { status: status, code: userCode });
            onChallengeUpdated();
        } catch (error) {
            console.error('Error updating challenge status:', error);
        }
    };

    return (
        <div className={styles.challengeDetail}>
            <h2>{challenge.title}</h2>
            <p>{challenge.description}</p>
            <MonacoEditorComponent code={userCode} onChange={handleCodeChange} codeType="initial" />
            <OutputBox output={output} />
            <div className={styles.buttonGroup}>
                <button onClick={handleRunCode}>Run Code</button>
                <button onClick={handleSubmitCode}>Submit Code</button>
            </div>
        </div>
    );
};

export default ChallengeDetails;