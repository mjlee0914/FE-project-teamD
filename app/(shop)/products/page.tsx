import { Input } from '@/shared/components/ui/input';

export default function ProductList() {
    return (
        <div>
            {/* 좌측 메뉴 */}
            <aside></aside>
            <div>
                {/* 검색영역 */}
                <section>
                    <form id="searchForm">
                        <Input type="text" name="searchValue" />
                    </form>
                </section>
                {/* 상품 영역 */}
                <section></section>
                {/* 페이징 영역 */}
                <nav></nav>
            </div>
        </div>
    );
}
