import React from 'react';
import styles from './Challenges.module.css';

const OutputBox = ({ output }) => {
    return (
        <div className={styles.outputBox}>
            <h3>Output</h3>
            <pre>{output}</pre>
        </div>
    );
};

export default OutputBox;