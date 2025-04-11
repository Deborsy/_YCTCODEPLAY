"use client";
import React, { useState } from 'react';
import styles from './CourseLessons.module.css';

const CourseLessons = ({ course }) => {
    const [output, setOutput] = useState('');
    const [currentCode, setCurrentCode] = useState('');

    if (!course || !course.topics || course.topics.length === 0) {
        return <div className={styles.noLessons}>No lessons available.</div>;
    }

    const handleTopicClick = (exampleCode) => {
        setCurrentCode(exampleCode);
    };

    const formatContent = (content) => {
        if (!content) return '';
        let cleanedContent = content.replace(/[\u200B-\u200D\uFEFF]/g, '');
        let formatted = cleanedContent.replace(/\\n/g, '\n');
        return formatted;
    };

    const formatCode = (code) => {
        if (!code) return '';
        let cleanedCode = code.replace(/[\u200B-\u200D\uFEFF]/g, '');
        let formatted = cleanedCode.replace(/\\n/g, '\n');
        return formatted;
    };

    return (
        <div className={styles.lessonsContainer}>
            <h2>{course.title} Lessons</h2>
            {course.topics.map((topic, index) => (
                <div
                    key={index}
                    className={styles.topicContainer}
                    onClick={() => handleTopicClick(topic.exampleCode)}
                    style={{ cursor: 'pointer' }}
                >
                    <h3>{topic.topicTitle}</h3>
                    <div className={styles.lessonContent}>
                        {topic.content && (
                            <>
                                <p dangerouslySetInnerHTML={{ __html: formatContent(topic.content) }} />
                            </>
                        )}
                        {topic.exampleCode && (
                            <div>
                                <pre className={styles.codeSnippet}>
                                    {formatCode(topic.exampleCode)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseLessons;