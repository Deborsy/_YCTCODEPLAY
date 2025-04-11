"use client";
 import React, { useState, useEffect } from 'react';
 import { db } from '@/app/Firebase/config';
 import { collection, getDocs, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
 import Loader from '../Loader';
 import styles from './Quizzes.module.css';
 

 const Quizzes = ({ courseId, userId, onContinue }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

    const handleRetakeQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
    };
 

    const handleContinue = () => {
        if (onContinue) {
            onContinue(score, courseId);
        }
    };
 

    useEffect(() => {
    const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    

    const quizzesCollection = collection(db, 'courses', courseId, 'quizzes');
    try {
        const quizzesSnapshot = await getDocs(quizzesCollection);
        const quizzesData = quizzesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setQuizzes(quizzesData);
    } catch (err) {
        setError(err.message || 'Failed to fetch quizzes.');
    } finally {
        setLoading(false);
    }
    };
    

        fetchQuizzes();
    }, [courseId]);
 

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
    };
 

    const handleNextQuestion = async () => {
    if (selectedAnswer === quizzes[currentQuestionIndex].correctAnswer) {
        setScore((prevScore) => prevScore + 1);
    }
 

    setSelectedAnswer(null);
 

    if (currentQuestionIndex + 1 < quizzes.length) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
        setShowResult(true);
    }
 };
 

  const recordQuizResult = async () => {
    try {
        const resultRef = doc(db, 'users', userId, 'quizResults', courseId);

        const docSnap = await getDoc(resultRef);
        let existingScore = 0;
    

        if (docSnap.exists()) {
            existingScore = docSnap.data().score;
        } else {
            console.log('>>> No existing score found.');
        }
    

    if (score > existingScore) {
        const dataToSave = {
            score: score,
            totalQuestions: quizzes.length,
            completedAt: serverTimestamp(),
        };
    

    await setDoc(resultRef, dataToSave);
        console.log('>>> setDoc completed successfully <<<');
        console.log('Quiz result recorded successfully!');
    } else {
        console.log('>>> New score is not higher, not saving.');
    }
    } catch (err) {
        setError(err.message || 'Failed to record quiz result.');
    }
  };
 

  useEffect(() => {
    if (showResult && userId) {
        recordQuizResult();
    }
  }, [showResult, userId]);
 

  if (loading) {
    return <Loader />;
  }
 

  if (error) {
    return <div>Error: {error}</div>;
  }
 

  if (quizzes.length === 0) {
    return <div>No quizzes available.</div>;
  }
 

  if (showResult) {
  return (
    <div className={styles.resultContainer}>
        <h2 className={styles.resultTitle}>Quiz Result</h2>
        <div className={styles.scoreDisplay}>
            <p className={styles.scoreText}>Your score:</p>
            <span className={styles.scoreValue}>{score}</span>
            <p className={styles.scoreText}>out of</p>
            <span className={styles.totalScore}>{quizzes.length}</span>
        </div>
        {score >= quizzes.length * 0.8 && <p className={styles.resultMessage}>Excellent job!</p>}
        {score < quizzes.length * 0.8 && score >= quizzes.length * 0.5 && <p className={styles.resultMessage}>Good effort.</p>}
        {score < quizzes.length * 0.5 && <p className={styles.resultMessage}>Keep practicing!</p>}
        <button
        className={styles.resultButton}
        onClick={score === quizzes.length ? handleContinue : handleRetakeQuiz}
        >
            {score === quizzes.length ? 'Continue' : 'Retake Quiz'}
        </button>
    </div>
  );
  }
 

  const currentQuestion = quizzes[currentQuestionIndex];
 

  return (
    <div className={styles.quizContainer}>
        <h2 className={styles.quizQuestion}>{currentQuestion.question}</h2>
        <div className={styles.answerOptions}>
            {currentQuestion.options.map((option, index) => (
                <button
                key={index}
                className={`${styles.answerOption} ${selectedAnswer === option ? styles.selected : ''}`}
                onClick={() => handleAnswer(option)}
                >
                    {option}
                </button>
            ))}
        </div>
        <button
        className={styles.nextButton}
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        >
            Next
        </button>
    </div>
  );
 };
 

 export default Quizzes;