# AGENTS.md — 환경 진입점

> 규칙은 이 파일에 없습니다. 도구가 강제합니다.
> 이 파일은 "어떤 도구를 사용해 무엇을 하는가"만 안내합니다.

---

## 이 프로젝트

SSAC_FRONTEND — Next.js 15 + TypeScript strict + Tailwind CSS v4.
인간은 의도를 정의하고, 에이전트가 아래 환경 도구로 구현합니다.

---

## 환경 도구 지도

| 목적 | 명령 | 기계적 진실 위치 |
|---|---|---|
| 전체 검증 (단일 진입점) | `npm run validate` | `package.json` |
| 타입 검사 | `npm run typecheck` | `tsconfig.json` |
| 코드 품질 + 레이어(ESLint) | `npm run lint` | `eslint.config.mjs` |
| 레이어 아키텍처 검사 | `npm run layers` | `.dependency-cruiser.cjs` |
| 포맷 적용 | `npm run format` | `.prettierrc` |
| 새 도메인 스캐폴딩 | `npm run scaffold -- --domain=<name>` | `scripts/scaffold.js` |

**커밋 전 자동 실행**: `.githooks/pre-commit` → `npm run validate`
활성화: `npm install` (prepare 스크립트가 git hooks 경로 설정)

---

## 태스크 시작 시

```bash
npm run validate        # 현재 환경 상태 확인 (baseline)
```

오류가 있으면 내 변경 전에 먼저 수정하거나, 기존 오류임을 기록합니다.

---

## 새 기능 추가 시

```bash
# 환경이 구조를 생성합니다. 파일 위치를 고민하지 마세요.
npm run scaffold -- --domain=<name> --endpoint=/<path>

# 생성된 파일에서 TODO 를 채우고:
npm run validate        # 모두 통과해야 커밋 가능
```

---

## 판단이 필요할 때

| 질문 | 도구/파일 |
|---|---|
| "이 import가 허용되는가?" | `npm run layers` 실행 → 즉시 오류 출력 |
| "이 타입이 올바른가?" | `npm run typecheck` 실행 |
| "왜 이 구조인가?" | `docs/architecture.md` (`.dependency-cruiser.cjs` 의 설명) |
| "새 패키지를 추가해도 되는가?" | `docs/agent-protocols/adr-create.md` 실행 |
| "CI가 계속 실패한다" | `docs/agent-protocols/self-diagnose.md` 실행 |
