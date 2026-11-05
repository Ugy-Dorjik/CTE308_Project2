import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/store';
import { ThemeCtx, palette } from './src/theme';
import Auth from './src/screens/Auth';
import Home from './src/screens/Home';
import Planner from './src/screens/Planner';
import Grocery from './src/screens/Grocery';
import Budget from './src/screens/Budget';
import Recipes from './src/screens/Recipes';
import Leftovers from './src/screens/Leftovers';
import Settings from './src/screens/Settings';

const TABS = [['home', 'Home', 'home'], ['plan', 'Plan', 'calendar'], ['shop', 'Shop', 'cart'], ['spend', 'Budget', 'wallet'], ['recipes', 'Recipes', 'book']];

function Shell() {
  const { ready, user, data } = useApp();
  const ins = useSafeAreaInsets();
  const [tab, setTab] = useState('home');
  const [overlay, setOverlay] = useState(null);
  const [focus, setFocus] = useState(null);
  const dark = data.settings.dark;
  const c = palette[dark ? 'dark' : 'light'];

  const go = (to, extra) => {
    if (to === 'leftovers' || to === 'settings') return setOverlay(to);
    setOverlay(null); setFocus(extra || null); setTab(to);
  };

  let body;
  if (!ready) body = <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}><ActivityIndicator color={c.accent} size="large" /></View>;
  else if (!user) body = <Auth />;
  else {
    const screen = overlay === 'leftovers' ? <Leftovers onBack={() => setOverlay(null)} />
      : overlay === 'settings' ? <Settings onBack={() => setOverlay(null)} />
      : tab === 'home' ? <Home go={go} open={setOverlay} />
      : tab === 'plan' ? <Planner />
      : tab === 'shop' ? <Grocery go={go} />
      : tab === 'spend' ? <Budget />
      : <Recipes focus={focus} />;
    body = (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={{ flex: 1 }}>{screen}</View>
        <View style={{ flexDirection: 'row', backgroundColor: c.card, borderTopWidth: 1, borderColor: c.line, paddingTop: 8, paddingBottom: Math.max(ins.bottom, 8) }}>
          {TABS.map(([k, label, icon]) => {
            const on = !overlay && tab === k;
            return (
              <Pressable key={k} onPress={() => go(k)} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
                <View style={{ paddingHorizontal: 16, paddingVertical: 5, borderRadius: 14, backgroundColor: on ? c.accent : 'transparent' }}>
                  <Ionicons name={on ? icon : icon + '-outline'} size={22} color={on ? c.accentInk : c.sub} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: on ? '700' : '500', color: on ? c.ink : c.sub }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
  return (
    <ThemeCtx.Provider value={{ c, dark }}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {body}
    </ThemeCtx.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Shell />
      </AppProvider>
    </SafeAreaProvider>
  );
}
