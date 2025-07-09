import React from 'react'

type TitleProps = {
    title1: string;
    title2: string;
}
const Title = ({ title1, title2 }: TitleProps) => {
    return (
        <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-px bg-orange-600"></div>
            <p className="text-4xl font-semibold text-orange-600 uppercase">{title1}</p>
            <p className="text-4xl font-semibold text-gray-300 uppercase">{title2}</p>
            <div className="flex-grow h-px bg-orange-600 opacity-50 ml-4"></div>
        </div>
    )
}

export default Title