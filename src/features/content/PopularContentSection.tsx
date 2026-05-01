import Link from 'next/link';
import { contentService } from '@/services/content';

export async function PopularContentSection() {
  let result;
  try {
    result = await contentService.getPopular();
  } catch {
    return (
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-slate-100">인기 콘텐츠</h2>
        <p className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
          인기 콘텐츠를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      </section>
    );
  }

  const { items, aggregationLabel } = result;

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">인기 콘텐츠</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {aggregationLabel}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-gray-100 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
          등록된 인기 콘텐츠가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/content/${item.id}`}>
              <article className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 line-clamp-2 font-semibold text-gray-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {item.viewCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {item.likeCount.toLocaleString()}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
