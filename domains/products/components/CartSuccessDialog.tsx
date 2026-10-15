
'use client';

import Link from 'next/link';
import { LuCheck } from 'react-icons/lu';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';

interface CartSuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CartSuccessDialog({
    open,
    onOpenChange,
}: CartSuccessDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-w-sm gap-0 rounded-2xl border border-gray-100 bg-white px-6 pb-6 pt-12 shadow-xl">
                {/* 성공 아이콘과 안내 문구 */}
                <DialogHeader className="items-center gap-0 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300">
                        <LuCheck className="h-7 w-7 text-black" />
                    </div>

                    <DialogTitle className="mt-6 text-center text-lg font-semibold leading-6 text-gray-900">
                        장바구니에 담겼습니다
                    </DialogTitle>

                    <DialogDescription className="mt-3 text-center text-sm leading-6 text-gray-500">
                        선택하신 상품이 장바구니에
                        <br />
                        추가되었습니다.
                    </DialogDescription>
                </DialogHeader>

                {/* 하단 버튼 */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                    {/* 쇼핑 계속하기 */}
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="h-12 border border-gray-300 bg-white text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                    >
                        쇼핑 계속하기
                    </button>

                    {/* 장바구니 이동 */}
                    <Link
                        href="/cart"
                        onClick={() => onOpenChange(false)}
                        className="flex h-12 items-center justify-center bg-[#171717] text-sm font-medium text-white transition-colors hover:bg-[#333333]"
                    >
                        장바구니 보기
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
