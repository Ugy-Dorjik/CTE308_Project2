import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, flag, serif } from './theme';

// Signature element: a string of prayer flags along the top of every screen.
export const Bunting = () => (
  <View style={{ flexDirection: 'row', height: 7 }}>
    {flag.map((col, i) => (
      <View key={i} style={{ flex: 1, backgroundColor: col, borderBottomLeftRadius: i % 2 ? 0 : 7, borderBottomRightRadius: 7 }} />
    ))}
  </View>
);

export function Screen({ title, sub, onBack, right, children }) {
  const { c } = useTheme();
  const ins = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: ins.top }}>
      <Bunting />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          {onBack ? <IconBtn name="arrow-back" onPress={onBack} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: serif, fontSize: 32, fontWeight: '700', color: c.ink }}>{title}</Text>
            {sub ? <Text style={{ color: c.sub, fontSize: 14, marginTop: 2 }}>{sub}</Text> : null}
          </View>
          {right}
        </View>
        {children}
      </ScrollView>
    </View>
  );
}

export const Card = ({ children, style }) => {
  const { c } = useTheme();
  return <View style={[{ backgroundColor: c.card, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: c.line }, style]}>{children}</View>;
};

export function IconBtn({ name, onPress, color, bg }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, backgroundColor: bg || c.chip, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}>
      <Ionicons name={name} size={20} color={color || c.ink} />
    </Pressable>
  );
}

export function Btn({ title, onPress, icon, variant = 'primary', small, style }) {
  const { c } = useTheme();
  const bg = { primary: c.primary, accent: c.accent, ghost: c.chip, danger: c.danger }[variant];
  const fg = { primary: c.primaryInk, accent: c.accentInk, ghost: c.ink, danger: '#fff' }[variant];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ backgroundColor: bg, paddingVertical: small ? 9 : 14, paddingHorizontal: small ? 14 : 20, borderRadius: small ? 12 : 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: pressed ? 0.8 : 1 }, style]}>
      {icon ? <Ionicons name={icon} size={small ? 16 : 19} color={fg} /> : null}
      <Text style={{ color: fg, fontWeight: '700', fontSize: small ? 13 : 15 }}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, style, ...p }) {
  const { c } = useTheme();
  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <Text style={{ color: c.sub, fontSize: 13, fontWeight: '600' }}>{label}</Text> : null}
      <TextInput placeholderTextColor={c.sub} {...p} style={{ backgroundColor: c.bg, color: c.ink, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: c.line }} />
    </View>
  );
}

export function Chip({ label, active, onPress, dot, icon }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: active ? c.primary : c.chip }}>
      {dot ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dot }} /> : null}
      {icon ? <Ionicons name={icon} size={14} color={active ? c.primaryInk : c.ink} /> : null}
      <Text style={{ color: active ? c.primaryInk : c.ink, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

export function Check({ done, onPress }) {
  const { c } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: done ? c.ok : c.sub, backgroundColor: done ? c.ok : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {done ? <Ionicons name="checkmark" size={17} color="#fff" /> : null}
    </Pressable>
  );
}

export function Empty({ icon, title, text }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', padding: 28, gap: 8 }}>
      <Ionicons name={icon} size={38} color={c.sub} />
      <Text style={{ color: c.ink, fontWeight: '700', fontSize: 16 }}>{title}</Text>
      <Text style={{ color: c.sub, textAlign: 'center' }}>{text}</Text>
    </View>
  );
}

export function Sheet({ visible, title, onClose, children }) {
  const { c } = useTheme();
  const ins = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View style={{ flex: 1, backgroundColor: 'rgba(8,12,28,0.55)' }} />
        </Pressable>
        <View style={{ backgroundColor: c.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '88%', paddingBottom: ins.bottom + 8, overflow: 'hidden' }}>
          <Bunting />
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={{ flex: 1, fontFamily: serif, fontSize: 24, fontWeight: '700', color: c.ink }}>{title}</Text>
            <IconBtn name="close" onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 14 }}>{children}</ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function TimeField({ label, value, onCommit }) {
  const [t, setT] = useState(value);
  return (
    <Field label={label} value={t} placeholder="HH:MM" maxLength={5} keyboardType="numbers-and-punctuation" style={{ flex: 1 }}
      onChangeText={(v) => { setT(v); if (/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) onCommit(v); }} />
  );
}
