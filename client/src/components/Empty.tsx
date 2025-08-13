'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
}

const Empty: React.FC<EmptyProps> = ({
  title = 'Veri bulunamadı',
  description = 'Aradığınız içerik şu anda mevcut değil.',
  actionText,
  actionHref,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center h-96 py-12 text-center ${className}`}>
      <div className="mb-6">
        <svg
          className="w-20 h-20 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>
      
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default Empty;