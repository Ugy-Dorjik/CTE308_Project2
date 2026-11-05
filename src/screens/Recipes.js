import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif, DAYS, FULL, SLOTS, cap, flag } from '../theme';
import { useApp } from '../store';
import { RECIPES } from '../recipes';
import { Screen, Card, Btn, Field, Chip, Sheet, Empty } from '../ui';

export default function Recipes({ focus }) {
  const { c } = useTheme();
  const { data, toggleFavRecipe, addManyGrocery, setMeal } = useApp();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState(null);
  const [planning, setPlanning] = useState(false);
  const [pDay, setPDay] = useState(0);
  const [pSlot, setPSlot] = useState('dinner');

  useEffect(() => { if (focus) setSel(RECIPES.find((r) => r.id === focus) || null); }, [focus]);

  const list = RECIPES.filter((r) =>
    r.name.toLowerCase().includes(q.toLowerCase()) &&
    (filter === 'all' || (filter === 'fav' ? data.favorites.recipes.includes(r.id) : r.type === filter)));
  const isFav = (id) => data.favorites.recipes.includes(id);
  const close = () => { setSel(null); setPlanning(false); };

  return (
    <Screen title="Recipes" sub="Simple meals for small hostel kitchens">
      <Field value={q} onChangeText={setQ} placeholder="Search recipes" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {[['all', 'All'], ['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['dinner', 'Dinner']].map(([k, l]) => <Chip key={k} label={l} active={filter === k} onPress={() => setFilter(k)} />)}
        <Chip label="Favourites" icon="heart" active={filter === 'fav'} onPress={() => setFilter('fav')} />
      </View>

      {list.length === 0 ? <Empty icon="book-outline" title="No recipes found" text="Try another search or filter." /> : null}
      {list.map((r, i) => (
        <Pressable key={r.id} onPress={() => setSel(r)}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 54, height: 54, borderRadius: 16, backgroundColor: flag[(i + 2) % 5], alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: serif, fontSize: 26, fontWeight: '700', color: '#16203B' }}>{r.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: serif, fontSize: 18, fontWeight: '700', color: c.ink }}>{r.name}</Text>
              <Text style={{ color: c.sub, fontSize: 13 }}>{cap(r.type)} · {r.time} min · {r.ingredients.length} ingredients</Text>
            </View>
            <Pressable hitSlop={10} onPress={() => toggleFavRecipe(r.id)}><Ionicons name={isFav(r.id) ? 'heart' : 'heart-outline'} size={24} color={isFav(r.id) ? c.danger : c.sub} /></Pressable>
          </Card>
        </Pressable>
      ))}

      <Sheet visible={!!sel} title={sel ? sel.name : ''} onClose={close}>
        {sel ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Chip label={`${sel.time} min`} icon="time-outline" />
              <Chip label={cap(sel.type)} />
              <View style={{ flex: 1 }} />
              <Pressable onPress={() => toggleFavRecipe(sel.id)}><Ionicons name={isFav(sel.id) ? 'heart' : 'heart-outline'} size={28} color={isFav(sel.id) ? c.danger : c.sub} /></Pressable>
            </View>
            <Text style={{ fontFamily: serif, fontSize: 18, fontWeight: '700', color: c.ink }}>Ingredients</Text>
            {sel.ingredients.map((g) => (
              <View key={g.n} style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, color: c.ink }}>{g.n}</Text><Text style={{ color: c.sub }}>{g.q}</Text>
              </View>
            ))}
            <Text style={{ fontFamily: serif, fontSize: 18, fontWeight: '700', color: c.ink, marginTop: 6 }}>Method</Text>
            {sel.steps.map((s, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ color: c.accent, fontWeight: '800', width: 18 }}>{i + 1}</Text>
                <Text style={{ flex: 1, color: c.ink, lineHeight: 21 }}>{s}</Text>
              </View>
            ))}
            <Btn title="Add ingredients to shopping list" icon="cart-outline" variant="primary" onPress={() => { addManyGrocery(sel.ingredients); Alert.alert('Added', 'Ingredients are on your shopping list. Items already there were skipped.'); }} />
            {!planning ? <Btn title="Plan this meal" icon="calendar-outline" variant="accent" onPress={() => { setPlanning(true); setPSlot(sel.type); }} /> : (
              <View style={{ gap: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{DAYS.map((d, i) => <Chip key={d} label={d} active={pDay === i} onPress={() => setPDay(i)} />)}</View>
                <View style={{ flexDirection: 'row', gap: 8 }}>{SLOTS.map((s) => <Chip key={s} label={cap(s)} active={pSlot === s} onPress={() => setPSlot(s)} />)}</View>
                <Btn title={`Save to ${FULL[pDay]} ${pSlot}`} icon="checkmark" variant="accent" onPress={() => { setMeal(DAYS[pDay], pSlot, sel.name); close(); Alert.alert('Planned', `${sel.name} is set for ${FULL[pDay]} ${pSlot}.`); }} />
              </View>
            )}
          </>
        ) : null}
      </Sheet>
    </Screen>
  );
}
