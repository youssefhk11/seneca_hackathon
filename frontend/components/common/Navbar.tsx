import React from 'react';

type NavView = 'community' | 'profile' | 'leaderboard' | 'nutrition' | 'reports' | 'explore' | 'events' | 'workout-library';

interface NavbarProps {
    currentView: NavView;
    onNavigate: (view: NavView) => void;
    onLogout: () => void;
    username: string;
}

const NavItem: React.FC<{
    label: string;
    view: NavView;
    currentView: NavView;
    onClick: (view: NavView) => void;
    icon: string;
}> = ({ label, view, currentView, onClick, icon }) => {
    const isActive = currentView === view;
    return (
        <button
            onClick={() => onClick(view)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors duration-200 ${
                isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-lg'
                    : 'text-gray-300 hover:bg-indigo-700 hover:text-white'
            }`}
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-lg">{label}</span>
        </button>
    );
};

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onLogout, username }) => {
    return (
        <nav className="bg-indigo-800 text-white w-64 min-h-screen p-4 flex flex-col justify-between shadow-2xl">
            <div>
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-white">FitConnect</h1>
                    <p className="text-indigo-300">Welcome, {username}!</p>
                </div>
                <div className="space-y-3">
                    <NavItem icon="🤝" label="Community" view="community" currentView={currentView} onClick={onNavigate} />
                    <NavItem icon="👤" label="My Profile" view="profile" currentView={currentView} onClick={onNavigate} />
                    <NavItem icon="🏆" label="Leaderboard" view="leaderboard" currentView={currentView} onClick={onNavigate} />
                    <NavItem icon="🥗" label="Nutrition" view="nutrition" currentView={currentView} onClick={onNavigate} />
                    <NavItem icon="📊" label="Reports" view="reports" currentView={currentView} onClick={onNavigate} />
                    <NavItem icon="🧭" label="Explore" view="explore" currentView={currentView} onClick={onNavigate} />
                </div>
            </div>
            <button
                onClick={onLogout}
                className="w-full py-3 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
