import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif, DAYS, FULL, SLOTS, SLOT_ICON, cap, todayIdx, ymd, money, flag } from '../theme';
import { useApp } from '../store';
import { RECIPES } from '../recipes';
import { Screen, Card, IconBtn } from '../ui';

function nextMeal(meals, times) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const t0 = todayIdx();
  for (let o = 0; o < 7; o++) {
    const di = (t0 + o) % 7;
    for (const s of SLOTS) {
      const m = meals[DAYS[di]] && meals[DAYS[di]][s];
      if (!m) continue;
      const [h, mi] = (times[s] || '12:00').split(':').map(Number);
      if (o === 0 && h * 60 + mi < mins - 60) continue;
      return { day: o === 0 ? 'Today' : o === 1 ? 'Tomorrow' : FULL[di], slot: s, name: m.name, time: times[s] };
    }
  }
  return null;
}

export default function Home({ go, open }) {
  const { c } = useTheme();
  const { user, data } = useApp();
  const nm = nextMeal(data.meals, data.settings.times);
  const left = data.grocery.filter((g) => !g.done).length;
  const spent = data.expenses.filter((e) => e.date.startsWith(ymd().slice(0, 7))).reduce((s, e) => s + e.amount, 0);
  const favs = RECIPES.filter((r) => data.favorites.recipes.includes(r.id));
  const hr = new Date().getHours();
  const hello = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';

  const Stat = ({ icon, label, value, color, to }) => (
    <Pressable onPress={() => go(to)} style={{ flex: 1 }}>
      <Card style={{ gap: 6, padding: 14 }}>
        <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={18} color="#fff" />
        </View>
        <Text style={{ fontFamily: serif, fontSize: 22, fontWeight: '700', color: c.ink }} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        <Text style={{ color: c.sub, fontSize: 12 }}>{label}</Text>
      </Card>
    </Pressable>
  );

  return (
    <Screen title={`${hello}, ${user.name.split(' ')[0]}`} sub="Here is your kitchen at a glance."
      right={<View style={{ flexDirection: 'row', gap: 8 }}><IconBtn name="leaf-outline" onPress={() => open('leftovers')} /><IconBtn name="settings-outline" onPress={() => open('settings')} /></View>}>
      <Pressable onPress={() => go('plan')} style={{ backgroundColor: '#16203B', borderRadius: 28, padding: 22, minHeight: 170, overflow: 'hidden', borderWidth: 1, borderColor: '#2A3566' }}>
        <View style={{ position: 'absolute', right: -40, top: -40, width: 190, height: 190, borderRadius: 95, backgroundColor: '#81a1f3' }} />
        <View style={{ position: 'absolute', right: -14, top: -14, width: 138, height: 138, borderRadius: 69, borderWidth: 3, borderColor: '#3A2600', opacity: 0.35 }} />
        <Ionicons name={nm ? SLOT_ICON[nm.slot] : 'calendar-outline'} size={30} color="#3A2600" style={{ position: 'absolute', right: 28, top: 26 }} />
        <Text style={{ color: '#9AA2C4', fontWeight: '600' }}>{nm ? `${nm.day} · ${cap(nm.slot)} at ${nm.time}` : 'Next meal'}</Text>
        <View style={{ flex: 1 }} />
        <Text style={{ fontFamily: serif, color: '#fff', fontSize: 30, fontWeight: '700', marginTop: 40, width: '85%' }}>{nm ? nm.name : 'Nothing planned yet'}</Text>
        <Text style={{ color: '#CFC8F0', marginTop: 4 }}>{nm ? 'Tap to open your week' : 'Tap to plan your first meal'}</Text>
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat icon="cart" label="items to buy" value={String(left)} color={flag[0]} to="shop" />
        <Stat icon="wallet" label="spent this month" value={money(spent)} color={flag[2]} to="spend" />
        <Stat icon="leaf" label="leftovers" value={String(data.leftovers.length)} color={flag[3]} to="leftovers" />
      </View>

      <Card style={{ gap: 12 }}>
        <Text style={{ fontFamily: serif, fontSize: 20, fontWeight: '700', color: c.ink }}>Favourite recipes</Text>
        {favs.length ? favs.map((r) => (
          <Pressable key={r.id} onPress={() => go('recipes', r.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="heart" size={18} color={c.danger} />
            <Text style={{ flex: 1, color: c.ink, fontWeight: '600' }}>{r.name}</Text>
            <Text style={{ color: c.sub }}>{r.time} min</Text>
          </Pressable>
        )) : <Text style={{ color: c.sub }}>Tap the heart on a recipe to keep it here.</Text>}
      </Card>
    </Screen>
  );
}
