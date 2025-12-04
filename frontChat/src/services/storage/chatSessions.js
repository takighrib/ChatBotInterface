import { storageService } from './localStorage';
import { STORAGE_KEYS } from '@constants/config';

/**
 * Simple chat sessions storage service
 * Shape: { id: string, title: string, timestamp: string }
 */
export const chatSessions = {
  getAll: () => {
    const list = storageService.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    if (!Array.isArray(list)) return [];
    // sort desc by timestamp
    return [...list].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getById: (id) => {
    const list = chatSessions.getAll();
    return list.find((s) => s.id === id) || null;
  },

  create: (title = 'Nouvelle conversation') => {
    const id = Date.now().toString();
    const session = { id, title, timestamp: new Date().toISOString() };
    const list = chatSessions.getAll();
    storageService.setItem(STORAGE_KEYS.CHAT_SESSIONS, [session, ...list]);
    return session;
  },

  rename: (id, newTitle) => {
    const list = chatSessions.getAll();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], title: newTitle };
    storageService.setItem(STORAGE_KEYS.CHAT_SESSIONS, list);
    return true;
  },

  delete: (id) => {
    const list = chatSessions.getAll();
    const filtered = list.filter((s) => s.id !== id);
    const changed = filtered.length !== list.length;
    if (changed) storageService.setItem(STORAGE_KEYS.CHAT_SESSIONS, filtered);
    return changed;
  },

  touch: (id) => {
    const list = chatSessions.getAll();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    list[idx] = { ...list[idx], timestamp: new Date().toISOString() };
    storageService.setItem(STORAGE_KEYS.CHAT_SESSIONS, list);
    return true;
  },
};