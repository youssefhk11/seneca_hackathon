import React, { useState } from 'react';
import type { RegistrationData } from '../types';
import Alert from './common/Alert';

interface RegistrationPageProps {
    onRegister: (data: RegistrationData) => void;
    onSwitchToLogin: () => void;
    error: string;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onSwitchToLogin, error }) => {
    const [formData, setFormData] = useState<RegistrationData>({
        username: '',
        surname: '',
        phone: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Create Account</h1>
                    <p className="mt-2 text-gray-500">Join the FitConnect community!</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input name="username" value={formData.username} onChange={handleChange} placeholder="First Name" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Last Name" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <Alert message={error} type="error" />
                    <button type="submit" className="w-full py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                        Sign Up
                    </button>
                </form>
                 <p className="text-center text-gray-500">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-semibold text-indigo-600 hover:underline">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegistrationPage;
