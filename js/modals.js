// modals.js — bottom-sheet modals for creating/editing items & routines
import { Store, DEFAULT_COLOR, COLOR_PRESETS } from './store.js';
import { nowHHMM, formatDuration, escapeHtml } from './utils.js';

const root = () => document.getElementById('modal-root');

function isCustomColor(hex) {
  return !COLOR_PRESETS.some((c) => c.hex.toLowerCase() === (hex || '').toLowerCase());
}

function shellOpen(innerHtml, { onOutsideClose = true } = {}) {
  root().innerHTML = `
  <div class="fixed inset-0 z-40 flex items-end justify-center">
    <div data-close-overlay class="absolute inset-0 bg-ink/40 anim-pop" style="animation-duration:.18s"></div>
    <div class="relative w-full max-w-md bg-paper rounded-t-[1.4rem] shadow-pop anim-pop max-h-[88vh] overflow-y-auto" style="animation-duration:.22s">
      <div class="sticky top-0 flex justify-center pt-2.5 pb-1 bg-paper">
        <div class="w-10 h-1.5 rounded-full bg-paper-line"></div>
      </div>
      ${innerHtml}
    </div>
  </div>`;
  if (onOutsideClose) {
    root().querySelector('[data-close-overlay]').addEventListener('click', closeModal);
  }
}

export function closeModal() {
  root().innerHTML = '';
}

/* ===================== Item Modal (d-i 등록/수정) ===================== */

let itemState = null;

export function openItemModal(dateStr, existing = null, onSaved = () => {}) {
  const routines = Store.getRoutines();
  itemState = existing
    ? { ...existing, tab: existing.routineId ? 'routine' : 'custom' }
    : {
        id: null,
        date: dateStr,
        name: '',
        duration: 30,
        color: DEFAULT_COLOR,
        startTime: nowHHMM(),
        routineId: null,
        tab: routines.length ? 'routine' : 'custom',
      };
  itemState._onSaved = onSaved;
  renderItemModal();
}

function renderItemModal() {
  const s = itemState;
  const routines = Store.getRoutines();
  const isEdit = !!s.id;

  shellOpen(`
    <div class="px-5 pb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display font-semibold text-lg text-ink">${isEdit ? '기록 수정' : '오늘 한 일 기록'}</h2>
        <button data-action="close" class="w-8 h-8 flex items-center justify-center rounded-full text-olive-600 active:bg-paper-soft">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      ${routines.length ? `
      <div class="grid grid-cols-2 gap-1.5 p-1 bg-paper-soft rounded-xl2 mb-4">
        <button data-action="tab" data-tab="routine" class="py-2 rounded-lg text-sm font-medium transition-colors ${s.tab === 'routine' ? 'bg-white shadow-card text-ink' : 'text-olive-600'}">루틴에서 선택</button>
        <button data-action="tab" data-tab="custom" class="py-2 rounded-lg text-sm font-medium transition-colors ${s.tab === 'custom' ? 'bg-white shadow-card text-ink' : 'text-olive-600'}">직접 입력</button>
      </div>` : ''}

      ${s.tab === 'routine' && routines.length ? `
        <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          ${routines.map((r) => `
            <button data-action="pick-routine" data-id="${r.id}"
              class="shrink-0 flex flex-col items-start gap-1 rounded-xl2 px-3.5 py-2.5 border-2 transition-colors
                ${s.routineId === r.id ? 'border-olive-600 bg-olive-50' : 'border-paper-line bg-white'}">
              <span class="flex items-center gap-1.5 text-sm font-medium text-ink">
                <span class="w-2 h-2 rounded-full" style="background:${r.color}"></span>${escapeHtml(r.name)}
              </span>
              <span class="text-[11px] font-mono text-olive-600">${formatDuration(r.duration)}</span>
            </button>
          `).join('')}
        </div>
      ` : ''}

      <div class="mt-4 space-y-4">
        <div>
          <label class="text-xs font-mono uppercase tracking-widest text-olive-600">작업</label>
          <input data-field="name" type="text" value="${escapeHtml(s.name)}" placeholder="예: 독서, 운동, 보고서 작성"
            class="mt-1.5 w-full rounded-xl2 border border-paper-line bg-white px-3.5 py-2.5 text-ink placeholder:text-olive-600/70 focus:outline-none focus:ring-2 focus:ring-olive-400" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs font-mono uppercase tracking-widest text-olive-600">작업시간 (10분 단위)</label>
            <div class="mt-1.5 flex items-center gap-1.5">
              <button data-action="dur-dec" class="w-9 h-10 shrink-0 rounded-lg bg-paper-soft text-ink flex items-center justify-center active:bg-olive-100 text-lg font-medium">–</button>
              <div class="flex-1 min-w-0 text-center font-mono text-sm font-semibold text-ink whitespace-nowrap overflow-hidden text-ellipsis">${formatDuration(s.duration)}</div>
              <button data-action="dur-inc" class="w-9 h-10 shrink-0 rounded-lg bg-paper-soft text-ink flex items-center justify-center active:bg-olive-100 text-lg font-medium">+</button>
            </div>
          </div>

          <div>
            <label class="text-xs font-mono uppercase tracking-widest text-olive-600">시작 시간</label>
            <input data-field="startTime" type="time" step="600" value="${s.startTime}"
              class="mt-1.5 w-full rounded-xl2 border border-paper-line bg-white px-3 py-2.5 text-ink font-mono text-sm focus:outline-none focus:ring-2 focus:ring-olive-400" />
          </div>
        </div>

        <div>
          <label class="text-xs font-mono uppercase tracking-widest text-olive-600">색상</label>
          <div class="mt-1.5 flex items-center gap-2.5 flex-wrap">
            ${COLOR_PRESETS.map((c) => `
              <button data-action="pick-color" data-color="${c.hex}"
                class="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-paper transition-shadow ${s.color === c.hex ? 'ring-ink' : 'ring-transparent'}"
                style="background:${c.hex}" aria-label="${c.name}"></button>
            `).join('')}
            <label class="relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ring-2 ring-offset-2 ring-offset-paper transition-shadow ${isCustomColor(s.color) ? 'ring-ink' : 'ring-paper-line'}"
              style="background:${isCustomColor(s.color) ? s.color : 'conic-gradient(from 0deg, #e24b4a, #ef9f27, #639922, #1d9e75, #378add, #7f77dd, #d4537e, #e24b4a)'}"
              aria-label="직접 선택">
              ${isCustomColor(s.color) ? '' : '<svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'}
              <input data-field="customColor" type="color" value="${isCustomColor(s.color) ? s.color : DEFAULT_COLOR}" class="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-2.5">
        ${isEdit ? `<button data-action="delete" class="px-4 py-3 rounded-xl2 bg-rose-50 text-rose-700 font-medium">삭제</button>` : ''}
        <button data-action="save" class="flex-1 py-3 rounded-xl2 bg-olive-700 text-white font-medium shadow-card active:scale-[0.99] transition-transform">
          ${isEdit ? '수정 완료' : '기록하기'}
        </button>
      </div>
    </div>
  `);

  wireItemModalEvents();
}

