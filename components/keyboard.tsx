import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameButton } from './game-button';

export enum EButtonType {
  Digit = 'digit',
  Clear = 'clear',
  Enter = 'enter',
}

export interface IButton {
  type: EButtonType;
  text: string;
  value: number | string;
}

interface KeyboardProps {
  onButtonClick: (button: IButton) => void;
}

export function Keyboard({ onButtonClick }: KeyboardProps) {
  const values: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '<', 0, '='];
  
  const buttons: IButton[] = values.map((value) => ({
    type:
      value === '<'
        ? EButtonType.Clear
        : value === '='
        ? EButtonType.Enter
        : EButtonType.Digit,
    text: value.toString(),
    value,
  }));

  const getButtonType = (type: EButtonType): 'accent' | 'danger' | 'default' => {
    if (type === EButtonType.Enter) {
      return 'accent';
    }
    if (type === EButtonType.Clear) {
      return 'danger';
    }
    return 'default';
  };

  return (
    <View style={styles.keyboard}>
      {buttons.map((button, index) => (
        <View key={index} style={styles.buttonWrapper}>
          <GameButton
            type={getButtonType(button.type)}
            onPress={() => onButtonClick(button)}
          >
            {button.text}
          </GameButton>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
  },
  buttonWrapper: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 5,
  },
});

