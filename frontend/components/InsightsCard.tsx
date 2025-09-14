import React from 'react';

const InsightItem: React.FC<{ stat: string; change: string; isPositive: boolean }> = ({ stat, change, isPositive }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{stat}</p>
        <p className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
);

const InsightsCard: React.FC = () => {
    return (
        <div className="card bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-yellow-700 mb-4">💡 Weekly Insights</h3>
            <div className="grid grid-cols-3 divide-x divide-yellow-300">
                <InsightItem stat="7.2k" change="+12% steps" isPositive={true} />
                <InsightItem stat="2,300" change="-5% calories" isPositive={false} />
                <InsightItem stat="8hr" change="+3% sleep" isPositive={true} />
            </div>
        </div>
    );
};

export default InsightsCard;