function wireItemModalEvents() {
  const el = root();
  el.querySelector('[data-action="close"]').addEventListener('click', closeModal);

  el.querySelectorAll('[data-action="tab"]').forEach((btn) =>
    btn.addEventListener('click', () => {
      itemState.tab = btn.dataset.tab;
      if (btn.dataset.tab === 'custom') itemState.routineId = null;
      renderItemModal();
    })
  );

  el.querySelectorAll('[data-action="pick-routine"]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const r = Store.getRoutine(btn.dataset.id);
      if (!r) return;
      itemState.routineId = r.id;
      itemState.name = r.name;
      itemState.duration = r.duration;
      itemState.color = r.color;
      renderItemModal();
    })
  );

  const nameInput = el.querySelector('[data-field="name"]');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => (itemState.name = e.target.value));
  }
  const timeInput = el.querySelector('[data-field="startTime"]');
  if (timeInput) {
    timeInput.addEventListener('change', (e) => {
      itemState.startTime = roundTo10(e.target.value);
    });
  }

  const decBtn = el.querySelector('[data-action="dur-dec"]');
  const incBtn = el.querySelector('[data-action="dur-inc"]');
  if (decBtn) decBtn.addEventListener('click', () => { itemState.duration = Math.max(10, itemState.duration - 10); renderItemModal(); });
  if (incBtn) incBtn.addEventListener('click', () => { itemState.duration = Math.min(24 * 60, itemState.duration + 10); renderItemModal(); });

  el.querySelectorAll('[data-action="pick-color"]').forEach((btn) =>
    btn.addEventListener('click', () => { itemState.color = btn.dataset.color; renderItemModal(); })
  );

  const customColorInput = el.querySelector('[data-field="customColor"]');
  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      itemState.color = e.target.value;
      renderItemModal();
    });
  }

  const saveBtn = el.querySelector('[data-action="save"]');
  saveBtn.addEventListener('click', () => saveItem());

  const delBtn = el.querySelector('[data-action="delete"]');
  if (delBtn) delBtn.addEventListener('click', () => {
    if (confirm('이 기록을 삭제할까요?')) {
      Store.deleteItem(itemState.id);
      closeModal();
      itemState._onSaved();
    }
  });
}

function roundTo10(hhmm) {
  if (!hhmm) return hhmm;
  const [h, m] = hhmm.split(':').map(Number);
  const rounded = Math.round(m / 10) * 10;
  const carry = rounded === 60;
  const nh = carry ? (h + 1) % 24 : h;
  const nm = carry ? 0 : rounded;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

function saveItem() {
  const s = itemState;
  if (!s.name.trim()) {
    flashError('이름을 입력해주세요');
    return;
  }
  const payload = {
    date: s.date,
    name: s.name.trim(),
    duration: s.duration,
    color: s.color,
    startTime: s.startTime,
    routineId: s.tab === 'routine' ? s.routineId : null,
  };
  if (s.id) {
    Store.updateItem(s.id, payload);
  } else {
    Store.addItem(payload);
  }
  closeModal();
  s._onSaved();
}

function flashError(msg) {
  const btn = root().querySelector('[data-action="save"]');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = msg;
  btn.classList.add('bg-rose-600');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('bg-rose-600');
  }, 1200);
}

