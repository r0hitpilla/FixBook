import React from 'react';
import { PrimaryButton, PrimaryButtonProps } from './PrimaryButton';

// Thin alias so screens can express intent (`<SecondaryButton />`) while
// sharing PrimaryButton's implementation and variant styles.
export function SecondaryButton(props: Omit<PrimaryButtonProps, 'variant'>) {
  return <PrimaryButton {...props} variant="secondary" />;
}
