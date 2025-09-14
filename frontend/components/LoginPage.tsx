import React, { useState } from 'react';
import Alert from './common/Alert';

interface LoginPageProps {
    onLogin: (phone: string, pass: string) => void;
    onSwitchToRegister: () => void;
    error: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister, error }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(phone, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
                    <p className="mt-2 text-gray-500">Log in to your FitConnect account.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        required
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Alert message={error} type="error" />
                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-500">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToRegister} className="font-semibold text-indigo-600 hover:underline">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
