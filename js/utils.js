// utils.js — date & formatting helpers

export const WEEKDAY_KR = ['일', '월', '화', '수', '목', '금', '토'];
export const MONTH_KR = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function toDateStr(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function fromDateStr(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayStr() {
  return toDateStr(new Date());
}

export function addDays(dateStr, n) {
  const d = fromDateStr(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function isFutureDate(dateStr) {
  return dateStr > todayStr();
}

export function formatDateHeading(dateStr) {
  const d = fromDateStr(dateStr);
  const wd = WEEKDAY_KR[d.getDay()];
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} (${wd})`;
}

export function formatDateShort(dateStr) {
  const d = fromDateStr(dateStr);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

// Monday-start week range containing dateStr → [monday, sunday]
export function weekRange(dateStr) {
  const d = fromDateStr(dateStr);
  const dow = d.getDay(); // 0 = Sun
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return [toDateStr(monday), toDateStr(sunday)];
}

export function eachDateInRange(startStr, endStr) {
  const out = [];
  let cur = startStr;
  while (cur <= endStr) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

// duration in minutes -> "1시간 20분" / "40분"
export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}시간 ${m}분`;
  if (h) return `${h}시간`;
  return `${m}분`;
}

export function formatDurationShort(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}분`;
  if (h) return `${h}h`;
  return `${m}분`;
}

// "HH:mm" + minutes -> "HH:mm"
export function addMinutesToTime(hhmm, minutes) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor((total % (24 * 60)) / 60);
  const nm = total % 60;
  return `${pad2(nh)}:${pad2(nm)}`;
}

export function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function nowHHMM() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(Math.floor(d.getMinutes() / 10) * 10)}`;
}

export function currentYearMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function shiftYearMonth(ym, n) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function isFutureYearMonth(ym) {
  return ym > currentYearMonth();
}

export function yearMonthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return `${y}년 ${MONTH_KR[m - 1]}`;
}

export function monthRange(ym) {
  const [y, m] = ym.split('-').map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  return [toDateStr(start), toDateStr(end)];
}

export function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
