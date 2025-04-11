"use client";

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { collection, getDocs, getCountFromServer } from 'firebase/firestore';
import { db, auth } from '@/app/Firebase/config';
import styles from './ProgressTracking.module.css';
import Loader from '../Loader';

   ChartJS.register(
       CategoryScale,
       LinearScale,
       BarElement,
       Title,
       Tooltip,
       Legend
   );

   const ProgressTracking = () => {
       const [challengesData, setChallengesData] = useState(null);
       const [quizData, setQuizData] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
           const fetchProgressData = async () => {
               setLoading(true);
               setError(null);

               try {
                   const userId = auth.currentUser.uid;

                   // Fetch Challenges Progress
                   const userChallengesRef = collection(db, 'users', userId, 'completedChallenges');
                   const challengesSnapshot = await getDocs(userChallengesRef);
                   const totalChallengesRef = collection(db, 'challenges');
                   const totalChallengesSnapshot = await getCountFromServer(totalChallengesRef);
                   const totalChallenges = totalChallengesSnapshot.data().count;
                   const challengesSolved = challengesSnapshot.size;

                   setChallengesData({ total: totalChallenges, solved: challengesSolved });

                   // Fetch Quiz Progress
                   let totalQuizzes = 0;
                   let quizzesSolved = 0;

                   const coursesRef = collection(db, 'courses');
                   const coursesSnapshot = await getDocs(coursesRef);

                   for (const courseDoc of coursesSnapshot.docs) {
                       const quizzesRef = collection(db, 'courses', courseDoc.id, 'quizzes');
                       const quizzesSnapshot = await getCountFromServer(quizzesRef);
                       totalQuizzes += quizzesSnapshot.data().count;
                   }

                   const userQuizResultsRef = collection(db, 'users', userId, 'quizResults');
                   const userQuizResultsSnapshot = await getDocs(userQuizResultsRef);
                   quizzesSolved = userQuizResultsSnapshot.size;

                   setQuizData({
                       totalQuizzes: totalQuizzes,
                       quizzesSolved: quizzesSolved,
                   });

               } catch (err) {
                   console.error("Error fetching progress data:", err);
                   setError("Failed to fetch progress data.");
               } finally {
                   setLoading(false);
               }
           };

           fetchProgressData();
       }, []);

       const challengesChartData = {
           labels: [''],
           datasets: [
               {
                   label: 'Total Challenges',
                   data: [challengesData?.total || 0],
                   backgroundColor: 'rgba(63, 81, 181, 0.7)',
               },
               {
                   label: 'Challenges Solved',
                   data: [challengesData?.solved || 0],
                   backgroundColor: 'rgba(0, 200, 83, 0.7)',
               },
           ],
       };

       const quizChartData = {
           labels: [''],
           datasets: [
               {
                   label: 'Total Quizzes',
                   data: [quizData?.totalQuizzes || 0],
                   backgroundColor: 'rgba(255, 99, 132, 0.7)',
               },
               {
                   label: 'Quizzes Solved',
                   data: [quizData?.quizzesSolved || 0],
                   backgroundColor: 'rgba(54, 162, 235, 0.7)',
               },
           ],
       };

       const chartOptions = {
           responsive: true,
           scales: {
               x: {
                   title: {
                       display: true,
                       text: '',
                       font: {
                           size: 16,
                           weight: 'bold' 
                       }
                   },
                   display: false,
               },
               y: {
                   title: {
                       display: true,
                       text: 'Number',
                       font: {
                           size: 16,
                           weight: 'bold' 
                       }
                   },
                   beginAtZero: true,
                   ticks: {
                       stepSize: 1
                   }
               }
           },
           plugins: {
               title: {
                   display: true,
                   text: '',
                   font: {
                       size: 20,
                       weight: 'bold' 
                   },
                   align: 'start'
               },
               legend: {
                   position: 'bottom',
                   labels: {
                       font: {
                           size: 14
                       }
                   }
               },
           },
       };

       if (loading) {
           return <Loader/>;
       }

       if (error) {
           return <div className={styles.error}>{error}</div>;
       }

       return (
           <div className={styles.container}>
                <div className={styles.ProgressHeader}>
                    <h1 className={styles.title}>Progress Tracker</h1>
                </div>
               <div className={styles.chartContainer} style={{ width: '48%', maxWidth: '500px' }}>
                   <Bar
                       data={challengesChartData}
                       options={{
                           ...chartOptions,
                           plugins: { title: { display: true, text: 'Challenges' } },
                           scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, title: { display: true, text: 'Challenges' } } }
                       }}
                   />
               </div>

               <div className={styles.chartContainer} style={{ width: '48%', maxWidth: '500px' }}>
                   <Bar
                       data={quizChartData}
                       options={{
                           ...chartOptions,
                           plugins: { title: { display: true, text: 'Quizzes' } },
                           scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, title: { display: true, text: 'Quizzes' } } }
                       }}
                   />
               </div>
           </div>
       );
   };

   export default ProgressTracking;