import React from 'react';
import * as db from '../services/database';

const MemberItem: React.FC<{ name: string; avatar: string; isLast: boolean }> = ({ name, avatar, isLast }) => (
    <>
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xl">
                {avatar}
            </div>
            <div>
                <p className="font-semibold text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">Active Member</p>
            </div>
        </div>
        {!isLast && <hr className="my-3" />}
    </>
);

interface MembersCardProps {
    onNavigateToLeaderboard: () => void;
}

const MembersCard: React.FC<MembersCardProps> = ({ onNavigateToLeaderboard }) => {
    const members = db.db_getCommunityMembers().slice(0, 3); // Show top 3

    return (
        <div className="card bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">👥 Community Members</h3>
            <div className="space-y-3">
                {members.map((member, index) => (
                    <MemberItem key={member.id} name={member.username} avatar={member.username.charAt(0).toUpperCase()} isLast={index === members.length - 1} />
                ))}
            </div>
             <button onClick={onNavigateToLeaderboard} className="w-full mt-4 py-2 font-bold text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition">
                View All
            </button>
        </div>
    );
};

export default MembersCard;
