import React from 'react';
import type { Challenge } from '../types';

const ChallengeItem: React.FC<{ challenge: Challenge }> = ({ challenge }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-gray-800">{challenge.title}</p>
            <p className="text-sm font-bold text-purple-600">{challenge.reward}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${challenge.progress}%` }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{challenge.description}</p>
    </div>
);

const ChallengesCard: React.FC = () => {
    const challenges: Challenge[] = [
        { id: 1, title: 'Weekly Step Goal', description: 'Walk 50,000 steps this week.', progress: 75, reward: '+50 pts' },
        { id: 2, title: 'Consistency King', description: 'Log a workout 5 days in a row.', progress: 40, reward: '+100 pts' },
    ];
    return (
        <div className="card bg-purple-50 border-l-4 border-purple-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">🏆 Active Challenges</h3>
            <div className="space-y-4">
                {challenges.map(challenge => <ChallengeItem key={challenge.id} challenge={challenge} />)}
            </div>
        </div>
    );
};

export default ChallengesCard;
