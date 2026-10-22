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

    // 주문서(체크아웃)와 같은 모양: 굵은 제목 + 테두리 카드 + 검은 둥근 버튼
    return (
        <div className="mx-auto max-w-md px-4 py-12 md:py-16">
            <h3 className="text-2xl font-black text-gray-900">로그인</h3>
            <p className="mt-1 mb-6 text-sm text-gray-500">
                이메일과 비밀번호로 로그인해 주세요.
            </p>

            <form
                action={handleSubmit}
                className="flex flex-col gap-6 rounded-xs border p-6"
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-bold">
                        이메일
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-bold">
                        비밀번호
                    </label>
                    <Input id="password" name="password" type="password" />
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-black font-bold text-white hover:bg-zinc-700"
                >
                    로그인
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                아직 회원이 아니신가요?{' '}
                <Link
                    href="/register"
                    className="font-bold text-gray-900 underline"
                >
                    회원가입
                </Link>
            </p>
        </div>
    );
}
