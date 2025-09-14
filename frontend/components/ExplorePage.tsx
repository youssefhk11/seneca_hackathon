import React, { useState } from 'react';
import { generateHealthArticle } from '../services/customAIService';
import type { Article } from '../types';

const FeatureCard: React.FC<{ icon: string; title: string; description: string; color: string; onClick?: () => void }> = ({ icon, title, description, color, onClick }) => (
    <div onClick={onClick} className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${color} ${onClick ? 'cursor-pointer' : ''}`}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80">{description}</p>
    </div>
);

const ArticleModal: React.FC<{ article: Article, onClose: () => void }> = ({ article, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h2>
            <div className="prose max-w-none whitespace-pre-wrap">{article.content}</div>
        </div>
    </div>
);

interface ExplorePageProps {
    onNavigate: (view: 'workout-library' | 'events') => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoadingArticle, setIsLoadingArticle] = useState(false);

    const handleGetArticle = async () => {
        setIsLoadingArticle(true);
        const generatedArticle = await generateHealthArticle();
        setArticle(generatedArticle);
        setIsLoadingArticle(false);
    };

    return (
        <div className="max-w-6xl mx-auto animate-fadeIn">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800">Explore FitConnect</h1>
                <p className="text-xl text-gray-500 mt-2">Discover new workouts, events, and challenges.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon="🏋️" 
                    title="Workout Library" 
                    description="Get a set of AI-generated exercises tailored specifically to your profile and goals."
                    color="bg-gradient-to-br from-red-500 to-orange-500"
                    onClick={() => onNavigate('workout-library')}
                />
                 <FeatureCard 
                    icon="🗓️" 
                    title="Local Events" 
                    description="Find and join group runs, yoga sessions, and workshops happening in Tunis."
                    color="bg-gradient-to-br from-blue-500 to-indigo-500"
                    onClick={() => onNavigate('events')}
                />
                 <FeatureCard 
                    icon="🏆" 
                    title="Active Challenges" 
                    description="Compete in weekly and monthly challenges to earn points and climb the leaderboard."
                    color="bg-gradient-to-br from-purple-500 to-pink-500"
                />
                <FeatureCard 
                    icon="🥗" 
                    title="Health Articles" 
                    description="Generate a unique, AI-written article on a health and wellness topic."
                    color="bg-gradient-to-br from-green-500 to-teal-500"
                    onClick={handleGetArticle}
                />
                <FeatureCard 
                    icon="💬" 
                    title="Group Chats" 
                    description="Connect with members who share your interests in dedicated group chats."
                    color="bg-gradient-to-br from-yellow-400 to-amber-500"
                />
                <FeatureCard 
                    icon="🤖" 
                    title="AI Assistant" 
                    description="Your personal AI coach for workout plans, motivation, and fitness questions."
                    color="bg-gradient-to-br from-gray-700 to-gray-900"
                />
            </div>
            {isLoadingArticle && <div className="text-center p-4">Generating article...</div>}
            {article && <ArticleModal article={article} onClose={() => setArticle(null)} />}
        </div>
    );
};

export default ExplorePage;
