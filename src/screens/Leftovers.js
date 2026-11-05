import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif } from '../theme';
import { useApp } from '../store';
import { Screen, Card, Btn, Field, Empty } from '../ui';

const daysAgo = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

export default function Leftovers({ onBack }) {
  const { c } = useTheme();
  const { data, addLeftover, removeLeftover } = useApp();
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const add = () => { if (!name.trim()) return; addLeftover(name.trim(), qty.trim()); setName(''); setQty(''); };

  return (
    <Screen title="Leftovers" sub="Use it before you buy it again" onBack={onBack}>
      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field value={name} onChangeText={setName} placeholder="Cooked rice, chicken…" style={{ flex: 2 }} onSubmitEditing={add} />
          <Field value={qty} onChangeText={setQty} placeholder="Amount" style={{ flex: 1 }} onSubmitEditing={add} />
        </View>
        <Btn title="Save leftover" icon="add" variant="accent" onPress={add} />
      </Card>
      {data.leftovers.length === 0 ? <Empty icon="leaf-outline" title="No leftovers" text="Record food or ingredients you still have so you can plan around them." /> : (
        <Card style={{ paddingVertical: 6 }}>
          {data.leftovers.map((l, i) => {
            const d = daysAgo(l.date);
            const old = d >= 3;
            return (
              <View key={l.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderColor: c.line }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: serif, fontSize: 17, fontWeight: '700', color: c.ink }}>{l.name}</Text>
                  <Text style={{ fontSize: 12, color: old ? c.danger : c.sub }}>{[l.qty, d === 0 ? 'saved today' : `${d} day${d > 1 ? 's' : ''} ago`, old ? 'use soon' : ''].filter(Boolean).join(' · ')}</Text>
                </View>
                <Btn small variant="ghost" title="Used up" onPress={() => removeLeftover(l.id)} />
              </View>
            );
          })}
        </Card>
      )}
    </Screen>
  );
}
