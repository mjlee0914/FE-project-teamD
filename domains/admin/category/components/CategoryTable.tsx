'use client';

import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Category } from '@/domains/categories/types/category.types';
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

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    searching: boolean;
}

export default function CategoryTable({
    categories,
    onEdit,
    onDelete,
    searching,
}: CategoryTableProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(
        () => new Set(),
    );

    function toggleCategory(id: string) {
        setExpandedIds((previous) => {
            const next = new Set(previous);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    }

    function renderRows(items: Category[], level = 0): React.ReactNode {
        return items.map((category) => {
            const children = category.children ?? [];
            const hasChildren = children.length > 0;
            const isExpanded = searching || expandedIds.has(category.id);

            return (
                <Fragment key={category.id}>
                    <TableRow>
                        <TableCell>
                            <div
                                className="flex items-center gap-2"
                                style={{ paddingLeft: `${level * 1.5}rem` }}
                            >
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleCategory(category.id)
                                        }
                                        aria-expanded={isExpanded}
                                        aria-label={`${category.name} 하위 카테고리 ${
                                            isExpanded ? '접기' : '펼치기'
                                        }`}
                                        className="flex size-7 shrink-0 items-center justify-center rounded hover:bg-gray-100"
                                    >
                                        {isExpanded ? (
                                            <ChevronDown className="size-4" />
                                        ) : (
                                            <ChevronRight className="size-4" />
                                        )}
                                    </button>
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className="size-7 shrink-0"
                                    />
                                )}

                                <span>{category.name}</span>
                            </div>
                        </TableCell>

                        <TableCell className="text-gray-500">
                            {category.id}
                        </TableCell>

                        <TableCell className="text-center">
                            {category.sort_order}
                        </TableCell>
                        <TableCell className="text-center">
                            <Button
                                type="button"
                                onClick={() => onEdit(category)}
                            >
                                수정
                            </Button>
                            <AdminAlertDialog
                                buttonName="삭제"
                                title="삭제하시겠습니까?"
                                description="삭제시 하위 카테고리까지 전부 삭제됩니다."
                                onClick={() => onDelete(category)}
                            />
                        </TableCell>
                    </TableRow>

                    {hasChildren &&
                        isExpanded &&
                        renderRows(children, level + 1)}
                </Fragment>
            );
        });
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead>카테고리명</TableHead>
                        <TableHead>카테고리 ID</TableHead>
                        <TableHead className="w-24 text-center">
                            정렬 순서
                        </TableHead>
                        <TableHead className="text-center">작업</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {categories.length > 0 ? (
                        renderRows(categories)
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="h-24 text-center text-gray-500"
                            >
                                등록된 카테고리가 없습니다.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
