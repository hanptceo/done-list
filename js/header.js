// header.js — top brand header + fixed bottom nav

const MENU_ITEMS = [
  { view: 'home', label: '홈', icon: 'home' },
  { view: 'weekly', label: '주간', icon: 'week' },
  { view: 'monthly', label: '한달', icon: 'month' },
  { view: 'routines', label: '루틴', icon: 'routine' },
  { view: 'settings', label: '설정', icon: 'settings' },
];

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
  week: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/>',
  month: '<rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M7 13.5h2M11 13.5h2M15 13.5h2M7 17h2M11 17h2"/>',
  routine: '<path d="M4 6h12M4 12h16M4 18h9"/><circle cx="19" cy="6" r="1.6" fill="currentColor" stroke="none"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.9a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.1a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.2a1.7 1.7 0 0 0 1-1.55V4.1a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.2c.14.42.42.78.79 1.01H19.9a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/>',
};

export function renderHeader(state) {
  const activeLabel = MENU_ITEMS.find((m) => m.view === state.view)?.label || '';
  return `
  <header class="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-paper-line">
    <div class="flex items-center justify-between px-4 h-14">
      <span class="font-display font-semibold text-lg tracking-tight text-ink">DONE!!DONE!!</span>
      <span class="font-mono text-[11px] uppercase tracking-widest text-olive-600">${activeLabel}</span>
    </div>
  </header>`;
}

export function renderBottomNav(state) {
  return `
  <nav class="fixed bottom-0 inset-x-0 z-30 mx-auto max-w-md bg-paper/95 backdrop-blur border-t border-paper-line"
       style="padding-bottom: env(safe-area-inset-bottom, 0px)">
    <ul class="grid grid-cols-5 gap-1 px-2 py-2">
      ${MENU_ITEMS.map((m) => `
        <li>
          <button data-action="nav" data-view="${m.view}"
            class="w-full flex flex-col items-center gap-1 rounded-xl2 py-2.5 px-0.5 text-[11px] font-medium transition-colors
              ${state.view === m.view ? 'bg-olive-600 text-white shadow-card' : 'bg-paper-soft text-ink-soft active:bg-olive-100'}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[m.icon]}</svg>
            ${m.label}
          </button>
        </li>
      `).join('')}
    </ul>
  </nav>`;
}
