'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TermsModal } from './TermsModal';
import type { TermsId } from './TermsModal';
import { signupService } from '@/services/signup';
import { cn } from '@/lib/utils';

// UI-only type: not derived from API contract
interface TermsItem {
  id: TermsId;
  label: string;
  required: boolean;
}

const TERMS_ITEMS: TermsItem[] = [
  { id: 'service', label: '서비스 이용약관', required: true },
  { id: 'privacy', label: '개인정보 처리방침', required: true },
  { id: 'age', label: '만 14세 이상 확인', required: true },
  { id: 'marketing', label: '마케팅 정보 수신', required: false },
];

export function TermsAgreement() {
  const router = useRouter();
  const [agreed, setAgreed] = useState<Record<TermsId, boolean>>({
    service: false,
    privacy: false,
    age: false,
    marketing: false,
  });
  const [openModal, setOpenModal] = useState<TermsId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allRequired = TERMS_ITEMS.filter((t) => t.required).every((t) => agreed[t.id]);
  const allChecked = TERMS_ITEMS.every((t) => agreed[t.id]);

  function toggleAll() {
    const next = !allChecked;
    setAgreed({ service: next, privacy: next, age: next, marketing: next });
  }

  function toggle(id: TermsId) {
    setAgreed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmit() {
    if (!allRequired || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signupService.agreeTerms({
        agreeService: agreed.service,
        agreePrivacy: agreed.privacy,
        agreeAge: agreed.age,
        agreeMarketing: agreed.marketing,
      });
      router.replace('/signup/nickname');
    } catch {
      // apiClient가 TERMS-001 toast 처리 / TERMS-002는 409 toast 후 호출자 대응
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 전체 동의 */}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-blue-100 bg-blue-50 px-4 py-3">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleAll}
            className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label="약관 전체 동의"
          />
          <span className="text-sm font-semibold text-gray-900">약관 전체 동의</span>
        </label>

        <hr className="border-gray-200" />

        {/* 개별 약관 */}
        <ul className="flex flex-col gap-3" role="list">
          {TERMS_ITEMS.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`terms-${item.id}`}
                checked={agreed[item.id]}
                onChange={() => toggle(item.id)}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`terms-${item.id}`}
                className={cn(
                  'flex-1 cursor-pointer text-sm',
                  agreed[item.id] ? 'text-gray-900' : 'text-gray-700',
                )}
              >
                <span
                  className={cn(
                    'mr-1 text-xs font-semibold',
                    item.required ? 'text-blue-600' : 'text-gray-400',
                  )}
                >
                  [{item.required ? '필수' : '선택'}]
                </span>
                {item.label}
              </label>
              <button
                type="button"
                onClick={() => setOpenModal(item.id)}
                className="shrink-0 text-xs text-gray-400 underline hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`${item.label} 전문 보기`}
              >
                전문보기
              </button>
            </li>
          ))}
        </ul>

        <Button
          className="mt-2 w-full"
          disabled={!allRequired}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          동의하고 계속하기
        </Button>
      </div>

      {openModal !== null && <TermsModal termsId={openModal} onClose={() => setOpenModal(null)} />}
    </>
  );
}
