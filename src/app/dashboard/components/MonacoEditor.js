"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
    async () => (await import('@monaco-editor/react')).default,
    { ssr: false }
);

const MonacoEditorComponent = ({ code: propCode, codeType, onCodeChange, language }) => {
    const [code, setCode] = useState(propCode);

    useEffect(() => {
        if (propCode !== undefined && propCode !== null) {
            setCode(propCode);
        }
    }, [propCode]);

    const handleEditorChange = (newCode, e) => {
        setCode(newCode);
        if (onCodeChange) {
            onCodeChange(newCode);
        }
    };

    return (
        <MonacoEditor
            width="100%"
            height="400px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{ readOnly: codeType === 'example' }} //Read only for example code.
        />
    );
};

export default MonacoEditorComponent;