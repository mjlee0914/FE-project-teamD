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
        <section className="pr-30 pl-30">
            <Suspense fallback={<div>이벤트 로딩중...</div>}>
                <Swiper
                    effect={'fade'}
                    slidesPerView={1}
                    navigation
                    spaceBetween={0}
                    loop={post.length >= 4}
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    modules={[Autoplay, Navigation]}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {post.map((post) => (
                        <SwiperSlide key={post.id} className="h-30">
                            <EventCard post={post} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Suspense>
        </section>
    );
}
