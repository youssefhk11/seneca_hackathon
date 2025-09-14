import React from 'react';
import type { LeaderboardUser, User } from '../types';
import * as db from '../services/database';

const LeaderboardRow: React.FC<{ user: LeaderboardUser; isCurrentUser?: boolean }> = ({ user, isCurrentUser }) => {
    const rankColor = user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-400' : user.rank === 3 ? 'text-orange-400' : 'text-gray-500';
    return (
        <div className={`flex items-center p-4 rounded-lg transition ${isCurrentUser ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-white hover:bg-gray-50'}`}>
            <div className={`w-10 text-xl font-bold ${rankColor}`}>{user.rank}</div>
            <div className="w-12 h-12 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xl mr-4">{user.avatar}</div>
            <div className="flex-grow font-semibold text-gray-800">{user.username}</div>
            <div className="font-bold text-indigo-600 text-lg">{user.points} pts</div>
        </div>
    );
}

interface LeaderboardPageProps {
    currentUser: User;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ currentUser }) => {
    const users: LeaderboardUser[] = db.db_getLeaderboard();
    
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">🏆 Leaderboard</h1>
                <p className="text-lg text-gray-500">See where you stand among the top members.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-4 space-y-2">
                {users.map(user => (
                    <LeaderboardRow key={user.rank} user={user} isCurrentUser={user.username === currentUser.username} />
                ))}
            </div>
        </div>
    );
};

export default LeaderboardPage;
