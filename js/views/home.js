// views/home.js
import { Store } from '../store.js';
import { formatDateHeading, addDays, isFutureDate, todayStr, formatDurationShort, addMinutesToTime, escapeHtml } from '../utils.js';

export function renderHome(state) {
  const date = state.currentDate;
  const items = Store.getItemsByDate(date);
  const isToday = date === todayStr();
  const nextDisabled = isFutureDate(addDays(date, 1));
  const totalMin = items.reduce((s, i) => s + i.duration, 0);

  return `
  <section class="px-4 pt-4">
    <div class="flex items-center justify-between">
      <button data-action="date-prev" class="w-9 h-9 flex items-center justify-center rounded-full bg-paper-soft active:bg-olive-100 text-ink-soft">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="text-center">
        <div class="font-display font-semibold text-xl text-ink">${formatDateHeading(date)}</div>
        <div class="mt-0.5 flex items-center justify-center gap-2">
          ${isToday ? '<span class="text-[11px] font-mono uppercase tracking-widest text-olive-700 bg-olive-100 px-2 py-0.5 rounded-full">Today</span>' : `<button data-action="date-today" class="text-[11px] font-mono uppercase tracking-widest text-olive-600 underline underline-offset-2">오늘로</button>`}
        </div>
      </div>
      <button data-action="date-next" ${nextDisabled ? 'disabled' : ''} class="w-9 h-9 flex items-center justify-center rounded-full ${nextDisabled ? 'text-olive-600/40' : 'bg-paper-soft active:bg-olive-100 text-ink-soft'}">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>

    ${items.length ? `
      <div class="mt-4 flex items-center justify-between text-xs font-mono text-olive-600 px-0.5">
        <span>${items.length}개 기록</span>
        <span>총 ${formatDurationShort(totalMin)}</span>
      </div>` : ''}
  </section>

  <section class="px-4 mt-3 flex-1">
    ${items.length ? `
      <ul class="space-y-2.5">
        ${items.map((it) => itemCard(it)).join('')}
      </ul>
    ` : emptyState(isToday)}
  </section>

  <button data-action="add-item" aria-label="기록 추가"
    class="fixed z-20 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] right-1/2 translate-x-[9.5rem] w-14 h-14 rounded-full bg-olive-700 text-white shadow-pop
           flex items-center justify-center active:scale-95 transition-transform">
    <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
  </button>
  `;
}

function itemCard(it) {
  const endTime = it.startTime ? addMinutesToTime(it.startTime, it.duration) : null;
  const pct = Math.max(6, Math.min(100, Math.round((it.duration / 60) * 100)));
  return `
  <li data-action="edit-item" data-id="${it.id}"
    class="anim-pop group relative flex items-stretch gap-3 bg-white rounded-xl2 shadow-card overflow-hidden active:bg-paper-soft cursor-pointer">
    <div class="w-1.5 shrink-0" style="background:${it.color}"></div>
    <div class="flex-1 py-3 pr-3 min-w-0">
      <div class="flex items-center justify-between gap-2 min-w-0">
        <div class="min-w-0">
          <p class="font-medium text-ink truncate">${escapeHtml(it.name)}</p>
          <p class="mt-0.5 text-xs font-mono text-olive-600">
            ${it.startTime ? `${it.startTime}${endTime ? ' – ' + endTime : ''}` : '시간 미지정'}
          </p>
        </div>
        <span class="shrink-0 text-xs font-mono font-medium px-2 py-1 rounded-full" style="background:${it.color}1A; color:${it.color}">
          ${formatDurationShort(it.duration)}
        </span>
      </div>
      <div class="mt-2 h-1 rounded-full bg-paper-soft overflow-hidden">
        <div class="h-full rounded-full" style="width:${pct}%; background:${it.color}"></div>
      </div>
    </div>
    <img src="./assets/good-job-stamp.png" alt="" aria-hidden="true"
      class="anim-stamp pointer-events-none absolute bottom-1 right-1 w-11 opacity-80 rotate-[-10deg]" />
  </li>`;
}

function emptyState(isToday) {
  return `
  <div class="anim-pop mt-10 flex flex-col items-center text-center px-6">
    <div class="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center text-olive-700">
      <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    </div>
    <p class="mt-4 font-display text-ink font-medium">${isToday ? '아직 기록이 없어요' : '기록이 없는 날이에요'}</p>
    <p class="mt-1 text-sm text-ink-soft">${isToday ? '+ 버튼을 눌러 오늘 한 일을 남겨보세요' : '이 날은 아무것도 기록되지 않았어요'}</p>
  </div>`;
}
