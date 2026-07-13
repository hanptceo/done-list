// main.js — app state, rendering, event wiring
import { Store } from './store.js';
import { todayStr, addDays, isFutureDate, currentYearMonth, shiftYearMonth } from './utils.js';
import { renderHeader, renderBottomNav } from './header.js';
import { renderHome } from './views/home.js';
import { renderWeekly } from './views/weekly.js';
import { renderMonthly } from './views/monthly.js';
import { renderRoutines } from './views/routines.js';
import { renderSettings } from './views/settings.js';
import { openItemModal, openRoutineModal, closeModal } from './modals.js';

const state = {
  view: 'home',
  currentDate: todayStr(),
  weekAnchor: todayStr(),
  monthAnchor: currentYearMonth(),
};

const appEl = document.getElementById('app');

function render() {
  const viewHtml = {
    home: renderHome,
    weekly: renderWeekly,
    monthly: renderMonthly,
    routines: renderRoutines,
    settings: renderSettings,
  }[state.view](state);

  appEl.innerHTML =
    renderHeader(state) +
    `<div class="flex-1 flex flex-col">${viewHtml}</div>` +
    renderBottomNav(state);
}

function goTo(view) {
  state.view = view;
  render();
}

function refreshCurrentView() {
  render();
}

appEl.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case 'nav':
      goTo(target.dataset.view);
      break;

    // ----- Home: date navigation -----
    case 'date-prev':
      state.currentDate = addDays(state.currentDate, -1);
      render();
      break;
    case 'date-next':
      if (!isFutureDate(addDays(state.currentDate, 1))) {
        state.currentDate = addDays(state.currentDate, 1);
        render();
      }
      break;
    case 'date-today':
      state.currentDate = todayStr();
      render();
      break;

    // ----- Home: item add / edit -----
    case 'add-item':
      openItemModal(state.currentDate, null, refreshCurrentView);
      break;
    case 'edit-item': {
      const items = Store.getItems();
      const item = items.find((i) => i.id === target.dataset.id);
      if (item) openItemModal(item.date, item, refreshCurrentView);
      break;
    }

    // ----- Weekly navigation -----
    case 'week-prev':
      state.weekAnchor = addDays(state.weekAnchor, -7);
      render();
      break;
    case 'week-next':
      state.weekAnchor = addDays(state.weekAnchor, 7);
      render();
      break;

    // ----- Monthly navigation -----
    case 'month-prev':
      state.monthAnchor = shiftYearMonth(state.monthAnchor, -1);
      render();
      break;
    case 'month-next':
      state.monthAnchor = shiftYearMonth(state.monthAnchor, 1);
      render();
      break;

    // ----- Routines -----
    case 'add-routine':
      openRoutineModal(null, refreshCurrentView);
      break;
    case 'edit-routine': {
      const routine = Store.getRoutine(target.dataset.id);
      if (routine) openRoutineModal(routine, refreshCurrentView);
      break;
    }

    // ----- Settings -----
    case 'export-data':
      exportData();
      break;
    case 'reset-data':
      if (confirm('정말 모든 루틴과 기록을 삭제할까요? 이 작업은 되돌릴 수 없어요.')) {
        Store.resetAll();
        render();
      }
      break;

    default:
      break;
  }
});

appEl.addEventListener('change', (e) => {
  const target = e.target.closest('[data-action="import-data"]');
  if (!target || !target.files?.length) return;
  const file = target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      Store.importAll(data);
      alert('데이터를 불러왔어요');
      render();
    } catch (err) {
      alert('파일을 읽을 수 없어요. 올바른 백업 파일인지 확인해주세요.');
    }
  };
  reader.readAsText(file);
  target.value = '';
});

function exportData() {
  const data = Store.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donelist-backup-${todayStr()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

render();
