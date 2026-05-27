-- memos 테이블 생성
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null,
  tags text[] not null default '{}',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- 브라우저/anon 직접 접근 차단 (서버 액션의 service role만 허용)
alter table public.memos enable row level security;

-- 인덱스
create index if not exists memos_category_idx on public.memos (category);
create index if not exists memos_created_at_idx on public.memos ("createdAt" desc);
