'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
    '/images/a.png',
    '/images/b.jpg',
    '/images/c.jpg',
    '/images/d.jpg',
];

export default function ImageSwiper() {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            speed={700}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            className="max-w-screen-2xl mx-auto my-8 p-4 max-h-[600px] overflow-hidden rounded-lg shadow-lg select-none"
        >
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <img
                        src={src}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full  object-cover object-center rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
