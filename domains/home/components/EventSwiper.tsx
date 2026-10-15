'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import EventCard from './EventCard';
import type { Post } from '@/domains/boards/types/board.types';

interface EventSwiperProps {
    post: Post[];
}

export default function EventSwiper({ post }: EventSwiperProps) {
    return (
        <section>
            <Swiper
                effect={'fade'}
                navigation={false}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                }}
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
            >
                {post.map((post) => (
                    <SwiperSlide key={post.id} className="h-30">
                        <EventCard post={post} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
