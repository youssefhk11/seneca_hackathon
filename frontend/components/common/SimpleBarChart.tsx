import React from 'react';

interface ChartDataItem {
    label: string;
    value: number;
}

interface SimpleBarChartProps {
    data: ChartDataItem[];
    barColorClass?: string;
    title: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, barColorClass = 'bg-indigo-500', title }) => {
    const maxValue = Math.max(...data.map(item => item.value), 0);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
            <div className="flex justify-around items-end h-64 gap-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                           <div
                                className={`w-3/4 rounded-t-md ${barColorClass} transition-all duration-500 hover:opacity-80`}
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                                title={`${item.label}: ${item.value}`}
                           ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleBarChart;
