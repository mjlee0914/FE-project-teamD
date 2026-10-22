'use client';

import { useState } from 'react';

interface StarRatingInputProps {
    defaultValue?: number;
}

// 별점 선택 (제출은 숨은 rating 입력칸으로 작동)
export default function StarRatingInput({
    defaultValue = 0,
}: StarRatingInputProps) {
    const [value, setValue] = useState(defaultValue); // 선택된 점수
    const [hover, setHover] = useState(0); // 마우스를 올리면 채워보임
    const shown = hover || value;

    return (
        <div
            role="radiogroup"
            aria-label="별점"
            className="flex items-center gap-1"
            onMouseLeave={() => setHover(0)}
        >
            <input type="hidden" name="rating" value={value || ''} />
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button" // 누른다고 폼이 제출되지 않도록 그냥 버튼
                    role="radio"
                    aria-checked={value === n}
                    aria-label={`${n}점`}
                    onClick={() => setValue(n)}
                    onMouseEnter={() => setHover(n)}
                    onFocus={() => setHover(n)}
                    onBlur={() => setHover(0)}
                    className={`cursor-pointer text-2xl leading-none ${n <= shown ? 'text-amber-500' : 'text-gray-300'}`}
                >
                    ★
                </button>
            ))}
            <span className="ml-2 text-xs text-gray-500">
                {value ? '' : '별점을 선택해주세요.'}
            </span>
        </div>
    );
}
