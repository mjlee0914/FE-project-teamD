import { createServerClient } from '@/lib/supabase';

interface GetCategoryProductsParams {
    categoryId?: string;
}
