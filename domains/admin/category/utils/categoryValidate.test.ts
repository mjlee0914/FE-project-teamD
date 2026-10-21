import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateCreateCategory } from './categoryValidate';
import { CATEGORY_TYPES } from '../types/category.type';

const valid = { name: '공지사항', parent_id: 'cat-parent', type: 'MAIN' };

function createFormData(values: Record<string, string>): FormData {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
        formData.set(key, value);
    }
    return formData;
}

test('빈 카테고리명은 거부하고 상위 분류 미선택은 허용한다', () => {
    const errors = validateCreateCategory(
        createFormData({
            ...valid,
            name: '  ',
            parent_id: '  ',
        }),
    );
    assert.ok(errors.name);
    assert.equal(errors.parent_id, undefined);
});

test('DB 길이 제한을 적용한다', () => {
    assert.deepEqual(
        validateCreateCategory(
            createFormData({ ...valid, name: '가'.repeat(100) }),
        ),
        {},
    );
    assert.ok(
        validateCreateCategory(
            createFormData({ ...valid, name: '가'.repeat(101) }),
        ).name,
    );
    assert.ok(
        validateCreateCategory(
            createFormData({ ...valid, parent_id: 'x'.repeat(256) }),
        ).parent_id,
    );
});

test('정의하지 않은 카테고리 구분을 거부한다', () => {
    for (const type of ['', 'main', 'ADMIN']) {
        assert.ok(
            validateCreateCategory(createFormData({ ...valid, type })).type,
        );
    }
});

test('셀렉트에 표시하는 모든 구분을 서버 검증에서도 허용한다', () => {
    for (const item of CATEGORY_TYPES) {
        assert.deepEqual(
            validateCreateCategory(
                createFormData({ ...valid, type: item.value }),
            ),
            {},
        );
    }
});

test('누락된 입력과 파일로 전달된 입력을 거부한다', () => {
    const formData = new FormData();
    const missing = validateCreateCategory(formData);
    assert.ok(missing.name);
    assert.equal(missing.parent_id, undefined);
    assert.ok(missing.type);

    formData.set('name', new Blob(['name']), 'name.txt');
    formData.set('parent_id', new Blob(['parent']), 'parent.txt');
    formData.set('type', new Blob(['MAIN']), 'type.txt');
    const files = validateCreateCategory(formData);
    assert.ok(files.name);
    assert.ok(files.parent_id);
    assert.ok(files.type);
});
