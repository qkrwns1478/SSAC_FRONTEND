// ============================================================
// 전역 에러 토스트 상태 관리 (pub/sub 패턴)
// ============================================================

export interface ToastItem {
  id: string;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit(): void {
  const snapshot = [...toasts];
  listeners.forEach((l) => l(snapshot));
}

export const toastStore = {
  /** 토스트 상태 변화를 구독한다. 반환값은 구독 해제 함수. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * 에러 토스트를 표시한다.
   * - 동일 메시지가 이미 표시 중이면 중복 표시하지 않는다.
   * - 3초 후 자동으로 사라진다.
   */
  show(message: string): void {
    const id = `toast:${message}`;
    if (toasts.some((t) => t.id === id)) return;
    toasts = [...toasts, { id, message }];
    emit();
    setTimeout(() => toastStore.dismiss(id), 3000);
  },

  dismiss(id: string): void {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  },
};
