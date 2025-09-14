import React, { useState, useRef, useEffect } from 'react';
import * as db from '../services/database';

interface Message {
    id: number;
    sender: string;
    avatar: string;
    text: string;
    isMe: boolean;
}

const GroupChatPage: React.FC = () => {
    const currentUser = db.db_getCurrentUser();
    const groupId = 'tunis_runners'; // Hardcoded group ID for the prototype

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // Load messages from the persistent database
        setMessages(db.db_getChatMessages(groupId));
    }, [groupId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && currentUser) {
            const newMsg = {
                id: Date.now(),
                sender: currentUser.username,
                avatar: currentUser.username.charAt(0).toUpperCase(),
                text: newMessage.trim(),
                isMe: true // This would be dynamic in a real multi-user system
            };
            const updatedMessages = db.db_addChatMessage(groupId, newMsg);
            setMessages(updatedMessages);
            setNewMessage('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col h-[calc(100vh-10rem)] animate-fadeIn">
            <header className="p-6 border-b">
                <h1 className="text-3xl font-bold text-gray-800">🏃 Tunis Runners Group</h1>
                <p className="text-gray-500">Chat with your community members.</p>
            </header>
            <main className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === currentUser?.username ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${msg.sender === currentUser?.username ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {msg.avatar}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-md ${msg.sender === currentUser?.username ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            {msg.sender !== currentUser?.username && <p className="font-bold text-indigo-600 text-sm mb-1">{msg.sender}</p>}
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 <div ref={chatEndRef} />
            </main>
            <footer className="p-4 bg-gray-50 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 rounded-full bg-white border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-indigo-600 text-white py-3 px-6 rounded-full font-bold hover:bg-indigo-700 transition"
                    >
                        Send
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default GroupChatPage;
