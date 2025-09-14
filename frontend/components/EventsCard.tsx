import React from 'react';
import type { Event } from '../types';
import * as db from '../services/database';

const EventItem: React.FC<{ event: Event, isLast: boolean }> = ({ event, isLast }) => {
    const icon = event.type === 'run' ? '🏃' : event.type === 'yoga' ? '🧘' : '🧑‍🏫';
    return (
        <>
            <div className="flex items-start space-x-4">
                <div className="text-3xl">{icon}</div>
                <div>
                    <p className="font-bold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date} • {event.location}</p>
                </div>
            </div>
            {!isLast && <hr className="my-3" />}
        </>
    );
};

interface EventsCardProps {
    onNavigateToEvents: () => void;
}

const EventsCard: React.FC<EventsCardProps> = ({ onNavigateToEvents }) => {
    const events: Event[] = db.db_getCommunityEvents().slice(0, 3); // Preview top 3
    
    return (
        <div className="card bg-blue-50 border-l-4 border-blue-500 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">🗓️ Upcoming Events</h3>
            <div className="space-y-3">
                {events.map((event, index) => (
                    <EventItem key={event.id} event={event} isLast={index === events.length - 1} />
                ))}
            </div>
             <button onClick={onNavigateToEvents} className="w-full mt-4 py-2 font-bold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition">
                View All Events
            </button>
        </div>
    );
};

export default EventsCard;
