import React from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { useTheme, serif } from '../theme';
import { useApp } from '../store';
import { askPermission } from '../reminders';
import { Screen, Card, Btn, TimeField } from '../ui';

export default function Settings({ onBack }) {
  const { c } = useTheme();
  const { user, data, setSettings, logout, resetData } = useApp();
  const s = data.settings;

  const toggleRemind = async (on) => {
    if (on && !(await askPermission())) return Alert.alert('Notifications are off', 'Allow notifications for this app in your phone settings to get meal reminders.');
    setSettings({ remind: on });
  };
  const Row = ({ label, sub, value, onChange }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.ink, fontWeight: '700', fontSize: 16 }}>{label}</Text>
        <Text style={{ color: c.sub, fontSize: 13 }}>{sub}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c.accent }} thumbColor="#fff" />
    </View>
  );

  return (
    <Screen title="Profile" sub="Your account and preferences" onBack={onBack}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: serif, fontSize: 26, fontWeight: '700', color: c.accentInk }}>{user.name[0].toUpperCase()}</Text>
        </View>
        <View>
          <Text style={{ fontFamily: serif, fontSize: 20, fontWeight: '700', color: c.ink }}>{user.name}</Text>
          <Text style={{ color: c.sub }}>{user.email}</Text>
        </View>
      </Card>

      <Card style={{ gap: 18 }}>
        <Row label="Dark mode" sub="Easier on the eyes at night" value={s.dark} onChange={(v) => setSettings({ dark: v })} />
        <Row label="Meal reminders" sub="A weekly nudge for every planned meal" value={s.remind} onChange={toggleRemind} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TimeField label="Breakfast" value={s.times.breakfast} onCommit={(v) => setSettings({ times: { ...s.times, breakfast: v } })} />
          <TimeField label="Lunch" value={s.times.lunch} onCommit={(v) => setSettings({ times: { ...s.times, lunch: v } })} />
          <TimeField label="Dinner" value={s.times.dinner} onCommit={(v) => setSettings({ times: { ...s.times, dinner: v } })} />
        </View>
      </Card>

      <Btn title="Clear my plans, lists and expenses" icon="refresh" variant="ghost" onPress={() => Alert.alert('Clear all data?', 'This removes your meal plan, shopping list, expenses and leftovers.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: resetData }])} />
      <Btn title="Log out" icon="log-out-outline" variant="danger" onPress={logout} />
    </Screen>
  );
}
