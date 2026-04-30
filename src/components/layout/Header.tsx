/**
 * Header — Server Component
 *
 * 렌더링 전략:
 * - 이 컴포넌트 자체는 Server Component (즉시 SSR, JS 없음)
 * - 인터랙티브 요소(DesktopNav, MobileMenu)만 Client Component로 분리
 * - sticky + backdrop-blur + 고정 h-16으로 Layout Shift 방지
 * - 인증 상태는 accessToken 쿠키를 서버에서 읽어 자식에게 전달
 */

import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { NavBranding } from './NavBranding';

export async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 브랜딩 — 마스코트 이미지 + 서비스명 */}
        <NavBranding />

        {/* 데스크톱 네비게이션 (md 이상) */}
        <DesktopNav isLoggedIn={isLoggedIn} />

        {/* 모바일 햄버거 메뉴 (md 미만) */}
        <MobileMenu appName={env.appName} isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
