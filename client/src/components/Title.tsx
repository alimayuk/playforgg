import React from 'react'

type TitleProps = {
    title1: string;
    title2: string;
}
const Title = ({ title1, title2 }: TitleProps) => {
    return (
        <div className="flex items-center gap-1 sm:gap-2 mb-6 md:mb-8">
            <div className="w-4 sm:w-6 md:w-8 h-px bg-orange-600"></div>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-orange-600 uppercase whitespace-nowrap">
                {title1}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-300 uppercase whitespace-nowrap">
                {title2}
            </p>
            <div className="flex-grow h-px bg-orange-600 opacity-50 ml-2 sm:ml-4"></div>
        </div>
    )
}

export default Title