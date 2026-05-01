import Link from 'next/link';
import { contentService } from '@/services/content';
import { formatDate } from '@/lib/utils';

export async function NewContentSection() {
  let items;
  try {
    items = await contentService.getNew();
  } catch {
    return (
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-slate-100">신규 콘텐츠</h2>
        <p className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          신규 콘텐츠를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-slate-100">신규 콘텐츠</h2>

      {items.length === 0 ? (
        <p className="rounded-xl border border-gray-100 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
          등록된 신규 콘텐츠가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/content/${item.id}`}>
              <article className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <span className="mb-3 inline-block rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  NEW
                </span>
                <h3 className="mb-3 line-clamp-2 font-semibold text-gray-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {formatDate(item.registeredAt)} 등록
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
