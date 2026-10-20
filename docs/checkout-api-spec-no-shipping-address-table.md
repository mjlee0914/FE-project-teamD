# 체크아웃 API 및 흐름 (배송지 테이블 없이)

## 설계 결정

- 별도의 `shipping_addresses` 테이블은 추가하지 않습니다.
- 체크아웃에서 입력한 수령인과 배송 정보를 주문 생성 시 `orders` 행에 저장합니다. 이 값은 주문 당시 배송 정보 스냅샷입니다.
- 체크아웃을 다시 열 때 주소를 미리 채우고 싶다면 사용자의 가장 최근 주문에서 배송 정보를 읽습니다. 아직 주문이 없으면 입력란을 비워 둡니다.
- 체크아웃에서 주소를 수정해도 이전 주문 행은 수정하지 않습니다. 새 주소는 새 주문을 생성할 때 저장합니다.
- 배송 정보를 `orders`에 저장하려면 `recipient`, `recipient_phone`, `zipcode`, `address`, `address_detail`, `delivery_memo` 컬럼이 있어야 합니다. 구현 전에 ERD와 실제 DB 컬럼을 확인합니다.
- ERD에 `payments.status`가 없다면 토스 결제 상태 저장을 위해 추가할지 팀에서 확인합니다. 예: `DONE`, `CANCELED`, `WAITING_FOR_DEPOSIT`.

## 기능 및 흐름

| 기능 | 설명 | 호출 방식 | 파일 위치 | 함수명 |
| --- | --- | --- | --- | --- |
| 최근 주문 배송지 조회 (선택) | 가장 최근 주문의 배송 정보를 체크아웃 입력란에 미리 표시 | 서버 함수(조회) | `domains/orders/actions.ts` | `getLatestOrderShippingAddress()` |
| 주문 생성 | 장바구니와 체크아웃 입력 정보를 검증하고 주문 당시 배송 정보 및 상품 정보를 저장 | Server Action | `domains/orders/actions.ts` | `createOrder(input)` |
| 결제 승인 및 결제 정보 저장 | 토스 결제 결과를 확인하고 결제 정보와 주문 상태 변경 이력을 저장 | Server Action | `domains/payments/actions.ts` | `confirmPayment(input)` |
| 주문 완료 정보 조회 | 결제 완료 페이지에 주문·배송·상품·결제 정보를 표시 | 서버 함수 | `domains/orders/actions.ts` | `getOrderDetail(orderId)` |

1. (선택) 체크아웃을 열 때 최근 주문 배송 정보를 불러옵니다. 첫 주문이면 입력란은 비어 있습니다.
2. 사용자가 배송 정보를 입력하거나 수정합니다. 이 시점에는 별도 배송지 테이블에 저장하지 않습니다.
3. 결제 전에 주문을 생성합니다. 서버가 장바구니와 상품 가격을 확인하고 배송 정보를 `orders`에, 상품 스냅샷을 `order_items`에 저장합니다.
4. 응답받은 주문 ID와 금액으로 토스 SDK를 실행합니다.
5. 결제 성공 후 `paymentKey`, `orderId`, `amount`를 서버에 전달합니다. 서버가 주문 금액을 확인하고 토스 승인을 요청한 뒤 결제·주문·로그를 갱신합니다.
6. 주문 완료 페이지는 `getOrderDetail()`로 저장된 주문 정보를 불러옵니다.

`getLatestOrderShippingAddress()` (선택) → `createOrder(input)` → 토스 SDK → `confirmPayment(input)` → `getOrderDetail(orderId)`

> 이 방식은 마지막 주문 주소를 다음 체크아웃에 미리 보여줄 수 있지만, 주문과 별개로 배송지를 저장하거나 수정하는 기능은 제공하지 않습니다. 체크아웃에서 바꾼 주소는 새 주문이 생성될 때만 저장됩니다.

---

## 1. 주문 생성

### 기본 정보

| 항목 | 내용 |
| --- | --- |
| 기능 설명 | 로그인 사용자의 장바구니로 주문과 주문 당시 상품·배송 정보를 저장하고 결제에 사용할 주문번호와 금액 반환 |
| HTTP API 예시 | `POST /api/orders` |
| 호출 시점 | 체크아웃에서 결제하기를 눌렀을 때. 토스 결제창을 열기 전에 호출 |
| Supabase 테이블 | `orders`, `order_items`, `order_logs`, `cart_items`, `products` |
| 처리 방식 | 생성 |
| 접근 권한 | 로그인 사용자 |

### 요청 데이터

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `recipient` | string | 필수 | 받는 사람 |
| `recipient_phone` | string | 필수 | 받는 사람 연락처. 화면의 `phone` 값을 매핑 |
| `zipcode` | string | 필수 | 우편번호 5자리 |
| `address` | string | 필수 | 기본 배송 주소 |
| `address_detail` | string 또는 null | 선택 | 상세 주소 |
| `delivery_memo` | string 또는 null | 선택 | 해당 주문의 배송 요청사항 |
| `paymentAgreed` | boolean | 필수 | 구매조건 확인 및 결제 진행 동의 여부 |

