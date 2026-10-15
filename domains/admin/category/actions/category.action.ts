import { supabase } from '@/lib/supabase';

async function checkConnection() {
    const { data, error } = await supabase
        .from('category') // 실제 테이블명과 일치해야 함
        .select('id, parent_id, name, depth, sort_order');

    if (error) {
        console.error('조회 실패:', error.message);
        return;
    }

    console.log('조회 성공:', data);
}
