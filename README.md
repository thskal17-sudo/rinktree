# 한국엑스퍼트교육원 링크허브

회사소개 · 교육프로그램소개 · 교육문의 · 강사잇다 네 개의 링크와 교육문의 폼으로 이루어진
링크허브 사이트입니다. 문의 폼은 `mailto:` 링크가 아니라 서버로 직접 제출되며,
서버가 **DB 저장과 알림 메일 발송을 함께** 처리합니다.

## 기술 스택

| 영역       | 선택                                 | 비고                                          |
| ---------- | ------------------------------------ | --------------------------------------------- |
| 프레임워크 | Next.js 16 (App Router) + TypeScript | 정적 페이지와 문의 수신 API를 한 프로젝트에서 |
| 스타일링   | Tailwind CSS v4                      | 색상 토큰을 CSS 변수로 관리                   |
| 호스팅     | Vercel                               | main 브랜치 푸시마다 자동 배포                |
| 메일 발송  | Resend                               | 문의 접수 알림                                |
| 문의 저장  | Supabase (Postgres)                  | 메일을 놓쳐도 문의가 남도록 DB에 적재         |

> Tailwind는 v4부터 `tailwind.config.ts` 대신 CSS에서 토큰을 정의합니다.
> 색상·폰트·반경 토큰은 모두 [`styles/globals.css`](styles/globals.css)에 있습니다.

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값은 아래 「환경변수」 참고
npm run dev                  # http://localhost:3000
```

환경변수를 채우지 않아도 화면은 모두 동작합니다. 개발 모드에서는 문의를 제출하면
저장·발송 대신 터미널에 내용이 출력됩니다.

| 명령                | 설명           |
| ------------------- | -------------- |
| `npm run dev`       | 개발 서버      |
| `npm run build`     | 프로덕션 빌드  |
| `npm run start`     | 빌드 결과 실행 |
| `npm run lint`      | ESLint         |
| `npm run typecheck` | 타입 검사      |
| `npm run format`    | Prettier 포맷  |

## 문구 · 콘텐츠 수정

코드를 건드리지 않고 아래 두 파일만 고치면 사이트 전체에 반영됩니다.
교체가 필요한 예시값에는 `TODO` 주석을 달아 두었습니다.

- [`content/site.ts`](content/site.ts) — 기관명, 태그라인, 통계 3개, 링크 카드 4개, 연락처(이메일·카카오·인스타)
- [`content/pages.ts`](content/pages.ts) — 회사소개(철학·연혁·강사진), 교육프로그램(분야별 과정), 강사잇다(모집 분야·자격요건·지원 방법)

교육문의 폼의 「관심 과정」 선택지는 `content/pages.ts`의 과정 분야에서 자동으로 만들어지므로
따로 관리할 필요가 없습니다.

## 문의 폼 데이터 흐름

```
이용자 입력 → 클라이언트 검증 → POST /api/inquiry → 서버 검증 + honeypot 확인
                                                      ├─ Supabase inquiries 테이블 INSERT
                                                      └─ Resend 알림 메일 발송
