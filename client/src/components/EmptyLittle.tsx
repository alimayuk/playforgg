import React from 'react';

interface EmptyLittleProps {
    title: string;
    description?: string | React.ReactNode;
    icon?: React.ReactNode;
}

export const EmptyLittle: React.FC<EmptyLittleProps> = ({
    title,
    description,
    icon,
}) => {
    const defaultIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className='h-10 w-10 md:h-12 md:w-12 text-gray-500'
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );

    return (
        <div className='col-span-full py-12 md:py-16 flex flex-col items-center justify-center space-y-2'>
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-full flex items-center justify-center">
                {icon || defaultIcon}
            </div>

            <h3 className='text-xl md:text-2xl font-semibold text-gray-300 text-center'>
                {title}
            </h3>

            {description && (
                <p className='text-gray-500 text-center max-w-md px-4'>
                    {description}
                </p>
            )}
        </div>
    );
};