import React, { useState, useEffect } from 'react';
import type { Workout, User } from '../types';
import { generateWorkoutLibrary } from '../services/customAIService';

const WorkoutCard: React.FC<{ workout: Workout }> = ({ workout }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-bold text-gray-800">{workout.name}</h3>
            <p className="text-indigo-600 font-semibold">{workout.type} • {workout.intensity}</p>
            <p className="text-gray-500 font-medium my-1">{workout.duration}</p>
            <p className="text-gray-600 my-2 text-sm">{workout.description}</p>
        </div>
    );
};

interface WorkoutLibraryPageProps {
    user: User;
}

const WorkoutLibraryPage: React.FC<WorkoutLibraryPageProps> = ({ user }) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWorkouts = async () => {
            setIsLoading(true);
            const generatedWorkouts = await generateWorkoutLibrary(user);
            setWorkouts(generatedWorkouts);
            setIsLoading(false);
        };
        fetchWorkouts();
    }, [user]);

    return (
        <div className="max-w-6xl mx-auto animate-fadeIn">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800">AI-Generated Workout Library</h1>
                <p className="text-xl text-gray-500 mt-2">A personalized set of exercises based on your profile and goals.</p>
            </header>
            
            {isLoading ? (
                <div className="text-center text-gray-500">
                    <p>Your personal AI trainer is generating your workout plan...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workouts.length > 0 ? (
                        workouts.map((workout, index) => (
                            <WorkoutCard key={index} workout={workout} />
                        ))
                    ) : (
                         <p className="text-center text-red-500 col-span-full">Could not generate workouts. Please try again later.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkoutLibraryPage;
