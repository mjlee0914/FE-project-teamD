'use client';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { login } from '@/domains/auth/actions/login.action';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const email = String(formData.get('email'));
        const password = String(formData.get('password'));

        const message = await login({ email, password });
        setError(message);

        if (message === null) {
            router.push('/');
        }
    }

    return (
        <form
            action={handleSubmit}
            className="mx-auto flex max-w-sm flex-col gap-2 py-16"
        >
            <label htmlFor="email">이메일</label>
            <Input id="email" name="email" type="email" />
            <label htmlFor="password">비밀번호</label>
            <Input id="password" name="password" type="password" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit">로그인</Button>
            <p className="text-center text-sm text-gray-500">
                아직 회원이 아니신가요?{' '}
                <Link href="/register" className="underline">
                    회원가입
                </Link>
            </p>
        </form>
    );
}
