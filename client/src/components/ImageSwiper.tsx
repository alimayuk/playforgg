'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
    {
        image: 'https://cdn.akamai.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg',
        title: 'Counter-Strike 2',
        description: 'Yeni nesil FPS deneyimini yaşayın'
    },
    {
        image: 'https://gamizm.com/wp-content/uploads/league-of-legends-banner.jpg',
        title: 'League of Legends',
        description: 'Stratejinizi geliştirin, zaferi kucaklayın'
    },
    {
        image: 'https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2022/8/6/vafqutbzwfig41ybxze7/fut-esports-valorant',
        title: 'Valorant',
        description: 'Taktiksel becerilerinizi sınayın'
    },
    {
        image: 'https://egw.news/uploads/news/1/17/1741939626030_1741939626030.webp',
        title: 'Mobile Legends Bang Bang',
        description: 'Epik savaşlara katılın'
    },
];

export default function ImageSwiper() {
    return (
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            speed={700}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
            }}
            className="max-w-screen-2xl mx-auto my-8 h-[300px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-lg shadow-lg select-none"
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index} className="relative">
                    <img
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover object-top rounded-lg shadow-md"
                    />
                    {/* Aşağıdan yukarıya siyah gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/90 to-transparent"></div>

                    {/* Metin içeriği - Tüm ekran boyutlarında düzgün görünsün diye güncellendi */}
                    <div className="absolute bottom-4 left-4 w-full p-6 text-white">
                        <div className="container mx-auto">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 drop-shadow-lg">{slide.title}</h2>
                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl drop-shadow-lg">{slide.description}</p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}