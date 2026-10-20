import type { CategoryType } from '@/domains/admin/category/types/category.type';

export interface Category {
    id: string;
    parent_id: string | null;
    name: string;
    depth: number;
    sort_order: number;
    type?: CategoryType;
    children?: Category[];
}
