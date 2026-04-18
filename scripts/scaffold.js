#!/usr/bin/env node
/**
 * scripts/scaffold.js
 *
 * 새 도메인 기능의 보일러플레이트를 자동 생성합니다.
 * 에이전트가 파일 위치를 고민할 필요 없이 구조가 자동으로 만들어집니다.
 *
 * 사용법:
 *   npm run scaffold -- --domain=<name> --endpoint=<path>
 *
 * 예시:
 *   npm run scaffold -- --domain=users --endpoint=/users
 *
 * 생성되는 파일:
 *   src/types/index.ts          (타입 추가 안내 출력)
 *   src/services/<domain>.ts
 *   src/features/<domain>/<Domain>Card.tsx
 *   src/features/<domain>/<Domain>List.tsx
 *   src/app/<domain>/page.tsx
 */

const fs = require('fs');
const path = require('path');

// ── 인수 파싱 ──────────────────────────────────────────────
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace('--', '').split('=');
  acc[key] = value;
  return acc;
}, {});

const domain = args.domain;
const endpoint = args.endpoint || `/${domain}`;

if (!domain) {
  console.error('Error: --domain=<name> is required');
  console.error('Example: npm run scaffold -- --domain=users --endpoint=/users');
  process.exit(1);
}

const Domain = domain.charAt(0).toUpperCase() + domain.slice(1);
const srcRoot = path.join(__dirname, '..', 'src');

// ── 파일 생성 헬퍼 ────────────────────────────────────────
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (fs.existsSync(filePath)) {
    console.log(`  SKIP (exists): ${filePath.replace(srcRoot + '/../', '')}`);
    return;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  CREATE: ${filePath.replace(srcRoot + '/../', '')}`);
}

// ── 1. 서비스 ─────────────────────────────────────────────
writeFile(
  path.join(srcRoot, 'services', `${domain}.ts`),
  `import { apiClient } from './api';
import type { ${Domain} } from '@/types';

export const ${domain}Service = {
  getAll(): Promise<${Domain}[]> {
    return apiClient.get<${Domain}[]>('${endpoint}');
  },

  getById(id: number): Promise<${Domain}> {
    return apiClient.get<${Domain}>(\`${endpoint}/\${id}\`);
  },
};
`,
);

// ── 2. 카드 컴포넌트 ──────────────────────────────────────
writeFile(
  path.join(srcRoot, 'features', domain, `${Domain}Card.tsx`),
  `import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { ${Domain} } from '@/types';

interface ${Domain}CardProps {
  item: ${Domain};
}

export function ${Domain}Card({ item }: ${Domain}CardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">{item.id}</h3>
      </CardHeader>
      <CardBody>
        {/* TODO: ${Domain} 필드 렌더링 */}
        <pre className="text-xs text-gray-500">{JSON.stringify(item, null, 2)}</pre>
      </CardBody>
    </Card>
  );
}
`,
);

// ── 3. 리스트 컴포넌트 ────────────────────────────────────
writeFile(
  path.join(srcRoot, 'features', domain, `${Domain}List.tsx`),
  `'use client';

import { useFetch } from '@/hooks/useFetch';
import { ${domain}Service } from '@/services/${domain}';
import { Button } from '@/components/ui/Button';
import { ${Domain}Card } from './${Domain}Card';

export function ${Domain}List() {
  const { data: items, isLoading, error, refetch } = useFetch(
    () => ${domain}Service.getAll(),
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="mb-4 text-sm text-red-600">{error.message}</p>
        <Button variant="danger" size="sm" onClick={refetch}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className="text-center text-gray-500">데이터가 없습니다.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">총 {items.length}개</p>
        <Button variant="secondary" size="sm" onClick={refetch}>
          새로고침
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <${Domain}Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
`,
);

// ── 4. 페이지 ─────────────────────────────────────────────
writeFile(
  path.join(srcRoot, 'app', domain, 'page.tsx'),
  `import type { Metadata } from 'next';
import { ${Domain}List } from '@/features/${domain}/${Domain}List';

export const metadata: Metadata = {
  title: '${Domain}',
};

export default function ${Domain}Page() {
  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">${Domain}</h1>
      </div>
      <${Domain}List />
    </div>
  );
}
`,
);

// ── 5. 타입 안내 ──────────────────────────────────────────
console.log('');
console.log('✅ Scaffold complete.');
console.log('');
console.log('Next step — add the type to src/types/index.ts:');
console.log('');
console.log(`  export interface ${Domain} {`);
console.log(`    id: number;`);
console.log(`    // TODO: add fields from the API response`);
console.log(`  }`);
console.log('');
console.log('Then run: npm run validate');
