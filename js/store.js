// store.js — localStorage data layer
const KEYS = {
  routines: 'donelist_routines_v1',
  items: 'donelist_items_v1',
  settings: 'donelist_settings_v1',
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error('store read error', key, e);
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const DEFAULT_COLOR = '#5F6E2A'; // olive-600

export const COLOR_PRESETS = [
  { name: 'olive', hex: '#5F6E2A' },
  { name: 'amber', hex: '#B45309' },
  { name: 'rose', hex: '#BE123C' },
  { name: 'sky', hex: '#0369A1' },
  { name: 'violet', hex: '#6D28D9' },
  { name: 'teal', hex: '#0F766E' },
  { name: 'slate', hex: '#475569' },
  { name: 'clay', hex: '#9A5B3C' },
];

export const Store = {
  // ---------- Routines (고정루틴) ----------
  getRoutines() {
    return read(KEYS.routines, []);
  },
  saveRoutines(list) {
    write(KEYS.routines, list);
  },
  addRoutine({ name, duration, color }) {
    const list = this.getRoutines();
    const routine = { id: uid(), name, duration, color: color || DEFAULT_COLOR };
    list.push(routine);
    this.saveRoutines(list);
    return routine;
  },
  updateRoutine(id, patch) {
    const list = this.getRoutines();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch };
    this.saveRoutines(list);
    return list[idx];
  },
  deleteRoutine(id) {
    const list = this.getRoutines().filter((r) => r.id !== id);
    this.saveRoutines(list);
  },
  getRoutine(id) {
    return this.getRoutines().find((r) => r.id === id) || null;
  },

  // ---------- Done Items (d-i) ----------
  getItems() {
    return read(KEYS.items, []);
  },
  saveItems(list) {
    write(KEYS.items, list);
  },
  addItem({ date, name, duration, color, startTime, routineId }) {
    const list = this.getItems();
    const item = {
      id: uid(),
      date,
      name,
      duration,
      color: color || DEFAULT_COLOR,
      startTime,
      routineId: routineId || null,
    };
    list.push(item);
    this.saveItems(list);
    return item;
  },
  updateItem(id, patch) {
    const list = this.getItems();
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch };
    this.saveItems(list);
    return list[idx];
  },
  deleteItem(id) {
    const list = this.getItems().filter((i) => i.id !== id);
    this.saveItems(list);
  },
  getItemsByDate(dateStr) {
    return this.getItems()
      .filter((i) => i.date === dateStr)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  },
  getItemsBetween(startDateStr, endDateStr) {
    return this.getItems()
      .filter((i) => i.date >= startDateStr && i.date <= endDateStr)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  },

  // ---------- Settings ----------
  getSettings() {
    return read(KEYS.settings, { weekStart: 'mon' });
  },
  saveSettings(s) {
    write(KEYS.settings, s);
  },

  // ---------- Data management ----------
  exportAll() {
    return {
      routines: this.getRoutines(),
      items: this.getItems(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
    };
  },
  importAll(data) {
    if (data.routines) this.saveRoutines(data.routines);
    if (data.items) this.saveItems(data.items);
    if (data.settings) this.saveSettings(data.settings);
  },
  resetAll() {
    localStorage.removeItem(KEYS.routines);
    localStorage.removeItem(KEYS.items);
    localStorage.removeItem(KEYS.settings);
  },
};

export { uid };
