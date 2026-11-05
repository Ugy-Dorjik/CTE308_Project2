import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif, DAYS, FULL, SLOTS, SLOT_ICON, cap, todayIdx, flag } from '../theme';
import { useApp } from '../store';
import { RECIPES } from '../recipes';
import { Screen, Card, Btn, Field, Chip, Sheet } from '../ui';

export default function Planner() {
  const { c } = useTheme();
  const { data, setMeal, toggleFavMeal } = useApp();
  const [day, setDay] = useState(todayIdx());
  const [slot, setSlot] = useState(null);
  const [text, setText] = useState('');
  const dk = DAYS[day];

  const open = (s) => { setSlot(s); setText((data.meals[dk] && data.meals[dk][s] && data.meals[dk][s].name) || ''); };
  const save = () => {
    if (!text.trim()) return Alert.alert('Name the meal', 'Type what you plan to eat, or pick a suggestion.');
    setMeal(dk, slot, text.trim()); setSlot(null);
  };
  const suggestions = [...new Set([...data.favorites.meals, ...RECIPES.filter((r) => r.type === slot || !slot).map((r) => r.name)])].slice(0, 10);

  return (
    <Screen title="Weekly plan" sub={`${FULL[day]}'s meals`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
        {DAYS.map((d, i) => {
          const on = i === day;
          return (
            <Pressable key={d} onPress={() => setDay(i)} style={{ width: 58, paddingVertical: 12, borderRadius: 18, alignItems: 'center', gap: 6, backgroundColor: on ? c.primary : c.card, borderWidth: 1, borderColor: on ? c.primary : c.line }}>
              <Text style={{ fontWeight: '700', color: on ? c.primaryInk : c.ink }}>{d}</Text>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: flag[i % 5] }} />
              {i === todayIdx() ? <Text style={{ fontSize: 10, color: on ? c.primaryInk : c.sub }}>today</Text> : <Text style={{ fontSize: 10 }}> </Text>}
            </Pressable>
          );
        })}
      </ScrollView>

      {SLOTS.map((s) => {
        const m = data.meals[dk] && data.meals[dk][s];
        const fav = m && data.favorites.meals.includes(m.name);
        return (
          <Card key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={SLOT_ICON[s]} size={22} color={c.accentInk} />
            </View>
            <Pressable style={{ flex: 1 }} onPress={() => open(s)}>
              <Text style={{ color: c.sub, fontSize: 13 }}>{cap(s)} · {data.settings.times[s]}</Text>
              <Text style={{ fontFamily: serif, fontSize: 19, fontWeight: '700', color: m ? c.ink : c.sub }}>{m ? m.name : 'Add a meal'}</Text>
            </Pressable>
            {m ? (
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <Pressable hitSlop={8} onPress={() => toggleFavMeal(m.name)}><Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? c.danger : c.sub} /></Pressable>
                <Pressable hitSlop={8} onPress={() => open(s)}><Ionicons name="create-outline" size={22} color={c.sub} /></Pressable>
                <Pressable hitSlop={8} onPress={() => setMeal(dk, s, null)}><Ionicons name="trash-outline" size={22} color={c.sub} /></Pressable>
              </View>
            ) : <Pressable onPress={() => open(s)}><Ionicons name="add-circle" size={30} color={c.primary} /></Pressable>}
          </Card>
        );
      })}

      <Text style={{ fontFamily: serif, fontSize: 20, fontWeight: '700', color: c.ink, marginTop: 8 }}>The whole week</Text>
      <Card style={{ gap: 4, padding: 10 }}>
        {DAYS.map((d, i) => (
          <Pressable key={d} onPress={() => setDay(i)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 12, backgroundColor: i === day ? c.chip : 'transparent', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: flag[i % 5] }} />
            <Text style={{ width: 34, fontWeight: '700', color: c.ink }}>{d}</Text>
            {SLOTS.map((s) => (
              <Text key={s} numberOfLines={1} style={{ flex: 1, fontSize: 12, color: data.meals[d] && data.meals[d][s] ? c.ink : c.line }}>
                {data.meals[d] && data.meals[d][s] ? data.meals[d][s].name : '—'}
              </Text>
            ))}
          </Pressable>
        ))}
      </Card>

      <Sheet visible={!!slot} title={slot ? `${cap(slot)} on ${FULL[day]}` : ''} onClose={() => setSlot(null)}>
        <Field label="Meal" value={text} onChangeText={setText} placeholder="Rice and eggs" autoFocus />
        <Text style={{ color: c.sub, fontSize: 13, fontWeight: '600' }}>Suggestions</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {suggestions.map((n) => <Chip key={n} label={n} active={text === n} onPress={() => setText(n)} />)}
        </View>
        <Btn title="Save meal" variant="accent" icon="checkmark" onPress={save} />
      </Sheet>
    </Screen>
  );
}
