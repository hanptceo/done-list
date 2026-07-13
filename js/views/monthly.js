// views/monthly.js
import { Store } from '../store.js';
import { monthRange, currentYearMonth, shiftYearMonth, isFutureYearMonth, yearMonthLabel, formatDuration, formatDurationShort, escapeHtml } from '../utils.js';

export function renderMonthly(state) {
  const ym = state.monthAnchor;
  const [start, end] = monthRange(ym);
  const items = Store.getItemsBetween(start, end);
  const routines = Store.getRoutines();

  const totals = {}; // routineId -> minutes
  let untracked = 0;
  let grandTotal = 0;
  items.forEach((it) => {
    grandTotal += it.duration;
    if (it.routineId) {
      totals[it.routineId] = (totals[it.routineId] || 0) + it.duration;
    } else {
      untracked += it.duration;
    }
  });

  const rows = routines
    .map((r) => ({ routine: r, minutes: totals[r.id] || 0 }))
    .filter((row) => row.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);

  const maxMinutes = Math.max(1, ...rows.map((r) => r.minutes));
  const nextDisabled = isFutureYearMonth(shiftYearMonth(ym, 1)) || shiftYearMonth(ym, 1) > currentYearMonth();
  const daysInMonth = Number(end.split('-')[2]);
  const avgPerDay = daysInMonth ? Math.round(grandTotal / daysInMonth) : 0;

  return `
  <section class="px-4 pt-4">
    <div class="flex items-center justify-between">
      <button data-action="month-prev" class="w-9 h-9 flex items-center justify-center rounded-full bg-paper-soft active:bg-olive-100 text-ink-soft">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="font-display font-semibold text-xl text-ink">${yearMonthLabel(ym)}</div>
      <button data-action="month-next" ${nextDisabled ? 'disabled' : ''} class="w-9 h-9 flex items-center justify-center rounded-full ${nextDisabled ? 'text-olive-600/40' : 'bg-paper-soft active:bg-olive-100 text-ink-soft'}">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>

    <div class="mt-4 rounded-xl2 bg-olive-700 text-white px-4 py-3.5 shadow-card flex items-center justify-between">
      <div>
        <p class="text-[11px] font-mono uppercase tracking-widest text-olive-200">이 달 총 기록시간</p>
        <p class="mt-1 font-display font-semibold text-2xl leading-none">
          ${formatDuration(grandTotal)}${grandTotal > 0 ? `<span class="text-[15px] font-medium text-olive-200/90"> (평균 ${formatDuration(avgPerDay)}/일)</span>` : ''}
        </p>
      </div>
      <svg class="w-9 h-9 text-olive-200/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
    </div>
  </section>

  <section class="px-4 mt-5 flex-1">
    <h2 class="text-xs font-mono uppercase tracking-widest text-olive-600 px-0.5">루틴별 작업시간</h2>
    ${rows.length ? `
      <ul class="mt-2.5 space-y-2">
        ${rows.map((row) => routineRow(row, maxMinutes)).join('')}
      </ul>
    ` : `
      <div class="mt-8 text-center text-ink-soft text-sm">이 달에 기록된 루틴이 없어요</div>
    `}

    ${untracked > 0 ? `
      <div class="mt-4 flex items-center justify-between text-xs text-olive-600 px-0.5">
        <span>루틴 미지정 직접입력 합계</span>
        <span class="font-mono">${formatDurationShort(untracked)}</span>
      </div>` : ''}
  </section>
  `;
}

function routineRow(row, maxMinutes) {
  const { routine, minutes } = row;
  const pct = Math.max(6, Math.round((minutes / maxMinutes) * 100));
  return `
  <li class="anim-pop bg-white rounded-xl2 shadow-card px-3.5 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:${routine.color}"></span>
        <span class="text-base font-medium text-ink truncate">${escapeHtml(routine.name)}</span>
      </div>
      <span class="text-[15px] text-ink-soft shrink-0">${formatDuration(minutes)}</span>
    </div>
    <div class="mt-2 h-1.5 rounded-full bg-paper-soft overflow-hidden">
      <div class="h-full rounded-full" style="width:${pct}%; background:${routine.color}"></div>
    </div>
  </li>`;
}
