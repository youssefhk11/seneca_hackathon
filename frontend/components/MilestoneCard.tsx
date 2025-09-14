import React from 'react';

const MilestoneCard: React.FC = () => {
    return (
        <div className="card bg-teal-50 border-l-4 border-teal-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-teal-600 mb-4">🎉 Latest Milestone</h3>
            <div className="text-center">
                <div className="text-5xl mb-2">🏅</div>
                <p className="font-bold text-gray-800">50 Workouts Logged!</p>
                <p className="text-sm text-gray-600">You're on a roll. Keep up the great work!</p>
            </div>
        </div>
    );
};

export default MilestoneCard;
