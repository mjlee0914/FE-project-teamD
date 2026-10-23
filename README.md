<a id="readme-top"></a>

<!-- Best-README-Template(https://github.com/othneildrew/Best-README-Template) 구조를 참고해 팀 프로젝트에 맞게 만든 README -->

[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![TypeScript][ts-shield]][ts-url]
[![Tailwind CSS][tailwind-shield]][tailwind-url]
[![Supabase][supabase-shield]][supabase-url]
[![Toss Payments][toss-shield]][toss-url]

<br />
<div align="center">
  <h3 align="center">DN Mall</h3>

  <p align="center">
    Team D(Disco Ninja)의 패션 쇼핑몰 프론트엔드 팀 프로젝트
    <br />
    상품 탐색부터 장바구니·결제, 게시판, 관리자 화면까지 한 흐름으로 만든 풀스택 쇼핑몰
    <br />
    <br />
    <a href="#getting-started">시작하기</a>
    &middot;
    <a href="#usage">화면과 주소</a>
    &middot;
    <a href="#team">팀과 담당</a>
    &middot;
    <a href="domains/boards/README.md">게시판 README</a>
  </p>
</div>

<details>
  <summary>목차</summary>
  <ol>
    <li><a href="#about-the-project">프로젝트 소개</a>
      <ul><li><a href="#built-with">사용 기술</a></li></ul>
    </li>
    <li><a href="#getting-started">시작하기</a>
      <ul>
        <li><a href="#prerequisites">준비물</a></li>
        <li><a href="#installation">설치와 실행</a></li>
        <li><a href="#scripts">명령어</a></li>
        <li><a href="#docker">Docker</a></li>
      </ul>
    </li>
    <li><a href="#usage">화면과 주소</a></li>
    <li><a href="#structure">폴더 구조</a></li>
    <li><a href="#team">팀과 담당</a></li>
    <li><a href="#rules">작업 규칙</a></li>
    <li><a href="#roadmap">배포 전 체크리스트</a></li>
    <li><a href="#acknowledgments">참고</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## 프로젝트 소개

<a id="about-the-project"></a>

DN Mall은 패션 상품을 둘러보고 장바구니에 담아 결제하는 쇼핑몰입니다. 처음에는 목업 데이터로 화면을 만들었고, 지금은 **Supabase(Postgres + 로그인)** 와 **토스페이먼츠 결제**에 연결되어 있습니다.

- **상품**: 메인(이벤트 배너·인기 상품), 카테고리·검색·가격 필터·페이지네이션, 상품 상세(사이즈, 이미지)
- **회원**: 로그인·회원가입, 마이페이지(프로필), 30분 동안 사용이 없으면 자동 로그아웃
- **구매**: 장바구니(추천 상품), 주문서 작성(배송지), 토스 결제 → 주문 완료·실패 화면
- **게시판**: 공지사항·이벤트·FAQ·1:1 문의·상품 리뷰·자유게시판·룩북, 상품 상세의 리뷰·문의 (자세한 설명은 [게시판 README](domains/boards/README.md))
- **관리자**: 카테고리·상품·주문 관리

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

### 사용 기술

<a id="built-with"></a>

- Next.js 16 (App Router, Server Actions, Cache Components), React 19, TypeScript
- Tailwind CSS 4, shadcn/ui, Base UI, lucide-react, react-icons, Swiper
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- 토스페이먼츠 결제위젯 (`@tosspayments/tosspayments-sdk`)
- Zustand(주문서 상태), ESLint, Prettier

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- GETTING STARTED -->

## 시작하기

<a id="getting-started"></a>

### 준비물

<a id="prerequisites"></a>

- Node.js 22 이상, npm
- Supabase 프로젝트 (팀 DB 접속 정보는 팀 안에서 따로 공유)
- 토스페이먼츠 테스트 키 ([공개 테스트 키 안내](https://docs.tosspayments.com/reference/using-api/api-keys))

### 설치와 실행

<a id="installation"></a>

1. 저장소를 받고 패키지를 설치합니다.
    ```sh
    git clone https://github.com/mjlee0914/FE-project-teamD.git
    cd FE-project-teamD
    npm install
    ```
2. `.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다. **`.env.local`은 git에 올리지 않습니다.**
    ```
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
    NEXT_PUBLIC_TOSS_CLIENT_KEY=
    TOSS_SECRET_KEY=            # 서버에서만 사용, 절대 NEXT_PUBLIC_ 을 붙이지 않습니다
    ```
3. 개발 서버를 실행합니다.
    ```sh
    npm run dev      # http://localhost:3000
    ```

### 명령어

<a id="scripts"></a>

| 명령어                                    | 설명                                        |
| ----------------------------------------- | ------------------------------------------- |
| `npm run dev`                             | 개발 서버                                   |
| `npm run build`                           | 운영 빌드 (`prebuild`로 테스트를 먼저 실행) |
| `npm start`                               | 빌드한 앱 실행                              |
| `npm test`                                | 단위 테스트 (`node --import tsx --test`)    |
| `npm run lint`                            | ESLint                                      |
| `npm run format` / `npm run format:check` | Prettier 정리 / 검사                        |
| `npx tsc --noEmit`                        | 타입 검사                                   |

### Docker

<a id="docker"></a>

`Dockerfile`과 `docker-compose.yml`이 있습니다(`.env.local`을 읽어 3000번 포트로 실행).

```sh
docker compose up --build
```

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- USAGE -->

## 화면과 주소

<a id="usage"></a>

| 주소                                                               | 화면                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| `/`                                                                | 메인(배너, 인기 상품, 진행 중 이벤트)                  |
| `/products` · `/products/[id]`                                     | 상품 목록(카테고리·검색) · 상품 상세(리뷰·문의 포함)   |
| `/login` · `/register`                                             | 로그인 · 회원가입                                      |
| `/cart` · `/checkout`                                              | 장바구니 · 주문서                                      |
| `/order/success` · `/order/complete` · `/order/fail`               | 결제 승인 처리 · 주문 완료 · 결제 실패                 |
| `/mypage`                                                          | 마이페이지                                             |
| `/boards/support` · `/boards/community`                            | 고객센터 · 커뮤니티 랜딩                               |
| `/boards/[boardId]`                                                | 공지사항·이벤트·FAQ·1:1 문의·상품 리뷰·자유게시판·룩북 |
| `/admin` · `/admin/products` · `/admin/category` · `/admin/orders` | 관리자 (관리자 계정만)                                 |

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- STRUCTURE -->

## 폴더 구조

<a id="structure"></a>

기능 단위는 `domains/`, 여러 곳에서 쓰는 것은 `shared/`, URL은 `app/`이 맡습니다.

```
app/
├── (shop)/                  # 쇼핑몰 레이아웃(헤더·푸터) 아래 모든 화면
│   ├── page.tsx             # 메인
│   ├── (auth)/              # login · register
│   ├── products/            # 상품 목록 · [id] 상세
│   ├── cart/ · checkout/ · order/   # 장바구니 · 주문서 · 결제 결과
│   ├── mypage/
│   └── boards/              # 게시판 (support · community · [boardId])
└── admin/                   # 관리자 (products · category · orders)

domains/                     # 기능별 코드 (actions · components · queries · types …)
├── home/ · products/ · categories/
├── auth/ · cart/ · orders/
├── boards/                  # 게시판 (README 참고)
├── admin/ · files/

shared/                      # 헤더·푸터, 공용 UI, 공용 타입·유틸
lib/supabase.ts              # Supabase 클라이언트(브라우저·서버)
components/                  # shadcn/ui 컴포넌트
public/                      # 이미지(이벤트 배너 등)
```

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- TEAM -->

## 팀과 담당

<a id="team"></a>

| 이름          | 주요 담당                                                                      |
| ------------- | ------------------------------------------------------------------------------ |
| 정현구 (팀장) | 관리자(카테고리·상품·주문), 헤더 카테고리·관리자 버튼, 파일·카테고리 구조      |
| 이명지        | 메인(이벤트 배너·인기 상품), 헤더·푸터 레이아웃, 주문서(체크아웃) 화면         |
| 배유민        | 상품 상세, 상품 검색·가격 필터·페이지네이션, 카테고리·상품 이미지 연동         |
| 최지훈        | 로그인·회원가입, 장바구니·추천 상품, 토스 결제 연결, 마이페이지, 자동 로그아웃 |
| 이승주        | 게시판(공지·이벤트·FAQ·문의·리뷰·자유·룩북), 상품 상세의 리뷰·문의             |

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- RULES -->

## 작업 규칙

<a id="rules"></a>

- **브랜치**: `feature/작업명`(예: `feature/lsj-board-product`) → 작업 후 `main`으로 PR
- **커밋**: `feat: 장바구니 상품 목록 추가`처럼 `feat` / `fix` / `refactor` / `style` / `chore` / `docs` 중 하나로 시작
- **보안**: `.env*`와 키 값은 올리지 않고, 서버 전용 키에는 `NEXT_PUBLIC_`을 붙이지 않습니다.
- **서버 액션**: 폼이 보낸 값을 믿지 않고 서버에서 다시 조회·검증하며, `redirect()`는 `try/catch` 밖에서 호출합니다.
- **다른 사람 파일**을 고칠 때는 PR 설명에 이유를 적습니다.

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[nextjs-shield]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[nextjs-url]: https://nextjs.org/
[react-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev/
[ts-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[ts-url]: https://www.typescriptlang.org/
[tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[supabase-shield]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[supabase-url]: https://supabase.com/
[toss-shield]: https://img.shields.io/badge/Toss_Payments-0064FF?style=for-the-badge&logoColor=white
[toss-url]: https://docs.tosspayments.com/
