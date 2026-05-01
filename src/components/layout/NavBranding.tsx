'use client';

import Link from 'next/link';
import Image from 'next/image';

export function NavBranding() {
  return (
    <Link
      href="/"
      aria-label="SSAC 싹 홈으로 이동"
      className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
    >
      <Image
        src="/gress.png"
        alt="SSAC 마스코트"
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        priority
      />
      <span
        className="whitespace-nowrap text-lg font-bold text-gray-900 dark:text-slate-100"
        aria-label="SSAC 싹"
      >
        SSAC(싹)
      </span>
    </Link>
  );
}
