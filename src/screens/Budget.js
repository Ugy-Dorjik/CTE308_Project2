import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif, flag, ymd, money } from '../theme';
import { useApp } from '../store';
import { Screen, Card, Btn, Field, Chip, Empty, Sheet } from '../ui';

const CATS = ['Groceries', 'Snacks', 'Eating out', 'Other'];

export default function Budget() {
  const { c } = useTheme();
  const { data, addExpense, removeExpense } = useApp();
  const [period, setPeriod] = useState('month');
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ amount: '', category: 'Groceries', desc: '', date: ymd() });

  const weekAgo = ymd(new Date(Date.now() - 6 * 86400000));
  const list = data.expenses.filter((e) => period === 'all' || (period === 'month' ? e.date.startsWith(ymd().slice(0, 7)) : e.date >= weekAgo));
  const total = list.reduce((s, e) => s + e.amount, 0);
  const byCat = CATS.map((k) => ({ k, v: list.filter((e) => e.category === k).reduce((s, e) => s + e.amount, 0) }));

  const save = () => {
    const amount = parseFloat(f.amount);
    if (!(amount > 0)) return Alert.alert('Enter an amount', 'The amount must be a number greater than 0.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.date)) return Alert.alert('Check the date', 'Use the format YYYY-MM-DD.');
    addExpense({ amount, category: f.category, desc: f.desc.trim(), date: f.date });
    setF({ amount: '', category: 'Groceries', desc: '', date: ymd() }); setShow(false);
  };

  return (
    <Screen title="Food budget" sub="Know where the money goes">
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[['week', 'Last 7 days'], ['month', 'This month'], ['all', 'All time']].map(([k, l]) => <Chip key={k} label={l} active={period === k} onPress={() => setPeriod(k)} />)}
      </View>

      <Card style={{ gap: 14 }}>
        <Text style={{ color: c.sub }}>Total spent</Text>
        <Text style={{ fontFamily: serif, fontSize: 42, fontWeight: '700', color: c.ink }}>{money(total)}</Text>
        {byCat.map((x, i) => (
          <View key={x.k} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row' }}><Text style={{ flex: 1, color: c.ink, fontSize: 13 }}>{x.k}</Text><Text style={{ color: c.sub, fontSize: 13 }}>{money(x.v)}</Text></View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: c.chip, overflow: 'hidden' }}>
              <View style={{ height: 8, width: `${total ? (x.v / total) * 100 : 0}%`, backgroundColor: flag[[0, 2, 3, 4][i]] }} />
            </View>
          </View>
        ))}
      </Card>

      <Btn title="Add an expense" icon="add" variant="accent" onPress={() => setShow(true)} />

      {list.length === 0 ? <Empty icon="wallet-outline" title="No expenses here" text="Record what you spend on food to see your totals." /> : (
        <Card style={{ paddingVertical: 6 }}>
          {list.map((e, i) => (
            <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: c.line }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: flag[[0, 2, 3, 4][Math.max(0, CATS.indexOf(e.category))]] }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.ink, fontWeight: '600' }}>{e.desc || e.category}</Text>
                <Text style={{ color: c.sub, fontSize: 12 }}>{e.category} · {e.date}</Text>
              </View>
              <Text style={{ color: c.ink, fontWeight: '700' }}>{money(e.amount)}</Text>
              <Pressable hitSlop={8} onPress={() => removeExpense(e.id)}><Ionicons name="trash-outline" size={19} color={c.sub} /></Pressable>
            </View>
          ))}
        </Card>
      )}

      <Sheet visible={show} title="New expense" onClose={() => setShow(false)}>
        <Field label="Amount (Nu.)" value={f.amount} onChangeText={(v) => setF({ ...f, amount: v })} keyboardType="decimal-pad" placeholder="450" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CATS.map((k) => <Chip key={k} label={k} active={f.category === k} onPress={() => setF({ ...f, category: k })} />)}
        </View>
        <Field label="Note (optional)" value={f.desc} onChangeText={(v) => setF({ ...f, desc: v })} placeholder="Vegetables from the market" />
        <Field label="Date" value={f.date} onChangeText={(v) => setF({ ...f, date: v })} placeholder="YYYY-MM-DD" />
        <Btn title="Save expense" icon="checkmark" variant="accent" onPress={save} />
      </Sheet>
    </Screen>
  );
}