### 응답 데이터

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `order.id` | UUID | 생성된 주문 ID. 토스 결제 요청의 `orderId`로 사용 |
| `order.status` | string | 초기 주문 상태. 예: 결제 대기 |
| `order.recipient` | string | 주문 당시 받는 사람 |
| `order.recipient_phone` | string | 주문 당시 받는 사람 연락처 |
| `order.zipcode` | string | 주문 당시 우편번호 |
| `order.address` | string | 주문 당시 기본 배송 주소 |
| `order.address_detail` | string 또는 null | 주문 당시 상세 주소 |
| `order.delivery_memo` | string 또는 null | 주문 당시 배송 요청사항 |
| `order.total_price` | integer | 상품 금액 합계 |
| `order.discount_price` | integer | 할인 금액 |
| `order.shipping_fee` | integer | 배송비 |
| `order.final_price` | integer | 최종 결제 금액 |
| `order.created_at` | timestamp string | 주문 생성 시각 |
| `items` | array | 주문 당시 상품 정보 |
| `items[].product_id` | UUID | 상품 ID |
| `items[].product_name` | string | 주문 당시 상품명 |
| `items[].product_price` | integer | 주문 당시 상품 단가 |
| `items[].quantity` | integer | 주문 수량 |
| `items[].option` | string 또는 null | 선택 옵션 |
| `payment_request.order_name` | string | 토스 결제 요청에 사용할 주문명 |
| `payment_request.amount` | integer | 토스 결제 요청에 사용할 금액 |

### 처리 규칙

- `user_id`는 로그인 세션에서 가져옵니다.
- 장바구니 상품과 가격을 서버에서 확인하고 금액을 계산합니다. 클라이언트에서 보낸 금액은 주문 금액으로 사용하지 않습니다.
- 체크아웃에서 받은 배송 정보를 `orders`에 저장합니다. 이후 주소 변경이 과거 주문 정보에 영향을 주지 않도록 기존 주문을 수정하지 않습니다.
- `orders`, `order_items`, 최초 `order_logs`를 함께 저장합니다. 주문·상품·최초 로그 저장은 RPC 등 트랜잭션 방식으로 처리합니다.
- 최초 로그의 `prev_status`는 `null`로 기록합니다.
- 주문 상태는 결제 대기 상태로 시작합니다. 실제 상태 문자열은 ERD에 정의된 값과 맞춥니다.
- 응답의 `order.id`와 `order.final_price`를 사용해 프론트엔드가 토스 결제 SDK를 실행합니다.

---

## 2. 최근 주문 배송지 조회 (선택)

### 기본 정보

| 항목 | 내용 |
| --- | --- |
| 기능 설명 | 로그인 사용자의 가장 최근 주문에 저장된 배송 정보를 체크아웃 입력란에 미리 표시 |
| HTTP API 예시 | `GET /api/orders/latest` |
| 호출 시점 | 체크아웃 화면을 열 때. 주소 자동 입력을 제공할 경우에만 사용 |
| Supabase 테이블 | `orders` |
| 처리 방식 | 조회 |
| 접근 권한 | 로그인 사용자 본인 주문 |

### 요청 데이터

없음. 사용자 ID는 로그인 세션에서 확인합니다.

### 응답 데이터

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `shipping_address` | object 또는 null | 가장 최근 주문의 배송 정보. 주문 내역이 없으면 `null` |
| `shipping_address.recipient` | string | 받는 사람 |
| `shipping_address.recipient_phone` | string | 받는 사람 연락처 |
| `shipping_address.zipcode` | string | 우편번호 |
| `shipping_address.address` | string | 기본 배송 주소 |
| `shipping_address.address_detail` | string 또는 null | 상세 주소 |
| `shipping_address.delivery_memo` | string 또는 null | 가장 최근 주문의 배송 요청사항 |

### 처리 규칙

- 사용자 ID는 요청 본문으로 받지 않고 로그인 세션에서 가져옵니다.
- 해당 사용자의 `orders` 중 `created_at`이 가장 최근인 주문 한 건만 조회합니다.
- 주문 내역이 없으면 `shipping_address: null`을 반환하고 체크아웃 입력란을 비워 둡니다.
- 사용자가 체크아웃에서 주소를 바꿔도 이 조회 대상 주문은 수정하지 않습니다. 변경된 배송 정보는 새 주문 생성 시 저장합니다.

---

## 3. 결제 승인 및 결제 정보 저장

### 기본 정보

| 항목 | 내용 |
| --- | --- |
| 기능 설명 | 토스 결제 인증 결과를 확인하고, 서버에서 결제를 승인한 뒤 결제 정보와 주문 상태를 저장 |
| HTTP API 예시 | `POST /api/payments/confirm` |
| 호출 시점 | 토스가 결제 인증 성공 URL로 돌려보낸 뒤 |
| Supabase 테이블 | `payments`, `orders`, `order_logs` |
| 처리 방식 | 생성 및 수정 |
| 접근 권한 | 로그인 사용자 본인 주문 |

### 요청 데이터

