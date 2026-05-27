# 📝 메모 앱 (Memo App)

**핸즈온 실습용 Next.js 메모 애플리케이션**

Supabase 기반의 완전한 CRUD 기능과 AI 요약 기능을 갖춘 메모 앱으로, MCP 연동 및 GitHub PR 생성 실습의 기반이 되는 프로젝트입니다.

## 🚀 주요 기능

- ✅ 메모 생성, 읽기, 수정, 삭제 (CRUD)
- 📂 카테고리별 메모 분류 (개인, 업무, 학습, 아이디어, 기타)
- 🏷️ 태그 시스템으로 메모 태깅
- 🔍 제목, 내용, 태그 기반 실시간 검색
- 📱 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 💾 Supabase Postgres 기반 데이터 저장
- 🤖 Gemini API 기반 메모 요약
- 🎨 모던한 UI/UX with Tailwind CSS

## 🛠 기술 스택

- **Framework**: Next.js 15.4.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Storage**: Supabase Postgres
- **Database Client**: @supabase/supabase-js
- **AI Summary**: Google Gemini API
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Package Manager**: npm

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
copy env.example .env.local
```

`.env.local`에 다음 값을 설정합니다:

```env
SUPABASE_URL=https://achzxlmwnhyswtvuonhz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 액션에서만 사용되는 비공개 키입니다. 브라우저 코드에 노출하지 마세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 브라우저 접속

```
http://localhost:3000
```

## 📁 프로젝트 구조

```
memo-app/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── memos.ts         # Supabase CRUD 서버 액션
│   │   │   └── summarize.ts     # Gemini 요약 서버 액션
│   │   ├── globals.css          # 글로벌 스타일
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   └── page.tsx             # 메인 페이지
│   ├── components/
│   │   ├── MemoForm.tsx         # 메모 생성/편집 폼
│   │   ├── MemoItem.tsx         # 개별 메모 카드
│   │   ├── MemoList.tsx         # 메모 목록 및 필터
│   │   └── MemoViewer.tsx       # 메모 상세 보기 및 요약
│   ├── hooks/
│   │   ├── useMemos.ts          # 메모 관리 커스텀 훅
│   │   └── useSummarize.ts      # 요약 요청 커스텀 훅
│   ├── lib/
│   │   └── supabase/            # Supabase 서버 클라이언트 및 DB 타입
│   ├── types/
│   │   └── memo.ts              # 메모 타입 정의
├── supabase/
│   └── migrations/              # 테이블 생성 및 샘플 데이터 SQL
├── env.example                  # 환경변수 템플릿
└── README.md                    # 프로젝트 문서
```

## 💡 주요 컴포넌트

### MemoItem

- 개별 메모를 카드 형태로 표시
- 편집/삭제 액션 버튼
- 카테고리 배지 및 태그 표시
- 날짜 포맷팅 및 텍스트 클램핑

### MemoForm

- 메모 생성/편집을 위한 모달 폼
- 제목, 내용, 카테고리, 태그 입력
- 태그 추가/제거 기능
- 폼 검증 및 에러 처리

### MemoList

- 메모 목록 그리드 표시
- 실시간 검색 및 카테고리 필터링
- 통계 정보 및 빈 상태 처리
- 반응형 그리드 레이아웃

## 📊 데이터 구조

```typescript
interface Memo {
  id: string // 고유 식별자
  title: string // 메모 제목
  content: string // 메모 내용
  category: string // 카테고리 (personal, work, study, idea, other)
  tags: string[] // 태그 배열
  createdAt: string // 생성 날짜 (ISO string)
  updatedAt: string // 수정 날짜 (ISO string)
}
```

## 🎯 실습 시나리오

이 프로젝트는 다음 3가지 실습의 기반으로 사용됩니다:

### 실습 1: Supabase MCP 마이그레이션 (45분)

- Supabase 데이터베이스 스키마 생성
- MCP를 통한 자동 스키마 생성
- 서버 액션 기반 CRUD 연동

### 실습 2: 기능 확장 + GitHub PR (60분)

- 메모 즐겨찾기 기능 추가
- Cursor Custom Modes로 PR 생성
- 코드 리뷰 및 협업 실습

### 실습 3: Playwright MCP 테스트 (45분)

- E2E 테스트 작성
- 브라우저 자동화 및 시각적 테스트
- 성능 측정 및 리포트

자세한 실습 가이드는 강의자료를 참고하세요.

## 🎨 샘플 데이터

Supabase 마이그레이션 시 6개의 샘플 메모가 생성됩니다:

- 프로젝트 회의 준비 (업무)
- React 18 새로운 기능 학습 (학습)
- 새로운 앱 아이디어: 습관 트래커 (아이디어)
- 주말 여행 계획 (개인)
- 독서 목록 (개인)
- 성능 최적화 아이디어 (아이디어)

## 🔧 개발 가이드

### 메모 CRUD 작업

```typescript
// useMemos 훅 사용 예시
const {
  memos, // 필터링된 메모 목록
  loading, // 로딩 상태
  createMemo, // 메모 생성
  updateMemo, // 메모 수정
  deleteMemo, // 메모 삭제
  searchMemos, // 검색
  filterByCategory, // 카테고리 필터링
  stats, // 통계 정보
} = useMemos()
```

### 서버 액션 데이터 연동

```typescript
import { listMemos, createMemo } from '@/app/actions/memos'

// 모든 메모 가져오기
const { data: memos } = await listMemos()

// 메모 추가
await createMemo({
  title: '새 메모',
  content: '내용',
  category: 'personal',
  tags: ['태그'],
})
```

## 🚀 배포

### Vercel 배포

```bash
npm run build
npx vercel --prod
```

### Netlify 배포

```bash
npm run build
# dist 폴더를 Netlify에 드래그 앤 드롭
```

## 📄 라이선스

MIT License - 학습 및 실습 목적으로 자유롭게 사용 가능합니다.

## 🤝 기여

이 프로젝트는 교육용으로 제작되었습니다. 개선사항이나 버그 리포트는 이슈나 PR로 제출해 주세요.

---

**Made with ❤️ for hands-on workshop**