/* ===================== Routine Modal (고정루틴 등록/수정) ===================== */

let routineState = null;

export function openRoutineModal(existing = null, onSaved = () => {}) {
  routineState = existing
    ? { ...existing }
    : { id: null, name: '', duration: 30, color: DEFAULT_COLOR };
  routineState._onSaved = onSaved;
  renderRoutineModal();
}

function renderRoutineModal() {
  const s = routineState;
  const isEdit = !!s.id;

  shellOpen(`
    <div class="px-5 pb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display font-semibold text-lg text-ink">${isEdit ? '루틴 수정' : '루틴 등록'}</h2>
        <button data-action="close" class="w-8 h-8 flex items-center justify-center rounded-full text-olive-600 active:bg-paper-soft">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="text-xs font-mono uppercase tracking-widest text-olive-600">이름</label>
          <input data-field="name" type="text" value="${escapeHtml(s.name)}" placeholder="예: 독서, 헬스, 영어공부"
            class="mt-1.5 w-full rounded-xl2 border border-paper-line bg-white px-3.5 py-2.5 text-ink placeholder:text-olive-600/70 focus:outline-none focus:ring-2 focus:ring-olive-400" />
        </div>

        <div>
          <label class="text-xs font-mono uppercase tracking-widest text-olive-600">작업시간량 (단위시간, 10분 단위)</label>
          <div class="mt-1.5 flex items-center gap-3">
            <button data-action="dur-dec" class="w-10 h-10 rounded-full bg-paper-soft text-ink flex items-center justify-center active:bg-olive-100 text-lg font-medium">–</button>
            <div class="flex-1 text-center font-mono text-lg font-semibold text-ink">${formatDuration(s.duration)}</div>
            <button data-action="dur-inc" class="w-10 h-10 rounded-full bg-paper-soft text-ink flex items-center justify-center active:bg-olive-100 text-lg font-medium">+</button>
          </div>
        </div>

        <div>
          <label class="text-xs font-mono uppercase tracking-widest text-olive-600">색상</label>
          <div class="mt-1.5 flex items-center gap-2.5 flex-wrap">
            ${COLOR_PRESETS.map((c) => `
              <button data-action="pick-color" data-color="${c.hex}"
                class="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-paper transition-shadow ${s.color === c.hex ? 'ring-ink' : 'ring-transparent'}"
                style="background:${c.hex}" aria-label="${c.name}"></button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="mt-6 flex gap-2.5">
        ${isEdit ? `<button data-action="delete" class="px-4 py-3 rounded-xl2 bg-rose-50 text-rose-700 font-medium">삭제</button>` : ''}
        <button data-action="save" class="flex-1 py-3 rounded-xl2 bg-olive-700 text-white font-medium shadow-card active:scale-[0.99] transition-transform">
          ${isEdit ? '수정 완료' : '루틴 등록'}
        </button>
      </div>
    </div>
  `);

  wireRoutineModalEvents();
}

function wireRoutineModalEvents() {
  const el = root();
  el.querySelector('[data-action="close"]').addEventListener('click', closeModal);

  el.querySelector('[data-field="name"]').addEventListener('input', (e) => (routineState.name = e.target.value));

  el.querySelector('[data-action="dur-dec"]').addEventListener('click', () => { routineState.duration = Math.max(10, routineState.duration - 10); renderRoutineModal(); });
  el.querySelector('[data-action="dur-inc"]').addEventListener('click', () => { routineState.duration = Math.min(24 * 60, routineState.duration + 10); renderRoutineModal(); });

  el.querySelectorAll('[data-action="pick-color"]').forEach((btn) =>
    btn.addEventListener('click', () => { routineState.color = btn.dataset.color; renderRoutineModal(); })
  );

  el.querySelector('[data-action="save"]').addEventListener('click', () => {
    const s = routineState;
    if (!s.name.trim()) {
      flashErrorRoutine('이름을 입력해주세요');
      return;
    }
    const payload = { name: s.name.trim(), duration: s.duration, color: s.color };
    if (s.id) Store.updateRoutine(s.id, payload);
    else Store.addRoutine(payload);
    closeModal();
    s._onSaved();
  });

  const delBtn = el.querySelector('[data-action="delete"]');
  if (delBtn) delBtn.addEventListener('click', () => {
    if (confirm('이 루틴을 삭제할까요? 이미 기록된 항목은 남아있어요.')) {
      Store.deleteRoutine(routineState.id);
      closeModal();
      routineState._onSaved();
    }
  });
}

function flashErrorRoutine(msg) {
  const btn = root().querySelector('[data-action="save"]');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = msg;
  btn.classList.add('bg-rose-600');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('bg-rose-600');
  }, 1200);
}
