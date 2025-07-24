'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
    'https://cdn.akamai.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg',
    'https://gamizm.com/wp-content/uploads/league-of-legends-banner.jpg',
    'https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2022/8/6/vafqutbzwfig41ybxze7/fut-esports-valorant',
    'https://egw.news/uploads/news/1/17/1741939626030_1741939626030.webp',
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
