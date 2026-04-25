import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CONTENT_DETAIL_MAP } from '@/data/content-data';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ContentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = CONTENT_DETAIL_MAP.get(Number(id));
  return { title: detail?.title ?? '콘텐츠' };
}

export default async function ContentDetailPage({ params }: ContentDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) notFound();

  const detail = CONTENT_DETAIL_MAP.get(numericId);
  if (!detail) notFound();

  return (
    <div className="container-page py-12">
      <Link href="/content">
        <Button variant="ghost" size="sm" className="mb-6">
          ← 콘텐츠 목록으로
        </Button>
      </Link>

      <article className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {detail.category}
          </span>
          <span className="text-sm text-gray-400">{formatDate(detail.publishedAt)}</span>
        </div>

        <h1 className="mb-8 text-3xl font-bold leading-snug text-gray-900">{detail.title}</h1>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="leading-relaxed text-gray-700">{detail.body}</p>
        </div>
      </article>
    </div>
  );
}
