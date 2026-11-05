import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, serif } from '../theme';
import { useApp } from '../store';
import { Bunting, Btn, Field } from '../ui';

export default function Auth() {
  const { c } = useTheme();
  const { login, register } = useApp();
  const ins = useSafeAreaInsets();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true); setErr('');
    const e = mode === 'login' ? await login(email, pw) : await register(name, email, pw);
    if (e) setErr(e);
    setBusy(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: ins.top }}>
      <Bunting />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, gap: 16, flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
            <View style={{ width: 62, height: 62, borderRadius: 31, borderWidth: 3, borderColor: c.accentInk, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="restaurant" size={28} color={c.accentInk} />
            </View>
          </View>
          <Text style={{ fontFamily: serif, fontSize: 40, fontWeight: '700', color: c.ink, lineHeight: 44 }}>Hostel{'\n'}Meal Planner</Text>
          <Text style={{ color: c.sub, fontSize: 15 }}>Plan the week, shop once, spend less, waste nothing.</Text>

          {mode === 'register' ? <Field label="Your name" value={name} onChangeText={setName} placeholder="Tshering" /> : null}
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@rub.edu.bt" autoCapitalize="none" keyboardType="email-address" />
          <Field label="Password" value={pw} onChangeText={setPw} placeholder="At least 6 characters" secureTextEntry autoCapitalize="none" />
          {err ? <Text style={{ color: c.danger, fontWeight: '600' }}>{err}</Text> : null}
          <Btn title={busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'} variant="accent" onPress={submit} />
          <Btn title={mode === 'login' ? 'New here? Create an account' : 'Have an account? Log in'} variant="ghost" onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
