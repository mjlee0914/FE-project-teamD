import { formatDate } from '../lib/formatDate';
import type { QnaAnswer as QnaAnswerData } from '../types/board.types';

// 관리자 답변 글당 1개만 허용
export default function QnaAnswer({ answer }: { answer: QnaAnswerData }) {
    return (
        <section className="border-b bg-stone-50 px-4 py-5 text-sm">
            <p className="mb-2 text-xs font-bold">
                {answer.answered_by} · {formatDate(answer.answered_at)}
            </p>
            <p className="shitespace-pre-wrap text-gray-700">
                {answer.content}
            </p>
        </section>
    );
}
