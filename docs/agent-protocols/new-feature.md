# 프로토콜: 새 기능 추가

> 에이전트가 새 도메인 기능을 추가할 때 순서대로 실행하는 프로토콜입니다.
> 각 단계는 독립적으로 검증 가능합니다.

---

## 입력 (인간이 정의하는 의도)

```
도메인명: <예: "users">
기능 설명: <예: "사용자 목록을 API에서 가져와 카드 형태로 표시">
API 엔드포인트: <예: "GET /users">
```

---

## 실행 단계

### STEP 1 — 타입 정의 규칙 확인 (AGENTS.md API 계약 규칙 우선 적용)

**1-1.** `api-contract/generated/api-types.ts`에 필요한 타입이 존재하는지 확인

- 존재하는 경우 : `api-types.ts`에서 import하여 사용 (수동 타입 작성 금지)
- 존재하지 않는 경우 : 아래 1-2 진행

**1-2.** `api-contract/generated/api-types.ts`에 타입이 없는 경우

- BE Contract 파일 확인 후 BE 팀에 타입 추가 요청
- BE 확인 전까지 작업을 중단하고 보고

**1-3.** API와 무관한 UI 전용 타입인 경우에만

- `src/types/index.ts`에 타입 추가 허용
- 단, 해당 타입이 UI 전용임을 주석으로 명시

```typescript
// UI-only type: not derived from API contract
interface DropdownOption {
  label: string;
  value: string;
}
```

검증: `npx tsc --noEmit` → 0 오류

---

### STEP 2 — 서비스 생성 (`src/services/<domain>.ts`)

```typescript
import { apiClient } from './api';
import type { <DomainName> } from '@/types';

export const <domain>Service = {
  getAll(): Promise<<DomainName>[]> {
    return apiClient.get<<DomainName>[]>('/<domain>');
  },
  getById(id: number): Promise<<DomainName>> {
    return apiClient.get<<DomainName>>(`/<domain>/${id}`);
  },
};
```

검증: `npx tsc --noEmit` → 0 오류

---

### STEP 3 — 카드 컴포넌트 (`src/features/<domain>/<DomainName>Card.tsx`)

```typescript
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { <DomainName> } from '@/types';

interface <DomainName>CardProps {
  item: <DomainName>;
}

export function <DomainName>Card({ item }: <DomainName>CardProps) {
  return (
    <Card>
      <CardHeader>...</CardHeader>
      <CardBody>...</CardBody>
    </Card>
  );
}
```

금지: `services/` import 없음 — 데이터는 props로만 수신

검증: `npm run lint` → 0 오류

---

### STEP 4 — 리스트 컴포넌트 (`src/features/<domain>/<DomainName>List.tsx`)

```typescript
'use client';

import { useFetch } from '@/hooks/useFetch';
import { <domain>Service } from '@/services/<domain>';
import { <DomainName>Card } from './<DomainName>Card';

export function <DomainName>List() {
  const { data, isLoading, error } = useFetch(() => <domain>Service.getAll());

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  // ...
}
```

---

### STEP 5 — 페이지 연결 (`src/app/<route>/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { <DomainName>List } from '@/features/<domain>/<DomainName>List';

export const metadata: Metadata = { title: '<도메인명>' };

export default function <DomainName>Page() {
  return (
    <div className="container-page py-12">
      <h1>...</h1>
      <<DomainName>List />
    </div>
  );
}
```

금지: 이 파일에서 `services/` import 없음

---

### STEP 6 — 최종 검증 시퀀스

```bash
npx tsc --noEmit   # 타입 오류 0
npm run lint       # ESLint 오류 0
npm run format     # 포맷 적용
npm run build      # 빌드 성공
```

모두 통과 → PR 생성 가능
실패 → 오류 메시지의 `[FIX]` 지시 따라 수정 후 재실행

---

## 타입 정의 위치 규칙

| 타입 종류           | 위치                                | 수동 작성 허용 여부 |
| ------------------- | ----------------------------------- | ------------------- |
| API 요청/응답 타입  | api-contract/generated/api-types.ts | ❌ 금지 (자동 생성) |
| API 에러 응답 타입  | api-contract/generated/api-types.ts | ❌ 금지 (자동 생성) |
| UI 전용 타입        | src/types/index.ts                  | ✅ 허용             |
| 컴포넌트 Props 타입 | 해당 컴포넌트 파일 내부             | ✅ 허용             |
| 전역 유틸리티 타입  | src/types/utils.ts                  | ✅ 허용             |

---

## 타입 작성 전 체크리스트

타입을 작성하기 전 반드시 아래 질문에 답하라:

□ 이 타입이 API 요청/응답과 관련이 있는가?
→ YES : `api-contract/generated/api-types.ts` 확인 후 import
→ YES이나 타입 없음 : 작업 중단 후 BE 팀에 보고

□ 이 타입이 UI 전용인가? (API와 완전히 무관한가?)
→ YES : `src/types/index.ts`에 추가 허용
단, `// UI-only type` 주석 필수

□ 이 타입이 특정 컴포넌트에서만 사용되는가?
→ YES : 해당 컴포넌트 파일 내부에 정의

위 체크리스트를 건너뛰고 타입을 작성하는 것은 금지된다.

---

## 완료 조건

- [ ] `src/types/index.ts`에 타입 추가됨
- [ ] `src/services/<domain>.ts` 생성됨
- [ ] `src/features/<domain>/` 컴포넌트 생성됨
- [ ] `src/app/<route>/page.tsx` 생성됨
- [ ] 4단계 검증 모두 통과
- [ ] Header 네비게이션에 새 링크 추가됨 (UI 진입점 있을 경우)
