import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncReminders } from './reminders';

/*
 * Data layer. Everything lives in AsyncStorage so the app works instantly in Expo Go.
 * To move to Firebase, replace register/login/loadData and the persist effect below
 * (Firebase Auth for accounts, Firestore doc at users/{uid} for `data`).
 */
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const hash = (s) => { let h = 5381; for (const ch of s) h = ((h << 5) + h + ch.charCodeAt(0)) | 0; return String(h); };

const emptyData = () => ({
  meals: {}, grocery: [], expenses: [], leftovers: [],
  favorites: { recipes: [], meals: [] },
  settings: { dark: false, remind: false, times: { breakfast: '07:30', lunch: '13:00', dinner: '19:30' } },
});

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(emptyData());
  const loaded = useRef(false);

  const loadData = async (email) => {
    const raw = await AsyncStorage.getItem('hmp:data:' + email);
    const base = emptyData();
    const d = raw ? JSON.parse(raw) : {};
    setData({ ...base, ...d, favorites: { ...base.favorites, ...d.favorites }, settings: { ...base.settings, ...d.settings, times: { ...base.settings.times, ...(d.settings && d.settings.times) } } });
    loaded.current = true;
  };

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem('hmp:session');
        if (s) { const u = JSON.parse(s); await loadData(u.email); setUser(u); }
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (user && loaded.current) AsyncStorage.setItem('hmp:data:' + user.email, JSON.stringify(data)).catch(() => {});
  }, [data, user]);

  useEffect(() => {
    if (user && loaded.current) syncReminders(data.meals, data.settings.times, data.settings.remind).catch(() => {});
  }, [data.meals, data.settings.remind, data.settings.times, user]);

  const finish = async (email, name) => {
    const u = { email, name };
    await AsyncStorage.setItem('hmp:session', JSON.stringify(u));
    await loadData(email);
    setUser(u);
    return null;
  };
  const getUsers = async () => JSON.parse((await AsyncStorage.getItem('hmp:users')) || '{}');

  const register = async (name, email, pw) => {
    email = email.trim().toLowerCase();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'Enter your name and a valid email.';
    if (pw.length < 6) return 'Password needs at least 6 characters.';
    const users = await getUsers();
    if (users[email]) return 'That email already has an account. Log in instead.';
    users[email] = { name: name.trim(), pw: hash(pw) };
    await AsyncStorage.setItem('hmp:users', JSON.stringify(users));
    return finish(email, name.trim());
  };
  const login = async (email, pw) => {
    email = email.trim().toLowerCase();
    const u = (await getUsers())[email];
    if (!u || u.pw !== hash(pw)) return 'Email or password is incorrect.';
    return finish(email, u.name);
  };
  const logout = async () => {
    await AsyncStorage.removeItem('hmp:session');
    loaded.current = false;
    setUser(null);
    setData(emptyData());
  };

  const set = (key, fn) => setData((d) => ({ ...d, [key]: fn(d[key]) }));
  const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const api = {
    ready, user, data, register, login, logout,
    setMeal: (day, slot, name) => set('meals', (m) => {
      const dayMeals = { ...(m[day] || {}) };
      if (name) dayMeals[slot] = { name }; else delete dayMeals[slot];
      return { ...m, [day]: dayMeals };
    }),
    addGrocery: (name, qty = '') => set('grocery', (g) => [{ id: uid(), name, qty, done: false }, ...g]),
    addManyGrocery: (items) => set('grocery', (g) => {
      const have = g.map((x) => x.name.toLowerCase());
      const fresh = items.filter((i) => !have.includes(i.n.toLowerCase())).map((i) => ({ id: uid(), name: i.n, qty: i.q || '', done: false }));
      return [...fresh, ...g];
    }),
    editGrocery: (id, name, qty) => set('grocery', (g) => g.map((x) => (x.id === id ? { ...x, name, qty } : x))),
    toggleGrocery: (id) => set('grocery', (g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x))),
    removeGrocery: (id) => set('grocery', (g) => g.filter((x) => x.id !== id)),
    clearDone: () => set('grocery', (g) => g.filter((x) => !x.done)),
    addExpense: (e) => set('expenses', (x) => [{ id: uid(), ...e }, ...x].sort((a, b) => (a.date < b.date ? 1 : -1))),
    removeExpense: (id) => set('expenses', (x) => x.filter((e) => e.id !== id)),
    addLeftover: (name, qty) => set('leftovers', (l) => [{ id: uid(), name, qty, date: new Date().toISOString() }, ...l]),
    removeLeftover: (id) => set('leftovers', (l) => l.filter((x) => x.id !== id)),
    toggleFavRecipe: (id) => set('favorites', (f) => ({ ...f, recipes: toggle(f.recipes, id) })),
    toggleFavMeal: (name) => set('favorites', (f) => ({ ...f, meals: toggle(f.meals, name) })),
    setSettings: (patch) => set('settings', (s) => ({ ...s, ...patch })),
    resetData: () => setData((d) => ({ ...emptyData(), settings: d.settings })),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
