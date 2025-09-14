import React from 'react';
import type { ReportData } from '../types';
import SimpleBarChart from './common/SimpleBarChart';

const ReportPage: React.FC = () => {
    const reportData: ReportData = {
        weeklyProgress: [
            { day: 'Mon', value: 30 },
            { day: 'Tue', value: 45 },
            { day: 'Wed', value: 60 },
            { day: 'Thu', value: 50 },
            { day: 'Fri', value: 75 },
            { day: 'Sat', value: 90 },
            { day: 'Sun', value: 20 },
        ],
        monthlyProgress: [
            { month: 'Jan', value: 1200 },
            { month: 'Feb', value: 1500 },
            { month: 'Mar', value: 1400 },
            { month: 'Apr', value: 1800 },
        ],
    };
    
    const weeklyChartData = reportData.weeklyProgress.map(d => ({ label: d.day, value: d.value }));
    const monthlyChartData = reportData.monthlyProgress.map(d => ({ label: d.month, value: d.value }));

    return (
         <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <header className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">📊 Progress Reports</h1>
                <p className="text-lg text-gray-500">Visualize your fitness journey and track your achievements.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SimpleBarChart 
                    data={weeklyChartData} 
                    title="This Week's Activity (Minutes)"
                    barColorClass="bg-green-500"
                />
                 <SimpleBarChart 
                    data={monthlyChartData} 
                    title="Monthly Calorie Burn"
                    barColorClass="bg-blue-500"
                />
            </div>
        </div>
    );
};

export default ReportPage;
