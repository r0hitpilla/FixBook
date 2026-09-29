import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { PrimaryButton, TextField } from '@/components';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.surface }}
        contentContainerStyle={{ paddingTop: insets.top + 48, paddingBottom: 32, paddingHorizontal: spacing.margin }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[typography.headlineXl, { color: colors.onSurface }]}>Welcome back</Text>
        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: 8 }]}>
          Log in to pick up right where you left off.
        </Text>

        <View style={styles.form}>
          <TextField
            label="Email"
            icon="mail"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            icon="lock"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />
          {error ? <Text style={[typography.bodySm, { color: colors.error }]}>{error}</Text> : null}
          <PrimaryButton label="Log in" onPress={handleLogin} loading={loading} variant="dark" />
        </View>

        <View style={styles.footerRow}>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>New to FixBook?</Text>
          <Link href="/(auth)/signup" style={{ marginLeft: 4 }}>
            <Text style={[typography.labelMd, { color: colors.secondary, fontWeight: '600' }]}>Create an account</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 16 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
});
