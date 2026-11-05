import { createContext, useContext } from 'react';
import { Platform } from 'react-native';

export const palette = {
  light: { bg: '#F3F1FA', card: '#FFFFFF', ink: '#16203B', sub: '#69718F', line: '#E3E0F0', accent: '#FFB627', accentInk: '#3A2600', primary: '#16203B', primaryInk: '#FFFFFF', chip: '#E9E6F7', danger: '#E4572E', ok: '#2BB39B' },
  dark: { bg: '#0C1122', card: '#161D36', ink: '#F1EFFB', sub: '#9AA2C4', line: '#27304F', accent: '#FFB627', accentInk: '#3A2600', primary: '#FFB627', primaryInk: '#2B1B00', chip: '#212A4A', danger: '#FF7A59', ok: '#3FD0B6' },
};
// The five prayer-flag colours: blue, white, red, green, yellow
export const flag = ['#3B82F6', '#CFC8F0', '#c8471f', '#2BB39B', '#FFB627'];
export const serif = Platform.select({ ios: 'Georgia', default: 'serif' });

export const ThemeCtx = createContext({ c: palette.light, dark: false });
export const useTheme = () => useContext(ThemeCtx);

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const SLOTS = ['breakfast', 'lunch', 'dinner'];
export const SLOT_ICON = { breakfast: 'sunny-outline', lunch: 'partly-sunny-outline', dinner: 'moon-outline' };
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const todayIdx = () => (new Date().getDay() + 6) % 7;
export const ymd = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
export const money = (n) => 'Nu. ' + (Math.round(n * 100) / 100).toLocaleString('en-US');
