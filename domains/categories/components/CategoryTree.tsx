import Link from 'next/link';
import type { Category } from '@/domains/categories/types/category.types';

interface CategoryTreeProps {
    categories: Category[];
    level?: number;
    selectedCategoryId?: string;
}

export default function CategoryTree({
    categories,
    level = 1,
    selectedCategoryId,
}: CategoryTreeProps) {
    return (
        <ul className="space-y-2">
            {categories.map((category) => {
                const hasChildren = !!category.children?.length;

                return (
                    <li key={category.id}>
                        {!hasChildren ? (
                            // 마지막 단계: 카테고리 ID를 쿼리스트링으로 전달
                            <Link
                                href={{
                                    pathname: '/products',
                                    query: { categoryId: category.id },
                                }}
                                className={`block py-1 text-sm ${
                                    selectedCategoryId === category.id
                                        ? 'font-bold text-black'
                                        : 'font-normal text-gray-500 hover:text-black'
                                }`}
                            >
                                {category.name}
                            </Link>
                        ) : level === 1 ? (
                            // 최상위: 항상 표시
                            <div className="mb-6">
                                <h2 className="mb-3 font-semibold">
                                    <Link
                                        href={{
                                            pathname: '/products',
                                            query: { categoryId: category.id },
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                </h2>

                                <div className="pl-4">
                                    <CategoryTree
                                        categories={category.children!}
                                        level={level + 1}
                                        selectedCategoryId={selectedCategoryId}
                                    />
                                </div>
                            </div>
                        ) : (
                            // 중간 단계: 클릭해서 펼치기
                            <details className="group">
                                <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-sm [&::-webkit-details-marker]:hidden">
                                    <Link
                                        href={{
                                            pathname: '/products',
                                            query: { categoryId: category.id },
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                    <span className="transition-transform group-open:rotate-180">
                                        ▾
                                    </span>
                                </summary>

                                <div className="pb-2 pl-4">
                                    <CategoryTree
                                        categories={category.children!}
                                        level={level + 1}
                                        selectedCategoryId={selectedCategoryId}
                                    />
                                </div>
                            </details>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
