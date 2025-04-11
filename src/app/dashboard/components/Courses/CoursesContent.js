"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import styles from './CoursesContent.module.css';
import Loader from '../Loader';
import CourseLessons from './CourseLesson/CourseLesson';

const CoursesContent = ({ isSidebarCollapsed }) => {
    const [availableCourses, setAvailableCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourseContent, setSelectedCourseContent] = useState(null);

    const handleCourseClick = (course) => {
        setSelectedCourseContent(course);
    };

    const firestore = getFirestore();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const coursesSnapshot = await getDocs(collection(firestore, 'courses'));
            setAvailableCourses(coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            setError('Failed to fetch data.');
            console.error('Data Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const totalCourses = [
        { title: 'HTML', image: '/html5.png', available: true },
        { title: 'CSS', image: '/css3.png', available: true },
        { title: 'JavaScript', image: '/javascript.png', available: true },
        { title: 'Python', image: '/python.png', available: false },
        { title: 'Java', image: '/java.png', available: false },
        { title: 'C++', image: '/c++.png', available: false },
        { title: 'C#', image: '/csharp.png', available: false },
        { title: 'Ruby', image: '/ruby.png', available: false },
        { title: 'Swift', image: '/swift.png', available: false },
        { title: 'Go', image: '/go.png', available: false },
        { title: 'Kotlin', image: '/kotlin.png', available: false },
        { title: 'PHP', image: '/php.png', available: false },
    ];

    const renderCourses = (courses, isAvailable = false) => {
        if (loading) {
            return <Loader />;
        }
        if (error) {
            return <div className={styles.error}>{error}</div>;
        }

        return courses.map((course) => (
            <div
                key={isAvailable ? course.id : course.title}
                className={styles.card}
                onClick={() => handleCourseClick(isAvailable ? course : course)}
            >
                <div className={styles.progress}>
                    <div className={styles.progressCircle}>
                        {course.image && <img src={course.image} alt={course.title} className={styles.courseImage} />}
                        {!course.image && <div>{Math.floor(Math.random() * 100)}%</div>}
                    </div>
                </div>
                <h3>{course.title}</h3>
                {isAvailable && <div className={styles.availableTag}>Available</div>}
                {!isAvailable && !course.available && <div className={styles.unavailableTag}>Unavailable</div>}
            </div>
        ));
    };

    return (
        <div className={styles.coursesContentContainer} style={{ marginLeft: isSidebarCollapsed ? '0px' : '0px' }}>
            <div className={styles.coursesSection}>
                <h2>Available Courses</h2>
                <div className={styles.coursesGrid}>
                    {renderCourses(availableCourses, true)}
                </div>
            </div>
            {selectedCourseContent ? (
                <CourseLessons course={selectedCourseContent} />
            ) : (
                <div className={styles.coursesSection}>
                    <h2>Total Courses</h2>
                    <div className={styles.coursesGrid}>
                        {renderCourses(totalCourses)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesContent;