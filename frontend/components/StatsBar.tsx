import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import * as db from '../services/database';
import type { Stat } from '../types';

const StatsBar: React.FC = () => {
    const [stats, setStats] = useState<Stat[]>([]);

    useEffect(() => {
        // Fetch stats dynamically from the mock database
        const communityStats = db.db_getCommunityStats();
        setStats(communityStats);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
        </div>
    );
};

export default StatsBar;
