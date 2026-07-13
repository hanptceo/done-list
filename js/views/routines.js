// views/routines.js
import { Store } from '../store.js';
import { formatDuration, escapeHtml } from '../utils.js';

export function renderRoutines(state) {
  const routines = Store.getRoutines();

  return `
  <section class="px-4 pt-4 flex items-center justify-between">
    <div>
      <h1 class="font-display font-semibold text-xl text-ink">고정루틴</h1>
      <p class="text-sm text-ink-soft mt-0.5">반복해서 쓰는 항목을 등록해두세요</p>
    </div>
    <button data-action="add-routine" class="w-10 h-10 rounded-full bg-olive-700 text-white flex items-center justify-center shadow-card active:scale-95 transition-transform">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
    </button>
  </section>

  <section class="px-4 mt-4 flex-1">
    ${routines.length ? `
      <ul class="space-y-2.5">
        ${routines.map(routineCard).join('')}
      </ul>
    ` : `
      <div class="anim-pop mt-10 flex flex-col items-center text-center px-6">
        <div class="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center text-olive-700">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h12M4 12h16M4 18h9"/><circle cx="19" cy="6" r="1.6" fill="currentColor" stroke="none"/></svg>
        </div>
        <p class="mt-4 font-display text-ink font-medium">등록된 루틴이 없어요</p>
        <p class="mt-1 text-sm text-ink-soft">자주 하는 일을 루틴으로 등록하면<br/>기록이 훨씬 빨라져요</p>
      </div>
    `}
  </section>
  `;
}

function routineCard(r) {
  return `
  <li data-action="edit-routine" data-id="${r.id}"
    class="anim-pop flex items-center gap-3 bg-white rounded-xl2 shadow-card overflow-hidden active:bg-paper-soft cursor-pointer">
    <div class="w-1.5 self-stretch shrink-0" style="background:${r.color}"></div>
    <div class="flex-1 py-3 pr-3 flex items-center justify-between gap-2 min-w-0">
      <p class="font-medium text-ink truncate">${escapeHtml(r.name)}</p>
      <span class="shrink-0 text-xs font-mono font-medium px-2 py-1 rounded-full" style="background:${r.color}1A; color:${r.color}">
        ${formatDuration(r.duration)}
      </span>
    </div>
  </li>`;
}
