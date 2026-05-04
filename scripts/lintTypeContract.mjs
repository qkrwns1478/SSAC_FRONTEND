#!/usr/bin/env node
/**
 * lintTypeContract.mjs
 *
 * api-contract/generated/api-types.ts 외 경로에서
 * API 타입을 수동으로 정의한 경우 경고를 출력합니다.
 *
 * 검사 대상: src/ 하위 모든 .ts / .tsx 파일
 * 예외 경로: api-contract/generated/api-types.ts
 *
 * 위반 기준:
 *   - export interface Xxx { ... } 또는 export type Xxx = { ... } 형태로
 *     API 응답/요청 패턴처럼 보이는 타입이 정의된 경우
 *   - 단, 바로 위 줄에 "// UI-only type" 주석이 있으면 허용
 *   - 단, 바로 위 줄에 "// API-contract exemption" 주석이 있으면 허용
 *   - 단, src/types/index.ts 내 "// ⚠️ API type" 또는 "// Migrated:" 주석이 있으면 허용
 *     (이미 분류된 기술 부채 항목)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'src');
const EXCLUDED_FILES = [
  join(ROOT, 'api-contract', 'generated', 'api-types.ts'),
  join(ROOT, 'src', 'types', 'index.ts'), // 이미 분류된 기술 부채 파일
];

// API 타입처럼 보이는 이름 패턴 (Response, Request, Dto, Api 포함)
const API_TYPE_NAME_RE =
  /^export\s+(?:interface|type)\s+\w*(Response|Request|Dto|ApiError|ApiResponse|ErrorResponse)\w*/;

// 허용 주석 (바로 위 줄에 있어야 함)
const ALLOW_COMMENT_RE = /\/\/\s*(UI-only type|API-contract exemption)/;

function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'coverage'].includes(entry)) {
        results.push(...collectFiles(full));
      }
    } else if (/\.(ts|tsx)$/.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

const files = collectFiles(SRC_DIR).filter((f) => !EXCLUDED_FILES.includes(f));

const violations = [];

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, i) => {
    if (!API_TYPE_NAME_RE.test(line)) return;

    const prevLine = (lines[i - 1] ?? '').trim();
    if (ALLOW_COMMENT_RE.test(prevLine)) return;

    violations.push({
      file: relative(ROOT, file).replace(/\\/g, '/'),
      line: i + 1,
      code: line.trim(),
    });
  });
}

if (violations.length === 0) {
  console.log('✅ API 타입 수동 작성 위반 없음');
  process.exit(0);
} else {
  console.error('\n⚠️  WARNING: API 타입 수동 작성 위반 감지\n');
  console.error(
    '  api-contract/generated/api-types.ts 외 경로에서 API 타입이 수동으로 정의되었습니다.',
  );
  console.error('  해당 타입을 BE 팀에 Contract 추가 요청 후 api-types.ts 에서 import 하세요.\n');

  for (const v of violations) {
    console.error(`  [${v.file}:${v.line}]`);
    console.error(`    ${v.code}\n`);
  }

  console.error('  해결 방법:');
  console.error('    1. api-contract/generated/api-types.ts 에서 해당 타입 확인');
  console.error('    2. 없으면 BE 팀에 swagger 스키마 추가 요청 후 npm run sync:api');
  console.error('    3. UI 전용 타입이면 정의 바로 위에 // UI-only type 주석 추가\n');

  process.exit(1);
}
