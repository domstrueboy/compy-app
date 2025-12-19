import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonType = 'accent' | 'danger' | 'default';

interface GameButtonProps {
  type?: ButtonType;
  onPress: () => void;
  children: React.ReactNode;
}

export function GameButton({ type = 'default', onPress, children }: GameButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[type]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dddddd',
    borderRadius: 10,
  },
  default: {
    backgroundColor: '#dddddd',
  },
  accent: {
    backgroundColor: '#90EE90',
  },
  danger: {
    backgroundColor: '#F08080',
  },
  text: {
    color: '#333333',
    fontSize: 24,
    fontWeight: '500',
  },
});

