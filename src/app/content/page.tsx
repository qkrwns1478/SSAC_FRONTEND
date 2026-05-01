import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PopularContentSection } from '@/features/content/PopularContentSection';
import { NewContentSection } from '@/features/content/NewContentSection';
import { RecommendedSection } from '@/features/content/RecommendedSection';
import { PopularContentSkeleton, NewContentSkeleton } from '@/features/content/ContentSkeletons';

export const metadata: Metadata = { title: '콘텐츠' };
export const dynamic = 'force-dynamic';

export default function ContentPage() {
  return (
    <div className="container-page py-12">
      <h1 className="mb-10 text-3xl font-bold text-gray-900 dark:text-slate-100">콘텐츠</h1>

      <Suspense fallback={<PopularContentSkeleton />}>
        <PopularContentSection />
      </Suspense>

      <Suspense fallback={<NewContentSkeleton />}>
        <NewContentSection />
      </Suspense>

      <RecommendedSection />
    </div>
  );
}
