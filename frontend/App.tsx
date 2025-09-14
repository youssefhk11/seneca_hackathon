import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import OnboardingPage from './components/OnboardingPage';
import CommunityPage from './components/CommunityPage';
import ProfilePage from './components/ProfilePage';
import LeaderboardPage from './components/LeaderboardPage';
import NutritionPage from './components/NutritionPage';
import ReportPage from './components/ReportPage';
import ExplorePage from './components/ExplorePage';
import EventsListPage from './components/EventsListPage';
import WorkoutLibraryPage from './components/WorkoutLibraryPage';
import Navbar from './components/common/Navbar';
import type { User, RegistrationData, Profile } from './types';
import * as db from './services/database';

type AppState = 'login' | 'register' | 'onboarding' | 'dashboard';
type NavView = 'community' | 'profile' | 'leaderboard' | 'nutrition' | 'reports' | 'explore' | 'events' | 'workout-library';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('login');
    const [navView, setNavView] = useState<NavView>('community');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const user = db.db_getCurrentUser();
        if (user) {
            if (user.profile) {
                setCurrentUser(user);
                setAppState('dashboard');
            } else {
                 setCurrentUser(user);
                setAppState('onboarding');
            }
        }
    }, []);

    const handleLogin = (phone: string, pass: string) => {
        setAuthError('');
        const user = db.db_login(phone, pass);
        if (user) {
            setCurrentUser(user);
            if (user.profile) {
                setAppState('dashboard');
                setNavView('community');
            } else {
                setAppState('onboarding');
            }
        } else {
            setAuthError('Invalid phone number or password.');
        }
    };
    
    const handleRegister = (data: RegistrationData) => {
        setAuthError('');
        const user = db.db_register(data);
        if (user) {
            setCurrentUser(user);
            setAppState('onboarding');
        } else {
            setAuthError('An account with this phone number already exists.');
        }
    };

    const handleOnboardingComplete = (profileData: Omit<Profile, 'bmi' | 'progress'>) => {
        if (currentUser) {
            const updatedUser = db.db_updateUserProfile(currentUser.id, profileData);
            if (updatedUser) {
                setCurrentUser(updatedUser);
                setAppState('dashboard');
                setNavView('community');
            }
        }
    };

    const handleLogout = () => {
        db.db_logout();
        setCurrentUser(null);
        setAppState('login');
    };
    
    const renderDashboardContent = () => {
        if (!currentUser) return null;
        switch (navView) {
            case 'community':
                return <CommunityPage user={currentUser} onNavigate={setNavView} />;
            case 'profile':
                return <ProfilePage user={currentUser} />;
            case 'leaderboard':
                return <LeaderboardPage currentUser={currentUser} />;
            case 'nutrition':
                return <NutritionPage />;
            case 'reports':
                return <ReportPage />;
            case 'explore':
                return <ExplorePage onNavigate={setNavView} />;
            case 'events':
                return <EventsListPage />;
            case 'workout-library':
                return <WorkoutLibraryPage user={currentUser} />;
            default:
                return <CommunityPage user={currentUser} onNavigate={setNavView} />;
        }
    };
    
    if (appState === 'login') {
        return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => setAppState('register')} error={authError} />;
    }
    
    if (appState === 'register') {
        return <RegistrationPage onRegister={handleRegister} onSwitchToLogin={() => setAppState('login')} error={authError} />;
    }
    
    if (appState === 'onboarding' && currentUser) {
        return <OnboardingPage onComplete={handleOnboardingComplete} username={currentUser.username} />;
    }

    if (appState === 'dashboard' && currentUser) {
        return (
            <div className="flex bg-gray-100 min-h-screen">
                <Navbar currentView={navView} onNavigate={setNavView} onLogout={handleLogout} username={currentUser.username} />
                <main className="flex-1 overflow-y-auto p-8">
                    {renderDashboardContent()}
                </main>
            </div>
        );
    }
    
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
};

export default App;
