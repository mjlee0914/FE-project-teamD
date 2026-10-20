// app/(shop)/[...slug]/page.tsx
import { notFound } from 'next/navigation';

export default function CatchAll() {
    notFound(); // (shop) 레이아웃 안에서 (shop)/not-found.tsx를 그림
}
