import type { Product } from '@/domains/products/types/product.types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { AdminAlertDialog } from '@/domains/admin/components/AlertDialog';
import { formatPrice } from '@/shared/utils/formatPrice';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function ProductTable({
    products,
    onEdit,
    onDelete,
}: ProductTableProps) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>ID</TableHead>
                        <TableHead>상품명</TableHead>
                        <TableHead>가격</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>작업</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.length <= 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="h-24 text-center text-gray-500"
                            >
                                등록된 상품이 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                    {formatPrice(product.price)}
                                </TableCell>
                                <TableCell>{product.category_id}</TableCell>
                                <TableCell>
                                    <Button
                                        type="button"
                                        onClick={() => onEdit(product)}
                                    >
                                        상세
                                    </Button>
                                    <AdminAlertDialog
                                        buttonName="삭제"
                                        title="삭제하시겠습니까?"
                                        description="삭제시 복구할 수 없습니다."
                                        onClick={() => onDelete(product)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>
    );
}
