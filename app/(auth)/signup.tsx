import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { PrimaryButton, TextField } from '@/components';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSignup() {
    setError(null);
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError('Fill in your name, email, and a password of at least 8 characters.');
      return;
    }
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (!data.session) {
      setConfirmationSent(true);
      return;
    }
    router.replace('/(tabs)');
  }

  if (confirmationSent) {
    return (
      <View style={[styles.confirmWrap, { paddingTop: insets.top + 80 }]}>
        <Text style={[typography.headlineLg, { color: colors.onSurface, textAlign: 'center' }]}>Check your email</Text>
        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }]}>
          We sent a confirmation link to {email}. Verify your email, then log in.
        </Text>
        <View style={{ marginTop: 24, width: '100%' }}>
          <PrimaryButton label="Back to log in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.surface }}
        contentContainerStyle={{ paddingTop: insets.top + 48, paddingBottom: 32, paddingHorizontal: spacing.margin }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[typography.headlineXl, { color: colors.onSurface }]}>Create your account</Text>
        <Text style={[typography.bodyMd, { color: colors.onSurfaceVariant, marginTop: 8 }]}>
          Start remembering everything you own.
        </Text>

        <View style={styles.form}>
          <TextField label="Full name" icon="badge" autoComplete="name" value={name} onChangeText={setName} placeholder="Sarah Khan" />
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
            autoComplete="password-new"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
          />
          {error ? <Text style={[typography.bodySm, { color: colors.error }]}>{error}</Text> : null}
          <PrimaryButton label="Create account" onPress={handleSignup} loading={loading} variant="dark" />
        </View>

        <View style={styles.footerRow}>
          <Text style={[typography.bodySm, { color: colors.onSurfaceVariant }]}>Already have an account?</Text>
          <Link href="/(auth)/login" style={{ marginLeft: 4 }}>
            <Text style={[typography.labelMd, { color: colors.secondary, fontWeight: '600' }]}>Log in</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 16 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  confirmWrap: { flex: 1, backgroundColor: colors.surface, paddingHorizontal: spacing.margin, alignItems: 'center' },
});
