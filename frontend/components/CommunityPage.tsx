import React from 'react';
import type { User } from '../types';
import MembersCard from './MembersCard';
import EventsCard from './EventsCard';
import AIChatCard from './AIChatCard';
import StatsBar from './StatsBar';
import RecipesCard from './RecipesCard';
import ChallengesCard from './ChallengesCard';
import InsightsCard from './InsightsCard';
import MilestoneCard from './MilestoneCard';

interface CommunityPageProps {
    user: User;
    onNavigate: (view: 'leaderboard' | 'nutrition' | 'events') => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, onNavigate }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <header>
                <h1 className="text-4xl font-bold text-gray-800">Hello, {user.username}!</h1>
                <p className="text-lg text-gray-500">Welcome to your FitConnect community dashboard.</p>
            </header>

            <StatsBar />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    <AIChatCard user={user} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ChallengesCard />
                        <div onClick={() => onNavigate('nutrition')} className="cursor-pointer">
                            <RecipesCard />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    <MembersCard onNavigateToLeaderboard={() => onNavigate('leaderboard')} />
                    <EventsCard onNavigateToEvents={() => onNavigate('events')} />
                    <InsightsCard />
                    <MilestoneCard />
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