| 필드 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `paymentKey` | string | 필수 | 토스가 발급한 결제 식별값 |
| `orderId` | UUID 또는 string | 필수 | 주문 생성 API에서 받은 주문 ID |
| `amount` | integer | 필수 | 토스 성공 URL에서 받은 결제 금액. 서버가 저장된 주문 금액과 비교 |

### 응답 데이터

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `order.id` | UUID | 주문 ID |
| `order.status` | string | 결제 승인 후 주문 상태 |
| `payment.payment_key` | string | 토스 결제 식별값 |
| `payment.status` | string | 토스 결제 상태 |
| `payment.payment_method` | string | 결제 수단 |
| `payment.amount` | integer | 승인된 금액 |
| `payment.approved_at` | timestamp string 또는 null | 승인 시각 |

### 처리 규칙

- 서버는 로그인 사용자가 해당 주문의 소유자인지 확인합니다.
- 서버는 성공 URL에서 받은 `amount`와 `orders.final_price`가 같은지 확인합니다.
- 금액이 일치하면 서버가 토스 결제 승인 API를 호출합니다. 토스 시크릿 키는 서버에서만 사용합니다.
- 결제 승인에 성공한 뒤 `payments`에 토스 응답을 저장하고, `orders.status`를 갱신하며, `order_logs`에 상태 변경을 기록합니다.
- `payments.status`에는 토스 응답의 결제 상태를 저장합니다. 예: `DONE`, `WAITING_FOR_DEPOSIT`, `CANCELED`. 사용할 값은 토스 Payment 응답과 팀의 ERD를 확인합니다.
- 결제 승인에 실패하면 성공 응답으로 처리하지 않습니다. 실패 결과도 DB에 기록하려면 별도의 실패 기록 API를 추가합니다.

---

## 4. 주문 완료 정보 조회

### 기본 정보

| 항목 | 내용 |
| --- | --- |
| 기능 설명 | 결제 완료 페이지에 주문·배송·상품·결제 정보를 표시 |
| HTTP API 예시 | `GET /api/orders/{order_id}` |
| 호출 시점 | 결제 승인 성공 후 주문 완료 페이지를 열 때 |
| Supabase 테이블 | `orders`, `order_items`, `payments` |
| 처리 방식 | 조회 |
| 접근 권한 | 로그인 사용자 본인 주문 |

### 요청 데이터

| 항목 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `order_id` | UUID | 필수 | 조회할 주문 ID. URL 경로에 포함 |

### 응답 데이터

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `order.id` | UUID | 주문 ID |
| `order.status` | string | 현재 주문 상태 |
| `order.recipient` | string | 주문 당시 받는 사람 |
| `order.recipient_phone` | string | 주문 당시 받는 사람 연락처 |
| `order.zipcode` | string | 주문 당시 우편번호 |
| `order.address` | string | 주문 당시 기본 배송 주소 |
| `order.address_detail` | string 또는 null | 주문 당시 상세 주소 |
| `order.delivery_memo` | string 또는 null | 주문 당시 배송 요청사항 |
| `order.total_price` | integer | 상품 금액 합계 |
| `order.discount_price` | integer | 할인 금액 |
| `order.shipping_fee` | integer | 배송비 |
| `order.final_price` | integer | 최종 결제 금액 |
| `order.created_at` | timestamp string | 주문 생성 시각 |
| `items` | array | 주문 당시 상품 정보 |
| `payment.status` | string | 결제 상태 |
| `payment.payment_method` | string | 결제 수단 |
| `payment.approved_at` | timestamp string 또는 null | 승인 시각 |

### 처리 규칙

- 요청한 주문이 로그인 사용자 본인의 주문인지 확인합니다.
- 주문과 주문 상품을 조회하고, 결제 정보가 있으면 함께 반환합니다.
- 주문 완료 페이지를 새로고침해도 같은 주문 정보를 다시 불러올 수 있습니다.

---

## 실제 진행 순서

1. (선택) 체크아웃 화면을 열 때 `GET /api/orders/latest`로 가장 최근 주문의 배송 정보를 불러옵니다. 주문 내역이 없으면 입력란을 비워 둡니다.
2. 사용자가 배송 정보를 입력하거나 수정합니다. 별도 저장 API는 호출하지 않습니다.
3. 사용자가 결제하기를 누르면 `POST /api/orders`로 주문을 먼저 저장합니다. 배송 정보는 새 주문의 `orders` 행에 저장됩니다.
4. 화면은 응답으로 받은 주문번호와 금액으로 토스 SDK를 실행합니다.
5. 토스 결제 인증에 성공하면 성공 URL의 `paymentKey`, `orderId`, `amount`를 `POST /api/payments/confirm`으로 전달합니다.
6. 서버가 주문 금액을 확인하고 토스에 승인 요청을 보냅니다. 승인 성공 시 결제 정보·주문 상태·주문 로그를 저장합니다.
7. 결제 완료 페이지에서 `GET /api/orders/{order_id}`를 호출해 저장된 주문 정보를 표시합니다.
8. 결제 인증에 실패하면 토스 실패 URL에서 오류 내용을 보여줍니다. 실패 기록을 DB에 남길 때만 별도의 실패 기록 API를 추가합니다.
