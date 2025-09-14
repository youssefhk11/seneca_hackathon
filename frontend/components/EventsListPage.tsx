import React, { useState } from 'react';
import type { Event } from '../types';
import * as db from '../services/database';
// AI service is not used here, but could be for generating plans in a modal

const EventsListPage: React.FC = () => {
    const allEvents: Event[] = db.db_getCommunityEvents();

    return (
         <div className="max-w-4xl mx-auto animate-fadeIn">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800">Community Events in Tunis</h1>
                <p className="text-xl text-gray-500 mt-2">Find and join events hosted by the FitConnect community.</p>
            </header>
            <div className="space-y-6">
                {allEvents.map(event => (
                     <div key={event.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between">
                         <div>
                            <p className="font-bold text-xl text-indigo-600">{event.title}</p>
                            <p className="text-gray-600">{event.date}</p>
                            <p className="text-sm text-gray-500">{event.location}</p>
                        </div>
                        <button className="bg-indigo-100 text-indigo-700 font-bold py-2 px-5 rounded-full hover:bg-indigo-200 transition">
                            Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsListPage;
