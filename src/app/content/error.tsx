'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ContentError({ reset }: ErrorProps) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="mb-2 text-5xl font-bold text-gray-200">오류</p>
      <h2 className="mb-3 text-2xl font-semibold text-gray-900">콘텐츠를 불러오지 못했습니다</h2>
      <p className="mb-8 text-gray-500">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>
      <div className="flex gap-3">
        <Button onClick={reset}>다시 시도</Button>
        <Link href="/">
          <Button variant="outline">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
