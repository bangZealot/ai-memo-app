# Utils - AI Agent 지침서

## 모듈 역할

순수 유틸리티 함수 및 헬퍼 집합. 비즈니스 로직과 독립적인 재사용 가능한 기능을 제공한다. 메모 영속화는 Supabase 서버 액션에서 담당한다.

## 의존성 관계

- `@/types/memo` — Memo 타입이 필요한 순수 헬퍼 작성 시 사용

## 유틸리티 목록

| 파일 | 역할 |
| ---- | ---- |

현재 메모 CRUD 유틸리티 파일은 사용하지 않는다. 샘플 데이터는 `supabase/migrations` SQL로 관리한다.

## 데이터 영속화 위치

- CRUD: `src/app/actions/memos.ts`
- Supabase 클라이언트: `src/lib/supabase/server.ts`
- DB 스키마 및 시드: `supabase/migrations/*.sql`

## Implementation Patterns

### 순수 유틸리티 작성

```typescript
export const browserUtil = {
  doSomething: (value: InputType): ReturnType => {
    return transform(value)
  },
}
```

### 새 유틸리티 파일 작성 템플릿

```typescript
// 타입 import
import { SomeType } from '@/types/someType'

// 상수 정의
const STORAGE_KEY = 'app-key'

// 객체 형태로 관련 함수 그룹화
export const utilName = {
  method1: (param: ParamType): ReturnType => {
    // 구현
  },

  method2: (param: ParamType): ReturnType => {
    // 구현
  },
}
```

## Local Golden Rules

### Do's

- 모든 유틸리티는 순수 함수로 작성 (사이드 이펙트 최소화)
- 서버 액션 또는 Supabase 클라이언트 로직은 `utils`에 두지 않음
- 에러 발생 시 적절한 기본값 반환
- JSON 파싱/직렬화 시 try-catch 필수

### Don'ts

- React 훅 사용 금지 (유틸리티는 훅이 아님)
- 전역 상태 변경 금지
- 직접 DOM 조작 금지 (React에 위임)
- 비동기 함수에서 에러 무시 금지

## 데이터 저장소 관리

현재 메모 데이터 저장소:

- Supabase `public.memos` 테이블
- 샘플 데이터는 `supabase/migrations/20260527000002_seed_memos.sql`

## 테스트 고려사항

유틸리티 함수는 단위 테스트하기 용이함:

- 순수 함수는 입력 -> 출력 테스트
- DB 연동은 서버 액션 또는 E2E 테스트에서 검증
