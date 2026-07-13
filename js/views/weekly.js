// views/weekly.js
import { Store } from '../store.js';
import { weekRange, eachDateInRange, addDays, formatDuration, formatDurationShort, WEEKDAY_KR, fromDateStr, todayStr, isFutureDate, escapeHtml } from '../utils.js';

export function renderWeekly(state) {
  const [monday, sunday] = weekRange(state.weekAnchor);
  const days = eachDateInRange(monday, sunday);
  const items = Store.getItemsBetween(monday, sunday);
  const byDate = {};
  days.forEach((d) => (byDate[d] = []));
  items.forEach((it) => byDate[it.date]?.push(it));

  const nextWeekAnchor = addDays(state.weekAnchor, 7);
  const nextDisabled = weekRange(nextWeekAnchor)[0] > todayStr();

  const weekTotal = items.reduce((s, i) => s + i.duration, 0);
  const mon = fromDateStr(monday);
  const sun = fromDateStr(sunday);
  const weekLabel = `${mon.getFullYear()}.${mon.getMonth() + 1}.${mon.getDate()} ~ ${sun.getMonth() + 1}.${sun.getDate()}`;

  return `
  <section class="px-4 pt-4">
    <div class="flex items-center justify-between">
      <button data-action="week-prev" class="w-9 h-9 flex items-center justify-center rounded-full bg-paper-soft active:bg-olive-100 text-ink-soft">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <div class="text-center">
        <div class="font-display font-semibold text-lg text-ink">${weekLabel}</div>
        <div class="mt-0.5 text-[11px] font-mono uppercase tracking-widest text-olive-600">이번 주 합계 ${formatDuration(weekTotal)}</div>
      </div>
      <button data-action="week-next" ${nextDisabled ? 'disabled' : ''} class="w-9 h-9 flex items-center justify-center rounded-full ${nextDisabled ? 'text-olive-600/40' : 'bg-paper-soft active:bg-olive-100 text-ink-soft'}">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </section>

  <section class="mt-4 px-4 flex-1 pb-4">
    <div class="space-y-1.5">
      ${days.map((d) => dayRow(d, byDate[d])).join('')}
    </div>
  </section>
  `;
}

const PX_PER_MIN = 2.6; // width scale: 60min ≈ 156px
const MIN_BLOCK_W = 46;

// Soft weekend tones that sit with paper + olive
function dayTheme(day, isToday) {
  if (day === 6) {
    // Saturday — dusty blue
    return {
      section: isToday ? 'bg-[#E4EDF3]' : 'bg-[#EFF4F7]',
      badge: isToday ? 'bg-[#5B7C90] text-white' : 'text-[#5B7C90]',
      label: 'text-[#5B7C90]',
      total: 'text-[#5B7C90]',
      empty: 'border-[#C8D6E0]',
    };
  }
  if (day === 0) {
    // Sunday — dusty rose
    return {
      section: isToday ? 'bg-[#F3E6E6]' : 'bg-[#F7EEEE]',
      badge: isToday ? 'bg-[#A65F5F] text-white' : 'text-[#A65F5F]',
      label: 'text-[#A65F5F]',
      total: 'text-[#A65F5F]',
      empty: 'border-[#E0C8C8]',
    };
  }
  return {
    section: isToday ? 'bg-olive-50' : 'bg-white',
    badge: isToday ? 'bg-olive-600 text-white' : 'text-ink',
    label: isToday ? 'text-olive-700' : 'text-olive-600',
    total: 'text-olive-600',
    empty: 'border-paper-line',
  };
}

function dayRow(dateStr, items) {
  const d = fromDateStr(dateStr);
  const isToday = dateStr === todayStr();
  const dayTotal = items.reduce((s, i) => s + i.duration, 0);
  const theme = dayTheme(d.getDay(), isToday);

  return `
  <div class="rounded-xl2 ${theme.section} shadow-card px-3 py-2.5">
    <div class="flex items-center gap-2 mb-2">
      <span class="font-mono text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${theme.badge}">${d.getDate()}</span>
      <span class="text-[11px] ${theme.label}">${WEEKDAY_KR[d.getDay()]}</span>
      ${dayTotal ? `<span class="ml-auto text-[10px] font-mono ${theme.total}">${formatDurationShort(dayTotal)}</span>` : ''}
    </div>
    <div class="flex flex-wrap gap-1.5">
      ${items.length ? items.map(block).join('') : `<div class="w-full h-8 rounded-lg border border-dashed ${theme.empty}"></div>`}
    </div>
  </div>`;
}

function block(it) {
  const widthPx = Math.max(MIN_BLOCK_W, Math.round(it.duration * PX_PER_MIN));
  const useStartTime = Store.getSettings().useStartTime;
  const meta = useStartTime
    ? `${it.startTime || '--:--'} · ${formatDurationShort(it.duration)}`
    : formatDurationShort(it.duration);
  return `
  <div data-action="edit-item" data-id="${it.id}"
    style="width:${widthPx}px; background:${it.color}1A; border-left:3px solid ${it.color}"
    class="anim-pop shrink-0 rounded-md px-2 py-1.5 cursor-pointer active:opacity-80 overflow-hidden">
    <p class="text-[11px] font-medium text-ink leading-tight truncate">${escapeHtml(it.name)}</p>
    <p class="mt-0.5 text-[9px] font-mono text-ink-soft leading-none truncate">${meta}</p>
  </div>`;
}
