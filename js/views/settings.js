// views/settings.js
import { Store } from '../store.js';

export function renderSettings(state) {
  const routines = Store.getRoutines().length;
  const items = Store.getItems().length;

  return `
  <section class="px-4 pt-4">
    <h1 class="font-display font-semibold text-xl text-ink">설정</h1>
  </section>

  <section class="px-4 mt-4 space-y-3 flex-1">
    <div class="bg-white rounded-xl2 shadow-card px-4 py-3.5">
      <p class="text-xs font-mono uppercase tracking-widest text-olive-600">저장된 데이터</p>
      <p class="mt-1.5 text-sm text-ink">루틴 ${routines}개 · 기록 ${items}개</p>
      <p class="mt-1 text-xs text-olive-600">모든 데이터는 이 기기의 브라우저(localStorage)에만 저장돼요.</p>
    </div>

    <button data-action="export-data" class="w-full flex items-center justify-between bg-white rounded-xl2 shadow-card px-4 py-3.5 active:bg-paper-soft">
      <div class="text-left">
        <p class="font-medium text-ink">데이터 내보내기</p>
        <p class="text-xs text-olive-600 mt-0.5">저장 위치를 골라 JSON으로 백업</p>
      </div>
      <svg class="w-5 h-5 text-olive-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
    </button>

    <label class="w-full flex items-center justify-between bg-white rounded-xl2 shadow-card px-4 py-3.5 active:bg-paper-soft cursor-pointer">
      <div class="text-left">
        <p class="font-medium text-ink">데이터 가져오기</p>
        <p class="text-xs text-olive-600 mt-0.5">백업한 JSON 파일 복원</p>
      </div>
      <svg class="w-5 h-5 text-olive-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/></svg>
      <input type="file" accept="application/json" data-action="import-data" class="hidden" />
    </label>

    <button data-action="reset-data" class="w-full flex items-center justify-between bg-white rounded-xl2 shadow-card px-4 py-3.5 active:bg-rose-50">
      <div class="text-left">
        <p class="font-medium text-rose-700">모든 데이터 초기화</p>
        <p class="text-xs text-olive-600 mt-0.5">루틴과 기록을 모두 삭제해요</p>
      </div>
      <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
    </button>

    <p class="text-center text-xs text-olive-600 pt-2 font-mono">Done List · v1.0</p>
  </section>
  `;
}
