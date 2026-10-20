'use server';

import { createServerClient } from '@/lib/supabase';
import type { ActionState } from '@/shared/types/action.types';
import { validateCreateCategory } from '../utils/categoryValidate';

export async function addCategory(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const errors = validateCreateCategory(formData);

    if (errors) {
        return {
            success: false,
            errors: errors,
        };
    }

    const name = formData.get('name') as string;
    const parentId = formData.get('parent_id') as string;
    const type = formData.get('type') as string;
    const values = {
        name: name,
        parent_id: parentId,
        type: type,
    };

    const supabase = createServerClient();

    const { error } = await supabase.from('category').insert({
        name: name,
        parent_id: parentId,
        type: type,
    });

    if (error) {
        return {
            success: false,
            values: values,
        };
    }

    return { success: true };
}

function getParentCategoryDepth(parentId: string) {}

function getLastSortOrder(parentId: string) {}
