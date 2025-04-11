"use client";
 import React from 'react';
 import Sidebar from './components/Sidebar';
 import { useSelector } from 'react-redux';
 import ProfileContent from './components/ProfileContent/ProfileContent';
 import ProtectedRoute from './components/ProtectedRoute';
 import CoursesContent from './components/Courses/CoursesContent';
 import Challenges from './components/Challenges/Challenges';
 import QuizzesContent from './components/Quizzes/QuizzesContent';
import ProgressTracking from './components/ProgressTracking/ProgressTracking';
import Loader from './components/Loader';
import Community from './components/Community/Community'
 

 const DashBoard = () => {
  const activeNavItem = useSelector((state) => state.ui.activeNavItem);
  const isSidebarCollapsed = useSelector((state) => state.ui.isSidebarCollapsed);
  const userId = useSelector((state) => state.user.user?.uid);
 

  const renderContent = () => {
    switch (activeNavItem) {
        case 'Profile':
            return <ProfileContent />;
        case 'Courses':
            return (
                <div style={{ marginLeft: '3rem', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                    <CoursesContent isSidebarCollapsed={isSidebarCollapsed} />
                </div>
            );
        case 'Quizzes':
            return userId ? <QuizzesContent userId={userId} /> : <Loader />;
        case 'Challenges':
            return <Challenges />;
        case 'Progress Tracking':
            return <ProgressTracking />;
        case 'Community':
            return <Community />
        default:
        return null;
    }
  };
 

  return (
    <div className='dashboard '>
        <Sidebar />
        <main className='dashboard-content' style={{ position: "relative", zIndex: 1 }}>
            {renderContent()}
        </main>
    </div>
    );
 };
 

 const ProtectedDashboard = () => (
  <ProtectedRoute>
    <DashBoard />
  </ProtectedRoute>
 );
 

 export default ProtectedDashboard;