import { EVENT_POSTS } from '@/shared/mocks/mockData';
import Link from 'next/link';
import Image from 'next/image';

type Post = (typeof EVENT_POSTS)[number];

interface EventCardProps {
    event: Post;
}

export default function EventCard({ event }: EventCardProps) {
    return (
        <>
            <div>{event.title}</div>
        </>
    );
}
