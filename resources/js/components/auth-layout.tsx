import React from 'react';

interface AuthLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            🛒 FreshMart
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
                        <p className="text-gray-600 text-sm">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}