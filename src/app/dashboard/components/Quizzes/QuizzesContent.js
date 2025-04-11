"use client";

   import React, { useState, useEffect } from 'react';
   import { db } from '@/app/Firebase/config';
   import { collection, getDocs, getDoc, doc, setDoc } from 'firebase/firestore'; //  Ensure setDoc is imported
   import Quizzes from './Quizzes';
   import styles from './QuizzesContent.module.css';
   import Loader from '../Loader';

   const QuizzesContent = ({ userId }) => {
       const [courses, setCourses] = useState([]);
       const [selectedCourseId, setSelectedCourseId] = useState(null);
       const [loadingCourses, setLoadingCourses] = useState(true);
       const [errorCourses, setErrorCourses] = useState(null);
       const [userScores, setUserScores] = useState({});
       const [loadingScores, setLoadingScores] = useState(true);
       const [errorScores, setErrorScores] = useState(null);
       const [scoreUpdated, setScoreUpdated] = useState(false);

       useEffect(() => {
           const fetchCourses = async () => {
               setLoadingCourses(true);
               setErrorCourses(null);

               try {
                   const coursesCollection = collection(db, 'courses');
                   const coursesSnapshot = await getDocs(coursesCollection);
                   const coursesData = coursesSnapshot.docs.map(doc => ({
                       id: doc.id,
                       ...doc.data()
                   }));
                   setCourses(coursesData);
                   console.log("QuizzesContent: Courses fetched successfully:", coursesData);
               } catch (err) {
                   setErrorCourses(err.message || "Failed to fetch courses.");
                   console.error("QuizzesContent: Error fetching courses:", err);
               } finally {
                   setLoadingCourses(false);
               }
           };

           fetchCourses();
       }, []);

       useEffect(() => {
           const fetchUserScores = async () => {
               if (!userId || courses.length === 0) {
                   setLoadingScores(false);
                   console.log("QuizzesContent: User ID not available or no courses loaded, skipping score fetch.");
                   return;
               }

               setLoadingScores(true);
               setErrorScores(null);
               const scores = {};

               try {
                   for (const course of courses) {
                       const userScoreDocRef = doc(db, 'users', userId, 'quizResults', course.id);
                       console.log("QuizzesContent: Fetching score for course:", course.id, "at path:", userScoreDocRef.path);
                       const docSnap = await getDoc(userScoreDocRef);
                       const scoreData = docSnap.data();
                       scores[course.id] = scoreData ? scoreData.score : 0;  //  Safely access score
                       console.log("QuizzesContent: Score for course", course.id, ":", scores[course.id]);
                   }
                   setUserScores(scores);
                   console.log("QuizzesContent: User scores fetched successfully:", scores);
               } catch (err) {
                   setErrorScores(err.message || "Failed to fetch user scores.");
                   console.error("QuizzesContent: Error fetching user scores:", err);
               } finally {
                   setLoadingScores(false);
               }
           };

           fetchUserScores();
       }, [userId, courses, scoreUpdated]);

       const handleCourseClick = (courseId) => {
           setSelectedCourseId(courseId);
           console.log("QuizzesContent: Course clicked:", courseId);
       };

       const handleContinueFromQuiz = async (updatedScore, courseId) => {
           setSelectedCourseId(null);
           console.log("QuizzesContent: Quiz completed for course:", courseId, "New score:", updatedScore);

           //  Update Firestore  (IMPORTANT:  Ensure this is also in your Quizzes component!)
           try {
               const userScoreDocRef = doc(db, 'users', userId, 'quizResults', courseId);
               await setDoc(userScoreDocRef, { score: updatedScore }, { merge: true });
               console.log("QuizzesContent: Score updated in Firestore successfully.");

               //  Optimistically update state AND trigger refetch
               setUserScores(prevScores => ({
                   ...prevScores,
                   [courseId]: updatedScore,
               }));
               setScoreUpdated(prev => !prev);
               console.log("QuizzesContent: State updated and score refetch triggered.");

           } catch (error) {
               console.error("QuizzesContent: Error updating score in Firestore:", error);
           }
       };

       if (loadingCourses || loadingScores) {
           console.log("QuizzesContent: Loading state:", { loadingCourses, loadingScores });
           return <Loader />;
       }

       if (errorCourses || errorScores) {
           console.error("QuizzesContent: Error states:", { errorCourses, errorScores });
           return <div>Error: {errorCourses || errorScores}</div>;
       }

       console.log("QuizzesContent: Rendering with userScores:", userScores);

       return (
           <div className={styles.container}>
               {selectedCourseId ? (
                   <Quizzes courseId={selectedCourseId} userId={userId} onContinue={handleContinueFromQuiz} />
               ) : (
                   <div className={styles.coursesList}>
                       <h1 className={styles.heading}>Quizzes</h1>
                       <div className={styles.header}>
                           <h2 className={styles.courseTitleHeader}>Course</h2>
                           <h2 className={styles.scoreHeader}>Score</h2>
                       </div>
                       {courses.map(course => (
                           <div
                               key={course.id}
                               className={styles.courseCard}
                               onClick={() => handleCourseClick(course.id)}
                           >
                               <div className={styles.courseInfo}>
                                   <h3>{course.title}</h3>
                                   <img src={course.image} alt={course.title} />
                               </div>
                               <div className={styles.scoreDisplay}>
                                   {userScores[course.id] !== undefined ? userScores[course.id] : 'N/A'}
                               </div>
                           </div>
                       ))}
                   </div>
               )}
           </div>
       );
   };

   export default QuizzesContent;