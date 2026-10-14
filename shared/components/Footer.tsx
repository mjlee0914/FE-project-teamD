import { cn } from '@/shared/utils/cn';
import Link from 'next/link';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
    return (
        <footer
            className={cn('mt-auto w-full border-t border-gray-200 bg-gray-50')}
        >
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
                {/* 메인 정보: 모바일 1열 -> md 이상 3열 그리드 */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* 서비스 소개 */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-900">
                            회사 소개
                        </h3>
                        <p className="text-xs leading-relaxed text-gray-500">
                            상호명: (주) 디엠몰 | 대표: 정현구
                        </p>
                        <p className="text-xs leading-relaxed text-gray-500">
                            주소 : 서울 구로구 구로동 170-10 대륭포스트타워 7차
                            15층
                        </p>
                        <p className="text-xs leading-relaxed text-gray-500">
                            통신판매업신고 : 2026-KANT-1012 | 사업자등록번호 :
                            000-00-0000
                        </p>
                        <p className="text-xs leading-relaxed text-gray-500">
                            개인정보관리책임자 : 이명지 | 제휴/협력문의 :
                            ninja@dnmall.com
                        </p>
                    </div>

                    {/* 고객센터 안내 */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold tracking-wider text-gray-900 uppercase">
                            고객지원
                        </h4>
                        <p className="text-xs text-gray-600">
                            운영시간: 평일 09:00 - 18:00 (주말, 공휴일 휴무)
                        </p>
                        <p className="text-xs text-gray-500">
                            이메일: inquries@dnmall.com
                        </p>
                        <p className="text-xs text-gray-500">
                            콜센터: 1688-0000
                        </p>
                    </div>
                    {/* 바로가기 링크 */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold tracking-wider text-gray-900 uppercase">
                            바로가기
                        </h4>
                        <ul className="flex flex-wrap gap-4 text-xs text-gray-600 md:flex-col md:gap-1.5">
                            <li>
                                <Link
                                    href="/board"
                                    className="hover:text-blue-600"
                                >
                                    자유게시판
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/board/notice"
                                    className="hover:text-blue-600"
                                >
                                    공지사항
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/board/event"
                                    className="hover:text-blue-600"
                                >
                                    이벤트
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/board/qna"
                                    className="hover:text-blue-600"
                                >
                                    고객 Q&A
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 하단 카피라이트 */}
                <div className="mt-8 border-t border-gray-200 pt-6 text-center md:flex md:items-center md:justify-between md:text-left">
                    <p className="text-xs text-gray-400">
                        &copy; {CURRENT_YEAR} Team DN. All rights reserved.
                    </p>
                    <p className="mt-2 text-xs text-gray-400 md:mt-0">
                        Team Disco Ninja FrontEnd Project
                    </p>
                </div>
            </div>
        </footer>
    );
}
