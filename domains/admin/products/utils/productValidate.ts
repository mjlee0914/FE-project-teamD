export function validateSaveProduct(
    formData: FormData,
): Record<string, string> {
    const errors: Record<string, string> = {};

    const name = formData.get('name');
    const price = formData.get('price');
    const categoryId = formData.get('category_id');

    if (typeof name !== 'string' || !name.trim()) {
        errors.name = '상품명을 입력해주세요.';
    }

    if (typeof price !== 'string' || !price.trim()) {
        errors.price = '가격을 입력해주세요.';
    } else {
        const priceNumber = Number(price);

        if (!Number.isFinite(priceNumber) || priceNumber < 0) {
            errors.price = '올바른 가격을 입력해주세요.';
        }
    }
    if (typeof categoryId !== 'string' || !categoryId.trim()) {
        errors.category_id = '카테고리를 선택해주세요';
    }

    return errors;
}
