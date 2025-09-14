
import React from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'error';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    const baseClasses = 'p-4 my-4 border rounded-lg font-semibold';
    const typeClasses = type === 'success'
        ? 'bg-green-100 border-green-400 text-green-700'
        : 'bg-red-100 border-red-400 text-red-700';

    if (!message) return null;

    return (
        <div className={`${baseClasses} ${typeClasses}`} role="alert">
            {message}
        </div>
    );
};

export default Alert;
