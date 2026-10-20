import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateCreateCategory } from './categoryValidate';
import { CATEGORY_TYPES } from '../types/category.type';

const valid = { name: '공지사항', parent_id: 'cat-parent', type: 'MAIN' };

test('카테고리명과 상위 ID의 공백만 있는 입력을 거부한다', () => {
    const errors = validateCreateCategory({
        ...valid,
        name: '  ',
        parent_id: '  ',
    });
    assert.ok(errors.name);
    assert.ok(errors.parent_id);
});

test('DB 길이 제한을 적용한다', () => {
    assert.deepEqual(
        validateCreateCategory({ ...valid, name: '가'.repeat(255) }),
        {},
    );
    assert.ok(
        validateCreateCategory({ ...valid, name: '가'.repeat(256) }).name,
    );
    assert.ok(
        validateCreateCategory({ ...valid, parent_id: 'x'.repeat(256) })
            .parent_id,
    );
});

test('정의하지 않은 카테고리 구분을 거부한다', () => {
    for (const type of ['', 'main', 'ADMIN']) {
        assert.ok(validateCreateCategory({ ...valid, type }).type);
    }
});

test('셀렉트에 표시하는 모든 구분을 서버 검증에서도 허용한다', () => {
    for (const item of CATEGORY_TYPES) {
        assert.deepEqual(
            validateCreateCategory({ ...valid, type: item.value }),
            {},
        );
    }
});
