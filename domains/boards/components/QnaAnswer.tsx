import { formatDateTime } from '../lib/formatDate';
import type { QnaAnswer as QnaAnswerData } from '../types/board.types';

// 관리자 답변 글당 1개만 허용
export default function QnaAnswer({ answer }: { answer: QnaAnswerData }) {
    return (
        <section className="border-b bg-stone-50 px-4 py-5 text-sm">
            <p className="mb-2 text-xs font-bold">
                {answer.answered_by} · {formatDateTime(answer.answered_at)}
                {answer.updated_at && (
                    <span className="ml-2 font-normal text-gray-400">
                        수정됨 · {formatDateTime(answer.updated_at)}
                    </span>
                )}
            </p>
            <p className="whitespace-pre-wrap text-gray-700">
                {answer.content}
            </p>
        </section>
    );
}
