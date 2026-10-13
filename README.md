# FE-project-teamD 쇼핑몰

쇼핑몰 웹 페이지 **프론트엔드** 팀 프로젝트입니다. (Next.js 16 · React 19 · TypeScript · Tailwind CSS · shadcn/ui)
서버 없이 화면만 만들고, 데이터는 `shared/mocks/mockData.ts`의 목업 데이터를 사용합니다.

```bash
npm install
npm run dev        # http://localhost:3000
```

---

## 이명지 · 메인페이지 / 헤더 / 푸터

- 메인페이지 (이벤트 배너, 인기 상품)
- 헤더, 푸터

```
app/(shop)/
├── layout.tsx                    # 쇼핑몰 공통 레이아웃 (Header + Footer)
└── page.tsx                      # 메인페이지  →  /

domains/home/components/
├── EventBanner.tsx               # 이벤트 배너
└── PopularProducts.tsx           # 인기 상품

shared/components/
├── Header.tsx                    # 헤더
└── Footer.tsx                    # 푸터
```

---

## 정현구 · 상품 리스트

- 좌측 메뉴
- 상품 리스트
- 검색 영역

```
app/(shop)/products/
└── page.tsx                      # 상품 리스트  →  /products

domains/categories/components/
└── CategorySideMenu.tsx          # 좌측 메뉴

domains/products/components/
├── ProductSearchBar.tsx          # 검색 영역
├── ProductGrid.tsx               # 상품 리스트
└── ProductCard.tsx               # 상품 카드 (★ 공통 사용)
```

---

## 배유민 · 상품 상세

- 이미지, 제목, 가격
- 상품 소개 (사이즈)
- 리뷰
- 문의사항

```
app/(shop)/products/[id]/
└── page.tsx                      # 상품 상세  →  /products/1

domains/products/components/
├── ProductDetail.tsx             # 이미지, 제목, 가격
├── ProductDescription.tsx        # 상품 소개 (사이즈)
├── ProductReviews.tsx            # 리뷰
└── ProductInquiries.tsx          # 문의사항
```

---

## 최지훈 · 로그인 / 장바구니

- 상품 목록
- 금액, 배송지, 결제하기 버튼
- 추천 상품

```
app/(shop)/(auth)/login/
└── page.tsx                      # 로그인  →  /login

app/(shop)/cart/
└── page.tsx                      # 장바구니  →  /cart

domains/auth/components/
└── LoginForm.tsx                 # 아이디/비밀번호 입력, 로그인 버튼

domains/cart/components/
├── CartItemList.tsx              # 상품 목록
├── CartSummary.tsx               # 금액, 결제하기 버튼
├── ShippingAddress.tsx           # 배송지
└── RecommendedProducts.tsx       # 추천 상품
```

---

## 이승주 · 게시판

- 공지사항
- 고객센터 (FAQ + Q&A)
- 룩북 등 유저 게시판

```
app/(shop)/board/[id]/            # /board/notice, /board/faq, /board/qna, /board/lookbook
├── page.tsx                      # 글 목록
├── new/page.tsx                  # 글 작성
└── [postId]/
    ├── page.tsx                  # 글 상세
    └── edit/page.tsx             # 글 수정

domains/boards/components/
├── PostList.tsx                  # 글 목록
├── PostDetail.tsx                # 글 상세
├── PostForm.tsx                  # 글 작성/수정
└── FaqList.tsx                   # FAQ
```

---

## 공통 (모두 사용)

```
shared/
├── components/ui/                # 버튼, 인풋, 카드 등 (새로 만들지 말고 이거 사용)
├── mocks/mockData.ts             # 목업 데이터
└── utils/formatPrice.ts          # 금액 표시 (12,000원)
```

---

## 마지막에 합칠 부분

| 합칠 부분                | 누가                    | 내용                                             |
| ------------------------ | ----------------------- | ------------------------------------------------ |
| 헤더 ↔ 로그인/장바구니   | 이명지 + 최지훈         | 헤더에 로그인 버튼, 장바구니 아이콘 연결         |
| 헤더 ↔ 게시판            | 이명지 + 이승주         | 헤더 메뉴에 공지사항, 고객센터 링크 연결         |
| 상품 카드 (`ProductCard`) | 정현구 + 이명지 + 최지훈 | 상품 리스트, 메인 인기 상품, 장바구니 추천 상품에서 같이 사용 |
| 상품 리스트 → 상품 상세  | 정현구 + 배유민         | 상품 카드 클릭 시 `/products/[id]`로 이동        |
| 상품 상세 → 장바구니     | 배유민 + 최지훈         | 장바구니 담기 버튼 → `/cart`에 상품 추가         |
| 목업 데이터              | 전원                    | `shared/mocks/mockData.ts` 한 곳에 모아서 사용   |

---

## 작업 규칙

- 브랜치: `feature/작업명` (예: `feature/login`) → 작업 후 `main`으로 PR
- 커밋: `feat: 장바구니 상품 목록 추가` 처럼 `feat` / `fix` / `style` / `chore` / `docs` 사용
- 빈 `page.tsx`는 실행 에러가 나니 최소한 아래처럼 만들어 두기

```tsx
export default function Page() {
    return null;
}
```
