import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, serif, flag } from '../theme';
import { useApp } from '../store';
import { Screen, Card, Btn, Field, Check, Empty, Sheet } from '../ui';

export default function Grocery({ go }) {
  const { c } = useTheme();
  const { data, addGrocery, editGrocery, toggleGrocery, removeGrocery, clearDone } = useApp();
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [edit, setEdit] = useState(null);
  const todo = data.grocery.filter((g) => !g.done);
  const done = data.grocery.filter((g) => g.done);
  const pct = data.grocery.length ? done.length / data.grocery.length : 0;
  const haveLeft = (n) => data.leftovers.some((l) => l.name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(l.name.toLowerCase()));

  const add = () => { if (!name.trim()) return; addGrocery(name.trim(), qty.trim()); setName(''); setQty(''); };

  const Row = ({ g }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
      <Check done={g.done} onPress={() => toggleGrocery(g.id)} />
      <Pressable style={{ flex: 1 }} onPress={() => setEdit({ ...g })}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: g.done ? c.sub : c.ink, textDecorationLine: g.done ? 'line-through' : 'none' }}>{g.name}</Text>
        {g.qty || (!g.done && haveLeft(g.name)) ? (
          <Text style={{ fontSize: 12, color: !g.done && haveLeft(g.name) ? c.ok : c.sub }}>{[g.qty, !g.done && haveLeft(g.name) ? 'You may already have this in leftovers' : ''].filter(Boolean).join(' · ')}</Text>
        ) : null}
      </Pressable>
      <Pressable hitSlop={8} onPress={() => removeGrocery(g.id)}><Ionicons name="close" size={20} color={c.sub} /></Pressable>
    </View>
  );

  return (
    <Screen title="Shopping list" sub={data.grocery.length ? `${done.length} of ${data.grocery.length} bought` : 'Nothing on the list yet'}>
      <View style={{ height: 10, borderRadius: 5, backgroundColor: c.chip, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, flex: 1, backgroundColor: flag[3] }} />
      </View>

      <Card style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field value={name} onChangeText={setName} placeholder="Add an item" style={{ flex: 2 }} onSubmitEditing={add} />
          <Field value={qty} onChangeText={setQty} placeholder="Qty" style={{ flex: 1 }} onSubmitEditing={add} />
        </View>
        <Btn title="Add to list" icon="add" variant="accent" onPress={add} />
      </Card>

      {data.grocery.length === 0 ? <Empty icon="cart-outline" title="Your list is empty" text="Open a recipe and add its ingredients, or type an item above." /> : null}

      {todo.length ? (
        <Card>
          <Text style={{ fontFamily: serif, fontSize: 18, fontWeight: '700', color: c.ink }}>Still to buy</Text>
          {todo.map((g) => <Row key={g.id} g={g} />)}
        </Card>
      ) : null}

      {done.length ? (
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, fontFamily: serif, fontSize: 18, fontWeight: '700', color: c.ink }}>Bought</Text>
            <Btn small variant="ghost" title="Clear bought" icon="trash-outline" onPress={() => clearDone()} />
          </View>
          {done.map((g) => <Row key={g.id} g={g} />)}
          <Btn title="Record what you spent" icon="wallet-outline" variant="primary" style={{ marginTop: 8 }} onPress={() => go('spend')} />
        </Card>
      ) : null}

      <Sheet visible={!!edit} title="Edit item" onClose={() => setEdit(null)}>
        {edit ? (
          <>
            <Field label="Item" value={edit.name} onChangeText={(v) => setEdit({ ...edit, name: v })} />
            <Field label="Quantity" value={edit.qty} onChangeText={(v) => setEdit({ ...edit, qty: v })} />
            <Btn title="Save changes" icon="checkmark" variant="accent" onPress={() => {
              if (!edit.name.trim()) return Alert.alert('Item needs a name');
              editGrocery(edit.id, edit.name.trim(), edit.qty.trim()); setEdit(null);
            }} />
          </>
        ) : null}
      </Sheet>
    </Screen>
  );
}
