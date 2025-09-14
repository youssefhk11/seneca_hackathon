import React, { useState } from 'react';
import type { User } from '../types';
import StatCard from './StatCard';
import { classifyUserLevel, getRealTimeDataProcessingOutput } from '../services/customAIService';

interface ProfilePageProps {
    user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    const { profile } = user;
    
    const [aiFitnessLevel, setAiFitnessLevel] = useState<string | null>(null);
    const [isLoadingLevel, setIsLoadingLevel] = useState(false);
    const [processedData, setProcessedData] = useState<string | null>(null);
    const [isProcessingData, setIsProcessingData] = useState(false);

    const handleClassify = async () => {
        setIsLoadingLevel(true);
        const level = await classifyUserLevel(user);
        setAiFitnessLevel(level);
        setIsLoadingLevel(false);
    };

    const handleProcessData = async () => {
        setIsProcessingData(true);
        const output = await getRealTimeDataProcessingOutput(user);
        setProcessedData(output);
        setIsProcessingData(false);
    };

    if (!profile) {
        return <div className="p-8">Please complete your profile during onboarding.</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-white/30 text-white flex items-center justify-center font-bold text-5xl border-4 border-white">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white text-shadow">{user.username} {user.surname}</h1>
                        <p className="text-indigo-200 text-lg">{profile.city}</p>
                    </div>
                </div>
            </div>
            <div className="p-8 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Fitness Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard label="Age" value={profile.age} />
                        <StatCard label="Weight (kg)" value={profile.weight} />
                        <StatCard label="Height (cm)" value={profile.height} />
                        <StatCard label="BMI" value={profile.bmi || 'N/A'} />
                    </div>
                </div>

                <div>
                     <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Progress</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                         <StatCard label="Workouts Logged" value={profile.progress.workoutsLogged} />
                         <StatCard label="Calories Burned" value={profile.progress.caloriesBurned} />
                         <StatCard label="Active Minutes" value={profile.progress.activeMinutes} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-600 mb-4">AI Fitness Classification</h3>
                        <p className="text-gray-500 text-sm mb-4">Get an AI-powered analysis of your fitness level based on your profile.</p>
                        <button onClick={handleClassify} disabled={isLoadingLevel} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 mb-4">
                            {isLoadingLevel ? 'Classifying...' : 'Classify My Level'}
                        </button>
                        {aiFitnessLevel && <p className="text-2xl font-bold text-indigo-600">{aiFitnessLevel}</p>}
                    </div>
                     <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-600 mb-4">Your Goals</h3>
                        <div className="flex flex-wrap gap-3">
                             {profile.goals.map(goal => (
                                <span key={goal} className="bg-green-100 text-green-800 text-md font-semibold px-4 py-2 rounded-full">
                                    {goal}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">AI-Powered Daily Recommendations</h2>
                     <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-500 text-sm mb-4">Simulate real-time data processing to get your personalized plan for the day.</p>
                        <button onClick={handleProcessData} disabled={isProcessingData} className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50">
                            {isProcessingData ? 'Processing...' : 'Process My Data'}
                        </button>
                        {processedData && (
                            <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg">
                                <pre className="whitespace-pre-wrap font-mono text-sm">{processedData}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
