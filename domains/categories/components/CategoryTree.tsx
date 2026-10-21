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
        <ul
            className={
                level === 1
                    ? 'list-none space-y-3 p-0'
                    : 'mt-2 list-none space-y-2 pl-5'
            }
        >
            {categories.map((category) => (
                <li key={category.id}>
                    <Link
                        href={{
                            pathname: '/products',
                            query: { categoryId: category.id },
                        }}
                        className={`block py-1 ${
                            level === 1 ? 'text-base font-semibold' : 'text-sm'
                        } ${
                            selectedCategoryId === category.id
                                ? 'font-bold text-black'
                                : 'text-gray-500 hover:text-black'
                        }`}
                    >
                        {category.name}
                    </Link>

                    {category.children && category.children.length > 0 && (
                        <CategoryTree
                            categories={category.children}
                            level={level + 1}
                            selectedCategoryId={selectedCategoryId}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
}
