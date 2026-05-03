/**
 * ErrorCode 매핑 테이블 검증 스크립트
 *
 * 검증 항목:
 *   1. Contract의 모든 ErrorCode가 매핑 테이블에 존재하는지
 *   2. 매핑 테이블의 ErrorCode가 Contract에 존재하는지 (유령 코드 방지)
 *   3. 매핑 테이블 파일의 Contract 버전 주석이 최신인지
 *
 * 사용법: npm run validate:error-mapping
 * 실행:   node --experimental-strip-types scripts/validateErrorMapping.ts
 */

'use strict';

const fs = require('node:fs') as typeof import('fs');
const path = require('node:path') as typeof import('path');

const ROOT: string = process.cwd();
const CONTRACT_PATH: string = path.join(ROOT, 'api-contract', 'error-contract.yml');
const MAPPING_PATH: string = path.join(ROOT, 'src', 'constants', 'errorMessages.ts');

interface ParseResult {
  version: string;
  codes: string[];
}

/** error-contract.yml에서 version과 ErrorCode 목록 추출 */
function parseContract(content: string): ParseResult {
  const versionMatch = content.match(/^version:\s*["']?([^"'\n\r]+)["']?/m);
  const version = versionMatch ? (versionMatch[1] ?? '').trim() : '';

  const codes: string[] = [];
  const codeRegex = /^  ([A-Z]+-\d+):/gm;
  let match: RegExpExecArray | null;
  while ((match = codeRegex.exec(content)) !== null) {
    const code = match[1];
    if (code !== undefined) codes.push(code);
  }

  return { version, codes };
}

/** errorMessages.ts에서 Contract 버전 주석과 ErrorCode 목록 추출 */
function parseMapping(content: string): ParseResult {
  const versionMatch = content.match(/Contract version:\s*([\d.]+)/);
  const version = versionMatch ? (versionMatch[1] ?? '').trim() : '';

  const codes: string[] = [];
  const codeRegex = /"([A-Z]+-\d+)":/g;
  let match: RegExpExecArray | null;
  while ((match = codeRegex.exec(content)) !== null) {
    const code = match[1];
    if (code !== undefined) codes.push(code);
  }

  return { version, codes };
}

function main(): void {
  let hasError = false;

  // 파일 존재 확인
  if (!fs.existsSync(CONTRACT_PATH)) {
    console.error(`[ERROR] Contract 파일을 찾을 수 없습니다: ${CONTRACT_PATH}`);
    console.error('→ api-contract/error-contract.yml 파일이 필요합니다.');
    process.exit(1);
  }

  if (!fs.existsSync(MAPPING_PATH)) {
    console.error(`[ERROR] 매핑 테이블 파일을 찾을 수 없습니다: ${MAPPING_PATH}`);
    console.error('→ src/constants/errorMessages.ts 파일이 필요합니다.');
    process.exit(1);
  }

  const contractContent: string = fs.readFileSync(CONTRACT_PATH, 'utf-8');
  const mappingContent: string = fs.readFileSync(MAPPING_PATH, 'utf-8');

  const contract = parseContract(contractContent);
  const mapping = parseMapping(mappingContent);

  console.log('\n🔍 ErrorCode 매핑 테이블 검증 시작');
  console.log(`   Contract 버전: ${contract.version || '(없음)'}`);
  console.log(`   매핑 테이블 버전: ${mapping.version || '(없음)'}`);
  console.log(`   Contract ErrorCode 수: ${contract.codes.length}개`);
  console.log(`   매핑 테이블 ErrorCode 수: ${mapping.codes.length}개\n`);

  // 검증 1: 버전 주석 존재 여부
  if (!mapping.version) {
    console.error('[ERROR] ErrorCode 매핑 테이블 불일치 발견');
    console.error('- 매핑 테이블 파일에 Contract 버전 주석이 없습니다.');
    console.error('→ src/constants/errorMessages.ts 상단에 아래 주석을 추가하세요:');
    console.error(`  // Contract version: ${contract.version} / updatedAt: YYYY-MM-DD\n`);
    hasError = true;
  } else if (contract.version && mapping.version !== contract.version) {
    // 검증 2: 버전 일치 여부
    console.error('[ERROR] ErrorCode 매핑 테이블 불일치 발견');
    console.error(
      `- Contract 버전(${contract.version})과 매핑 테이블 버전(${mapping.version})이 다릅니다.`,
    );
    console.error(
      '→ src/constants/errorMessages.ts의 Contract 버전 주석을 갱신한 후 다시 실행하세요.\n',
    );
    hasError = true;
  }

  const contractSet = new Set(contract.codes);
  const mappingSet = new Set(mapping.codes);

  // 검증 3: Contract → 매핑 테이블 누락 확인
  const missingInMapping = contract.codes.filter((code) => !mappingSet.has(code));
  if (missingInMapping.length > 0) {
    console.error('[ERROR] ErrorCode 매핑 테이블 불일치 발견');
    for (const code of missingInMapping) {
      console.error(`- Contract에 존재하지만 FE 매핑 테이블에 없음: ${code}`);
    }
    console.error('→ src/constants/errorMessages.ts를 갱신한 후 다시 실행하세요.\n');
    hasError = true;
  }

  // 검증 4: 매핑 테이블 → Contract 유령 코드 확인
  const ghostCodes = mapping.codes.filter((code) => !contractSet.has(code));
  if (ghostCodes.length > 0) {
    console.error('[ERROR] ErrorCode 매핑 테이블 불일치 발견');
    for (const code of ghostCodes) {
      console.error(`- FE 매핑 테이블에 존재하지만 Contract에 없음 (유령 코드): ${code}`);
    }
    console.error('→ Contract에 없는 코드를 제거하거나 BE 팀에 Contract 추가를 요청하세요.\n');
    hasError = true;
  }

  if (hasError) {
    process.exit(1);
  }

  console.log('✅ ErrorCode 매핑 테이블 검증 통과');
  console.log(`   Contract 버전 일치: ${contract.version}`);
  console.log('   누락 코드: 없음');
  console.log('   유령 코드: 없음\n');
}

main();
