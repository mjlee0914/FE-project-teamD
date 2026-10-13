'use client';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export default function LoginForm() {
    return (
        <form className="mx-auto flex max-w-sm flex-col gap-2 py-16">
            <label htmlFor="loginId">아이디</label>
            <Input id="loginId" name="loginId" />
            <label htmlFor="password">비밀번호</label>
            <Input id="password" name="password" type="password" />
            <Button type="submit">로그인</Button>
        </form>
    );
}
