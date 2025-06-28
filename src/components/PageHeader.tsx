import React from 'react';

interface PageHeaderProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-8">
            {icon && (
                <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/50 dark:to-green-900/50 rounded-xl flex items-center justify-center">
                    <div className="text-teal-600 dark:text-teal-400">
                        {icon}
                    </div>
                </div>
            )}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
} 