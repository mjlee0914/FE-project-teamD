'use client';

import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

interface ButtonType {
    link: string;
    name: string;
}

interface ModalProps {
    open: boolean;
    title?: string;
    content: React.ReactNode;
    buttons?: ButtonType[];
    className?: string;
    setPopupOpen?: (open: boolean) => void;
}
export default function Modal({
    open,
    title,
    content,
    buttons,
    className,
}: ModalProps) {
    const openRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open) {
            openRef.current?.click();
        } else closeRef?.current?.click();
    }, [openRef, closeRef, open]);

    return (
        <Dialog>
            <DialogTrigger
                className="hidden"
                render={<Button variant="outline" ref={openRef}></Button>}
            />
            <DialogClose
                className="hidden"
                render={
                    <Button variant="outline" ref={closeRef}>
                        Cancel
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    <DialogDescription className={className}>
                        {content}
                    </DialogDescription>
                </DialogHeader>

                {buttons && (
                    <DialogFooter>
                        {buttons.map(({ link, name }, i) => (
                            <Link key={`${link}_${i}`} href={link}>
                                <Button type="button">{name}</Button>
                            </Link>
                        ))}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
