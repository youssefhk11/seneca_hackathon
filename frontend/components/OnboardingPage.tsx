import React, { useState } from 'react';
import type { Profile } from '../types';

interface OnboardingPageProps {
    onComplete: (profile: Omit<Profile, 'bmi' | 'progress'>) => void;
    username: string;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, username }) => {
    const [profileData, setProfileData] = useState<Omit<Profile, 'bmi' | 'progress'>>({
        age: 0,
        weight: 0,
        height: 0,
        fitnessLevel: 'Not Set',
        goals: [],
        city: '',
        avgWorkoutDuration: 45,
        preferredWorkoutTime: 'Morning',
    });
    const [step, setStep] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numValue = ['age', 'weight', 'height', 'avgWorkoutDuration'].includes(name) ? Number(value) : value;
        setProfileData(prev => ({ ...prev, [name]: numValue }));
    };
    
    const handleGoalChange = (goal: string) => {
        setProfileData(prev => {
            const newGoals = prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal];
            return { ...prev, goals: newGoals };
        });
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(profileData);
    };

    const goalsOptions = ['Lose Weight', 'Build Muscle', 'Improve Endurance', 'Stay Active', 'Learn New Exercises'];
    const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-xl animate-fadeIn">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome, {username}!</h1>
                    <p className="mt-2 text-gray-500">Let's set up your profile to personalize your experience.</p>
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                        <h2 className="text-2xl font-semibold text-center text-indigo-600">Step 1: The Basics</h2>
                        <div>
                            <label className="font-semibold text-gray-600">Age</label>
                            <input type="number" name="age" value={profileData.age || ''} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        <div>
                            <label className="font-semibold text-gray-600">Weight (kg)</label>
                            <input type="number" name="weight" value={profileData.weight || ''} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        <div>
                            <label className="font-semibold text-gray-600">Height (cm)</label>
                            <input type="number" name="height" value={profileData.height || ''} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                         <div>
                            <label className="font-semibold text-gray-600">City</label>
                            <input type="text" name="city" value={profileData.city} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Tunis, Tunisia" required />
                        </div>
                        <button onClick={nextStep} className="w-full py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">Next</button>
                    </div>
                )}
                
                {step === 2 && (
                     <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-semibold text-center text-indigo-600">Step 2: Your Fitness Habits & Goals</h2>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-gray-600">Avg. Workout (min)</label>
                                <input type="number" name="avgWorkoutDuration" value={profileData.avgWorkoutDuration} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg" />
                            </div>
                             <div>
                                <label className="font-semibold text-gray-600">Preferred Time</label>
                                 <select name="preferredWorkoutTime" value={profileData.preferredWorkoutTime} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-white">
                                    {timeOptions.map(time => <option key={time} value={time}>{time}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {goalsOptions.map(goal => (
                                <button
                                    key={goal}
                                    onClick={() => handleGoalChange(goal)}
                                    className={`p-4 rounded-lg text-center font-semibold transition-all ${profileData.goals.includes(goal) ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                        <div>
                            <label className="font-semibold text-gray-600">Self-Assessed Fitness Level</label>
                            <select name="fitnessLevel" value={profileData.fitnessLevel} onChange={handleChange} className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                <option value="Not Set" disabled>Select your level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={prevStep} className="w-full py-3 font-bold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Back</button>
                            <button onClick={handleSubmit} className="w-full py-3 font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">Complete Profile</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingPage;