```

검증 규칙(`lib/validation.ts`)은 클라이언트와 서버가 같은 함수를 씁니다.
이름·연락처·문의내용은 필수, 이메일은 입력했을 때만 형식을 검사하고,
연락처는 숫자와 하이픈만 허용합니다. 사람에게 보이지 않는 honeypot 입력칸이 채워져 있으면
오류를 돌려주지 않고 조용히 버립니다.

**실패 처리**

| 상황                       | 사용자에게                              | 서버에서           |
| -------------------------- | --------------------------------------- | ------------------ |
| DB 저장 성공, 메일 실패    | 접수 완료                               | 오류 로그만 남김   |
| DB 저장 실패               | 오류 + 재시도 안내(직접 메일 주소 포함) | 오류 로그          |
| DB 미설정, 메일 발송 성공  | 접수 완료                               | —                  |
| 저장·발송 수단이 모두 없음 | 오류(운영) / 접수 완료(개발)            | 환경변수 확인 경고 |

## 환경변수

| 변수명                      | 용도                                                           | 필수 |
| --------------------------- | -------------------------------------------------------------- | ---- |
| `RESEND_API_KEY`            | 문의 접수 알림 메일 발송                                       | 권장 |
| `INQUIRY_TO_EMAIL`          | 알림 수신 주소 (기본값: `content/site.ts`의 기관 이메일)       | 선택 |
| `INQUIRY_FROM_EMAIL`        | 발신 주소 (Resend 인증 도메인, 기본값 `onboarding@resend.dev`) | 선택 |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase 프로젝트 URL                                          | 권장 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 키. 클라이언트 번들 노출 금지                        | 권장 |
| `NEXT_PUBLIC_SITE_URL`      | 배포 도메인 (og·canonical 절대 URL용)                          | 선택 |

Resend와 Supabase 중 하나만 설정해도 동작합니다. 문의량이 적은 1단계에서는
메일 발송만 켜고, 나중에 Supabase를 붙이는 순서로 가도 됩니다.

## Supabase 설정

1. [supabase.com](https://supabase.com)에서 프로젝트를 만듭니다(무료 플랜으로 충분합니다).
2. 대시보드 → **SQL Editor**에 [`supabase/migrations/20260922000000_create_inquiries.sql`](supabase/migrations/20260922000000_create_inquiries.sql) 내용을 붙여넣고 실행합니다.
   (`supabase` CLI를 쓴다면 `supabase db push`)
3. **Settings → API**에서 `Project URL`과 `service_role` 키를 복사해 환경변수에 넣습니다.
4. 접수된 문의는 **Table Editor → inquiries**에서 확인하고, `status`를
   `new` → `contacted` → `done`으로 바꿔 가며 관리합니다.

테이블에는 RLS가 켜져 있고 정책이 없습니다. 즉 `anon` 키로는 아무것도 읽을 수 없고,
서버에서 쓰는 `service_role` 키만 접근할 수 있습니다.

## Resend 설정

1. [resend.com](https://resend.com) 가입 → **API Keys**에서 키 발급 → `RESEND_API_KEY`에 등록.
2. 도메인이 있다면 **Domains**에서 도메인을 추가하고 안내된 DNS 레코드를 등록한 뒤,
   `INQUIRY_FROM_EMAIL`을 그 도메인 주소(예: `noreply@kexpertedu.co.kr`)로 지정합니다.
3. 도메인 인증 전에는 `onboarding@resend.dev`로 테스트할 수 있습니다.
   단 이때는 **Resend 계정에 등록된 본인 주소로만** 메일이 갑니다.

알림 메일의 회신 주소는 문의자가 남긴 이메일로 지정되므로, 받은 편지함에서 바로 답장하면 됩니다.

## 배포 (Vercel)

1. 이 저장소를 GitHub에 올립니다.
2. [vercel.com](https://vercel.com) → **Add New… → Project** → 저장소 선택.
   Next.js는 자동 인식되므로 빌드 설정은 그대로 두면 됩니다.
3. **Environment Variables**에 위 표의 값을 등록합니다(Production·Preview 모두).
4. **Deploy**. 이후 main 브랜치에 푸시할 때마다 자동 배포됩니다.
5. 도메인이 있다면 **Settings → Domains**에서 연결하고, 도메인 등록업체에서
   안내하는 CNAME/A 레코드를 추가합니다. 연결 후 `NEXT_PUBLIC_SITE_URL`도 같이 바꿔 주세요.

> 환경변수를 바꾼 뒤에는 재배포해야 반영됩니다.

## 프로젝트 구조

```
app/
├─ layout.tsx              # 공통 레이아웃, 폰트·테마 설정
├─ page.tsx                # 홈허브 (링크 카드 4개)
├─ about/page.tsx          # 회사소개
├─ programs/page.tsx       # 교육프로그램소개
├─ inquiry/
│  ├─ page.tsx             # 교육문의 (서버 컴포넌트)
│  └─ InquiryForm.tsx      # 문의 폼 ('use client')
├─ recruit/page.tsx        # 강사잇다
└─ api/inquiry/route.ts    # 문의 수신 API (POST)
components/                # LinkCard · StatTile · ContactChip · FormField 등
content/                   # 교체 대상 문구 (site.ts, pages.ts)
lib/                       # supabase.ts · mailer.ts · validation.ts
styles/globals.css         # 색상 토큰 · 폰트 · 기본 스타일
supabase/migrations/       # inquiries 테이블 마이그레이션
```

페이지는 모두 서버 컴포넌트이고, 상태가 필요한 문의 폼과 테마 토글만 클라이언트 컴포넌트입니다.

## 범위 밖 (추후 확장)

관리자 로그인과 문의 관리 화면, 과정별 상세 페이지, 결제는 이번 범위에 포함하지 않았습니다.
당장은 Supabase 대시보드에서 문의를 확인하는 방식으로 운영합니다.
