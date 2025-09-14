import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
// UPDATED: Import from the custom AI service now
import { getAIChatResponse } from '../services/customAIService';

interface AIChatCardProps {
    user: User;
}

interface AIChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

const AIChatCard: React.FC<AIChatCardProps> = ({ user }) => {
    const [messages, setMessages] = useState<AIChatMessage[]>([
        { sender: 'ai', text: "Hello! I'm your AI fitness assistant. Based on your profile, I can help with workout plans, nutrition advice, and motivation. What would you like to know?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const newMessages: AIChatMessage[] = [...messages, { sender: 'user', text: trimmedInput }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);
        
        // UPDATED: Call the new function from the custom AI service
        const aiResponseText = await getAIChatResponse(trimmedInput, user);
        
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="card bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">🤖 AI Fitness Assistant</h3>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-4 flex flex-col h-96">
                <div className="chat-messages flex-grow overflow-y-auto pr-2 bg-white/10 rounded-lg p-3 mb-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-white/30 rounded-br-none' : 'bg-white/20 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white/20 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm">AI is typing</span>
                                    <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-input flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything..."
                        className="flex-1 px-4 py-2 rounded-full bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        className="bg-white/30 text-white py-2 px-6 rounded-full font-bold hover:bg-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatCard;