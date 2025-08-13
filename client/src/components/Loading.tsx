'use client';

import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center py-12 h-96">
            <div className="relative inline-flex">
                {/* Dış halka */}
                <div className="w-12 h-12 rounded-full absolute border-4 border-gray-300 dark:border-gray-600"></div>

                {/* Animasyonlu iç halka */}
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-orange-500 border-t-transparent"></div>

                {/* Logo veya ikon (opsiyonel) */}
                <div className="w-12 h-12 flex items-center justify-center">
                    <svg
                        className="w-6 h-6 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Loading;