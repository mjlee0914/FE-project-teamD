'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Suspense } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';

import EventCard from './EventCard';
import type { Post } from '@/domains/boards/types/board.types';

interface EventSwiperProps {
    post: Post[];
}

export default function EventSwiper({ post }: EventSwiperProps) {
    return (
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-30">
            <Suspense fallback={<div>이벤트 로딩중...</div>}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={16}
                    navigation
                    loop={post.length >= 4}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    modules={[Autoplay, Navigation]}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                    }}
                >
                    {post.map((post) => (
                        <SwiperSlide key={post.id} className="h-auto">
                            <EventCard post={post} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Suspense>
        </div>
    );
}
