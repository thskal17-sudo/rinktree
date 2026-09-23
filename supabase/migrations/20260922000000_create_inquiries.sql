-- 교육문의 저장 테이블
--
-- 적용 방법 (둘 중 하나)
--   1) Supabase 대시보드 → SQL Editor에 이 파일 내용을 붙여넣고 실행
--   2) supabase CLI: supabase db push
--
-- 접수된 문의는 대시보드 → Table Editor → inquiries 에서 확인합니다.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  organization text,
  phone text not null,
  email text,
  program text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'done'))
);

comment on table public.inquiries is '홈페이지 교육문의 접수 내역';
comment on column public.inquiries.organization is '기관·회사명 (선택)';
comment on column public.inquiries.program is '관심 과정 (선택)';
comment on column public.inquiries.status is 'new: 신규, contacted: 연락함, done: 완료';

-- 최근 문의부터 훑어보는 조회가 대부분이라 created_at 역순 인덱스를 둔다.
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

-- RLS를 켜고 정책을 만들지 않으면 anon/authenticated 키로는 아무것도 못 읽는다.
-- 서버 API 라우트에서 쓰는 service_role 키만 RLS를 우회하므로,
-- 문의 내역이 클라이언트로 새어 나가지 않는다.
alter table public.inquiries enable row level security;
