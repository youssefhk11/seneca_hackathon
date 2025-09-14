import React from 'react';
import type { Stat } from '../types';

const StatCard: React.FC<Stat> = ({ label, value }) => {
    return (
        <div className="text-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105">
            <span className="text-3xl font-extrabold block">{value}</span>
            <span className="text-sm opacity-80">{label}</span>
        </div>
    );
};

export default StatCard;