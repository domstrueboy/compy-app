import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IButton, Keyboard } from './keyboard';

export enum EOperation {
  Add = '+',
  Subtract = '-',
  Multiply = '×',
  Divide = '÷',
}

const ANSWER_DELAY = 1000;
const STORAGE_KEY = 'maxStreak';

const getRandomInt = (min: number = 1, max: number = 9): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function MathGame() {
  const [a, setA] = useState(getRandomInt());
  const [b, setB] = useState(getRandomInt());
  const [operation] = useState<EOperation>(EOperation.Multiply);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Load max streak from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        setMaxStreak(parseInt(value, 10));
      }
    });
  }, []);

  // Calculate correct answer
  const correctAnswer = useCallback(() => {
    switch (operation) {
      case EOperation.Add:
        return a + b;
      case EOperation.Subtract:
        return a - b;
      case EOperation.Multiply:
        return a * b; // Using regular JS multiplication instead of WASM
      case EOperation.Divide:
        return a / b;
      default:
        return 0;
    }
  }, [a, b, operation]);

  // Save max streak when it changes
  useEffect(() => {
    if (streak > maxStreak) {
      const newMaxStreak = streak;
      setMaxStreak(newMaxStreak);
      AsyncStorage.setItem(STORAGE_KEY, newMaxStreak.toString());
    }
  }, [streak, maxStreak]);

  const checkAnswer = async () => {
    const correct = parseInt(answer, 10) === correctAnswer();
    setIsCorrect(correct);
    
    if (correct) {
      setStreak((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, ANSWER_DELAY));
      setA(getRandomInt());
      setB(getRandomInt());
    } else {
      setStreak(0);
      await new Promise((resolve) => setTimeout(resolve, ANSWER_DELAY));
    }
    
    setAnswer('');
    setIsCorrect(null);
  };

  const handleButtonClick = (button: IButton) => {
    if (button.type === 'digit') {
      setAnswer((prev) => prev + button.value);
    } else if (button.type === 'clear') {
      setAnswer((prev) => prev.slice(0, -1));
    } else if (button.type === 'enter') {
      checkAnswer();
    }
  };

  const getEquationStyle = () => {
    if (isCorrect === true) {
      return [styles.equation, styles.correct];
    }
    if (isCorrect === false) {
      return [styles.equation, styles.error];
    }
    return styles.equation;
  };

  return (
    <View style={styles.container}>
      <View style={styles.streakWrapper}>
        <View style={styles.streak}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={[styles.streakNumber, { marginLeft: 4 }]}>{streak}</Text>
          <Text style={[styles.streakTitle, { marginLeft: 4 }]}>подряд</Text>
        </View>

        <View style={styles.streak}>
          <Text style={styles.streakEmoji}>🏅</Text>
          <Text style={[styles.streakNumber, { marginLeft: 4 }]}>{maxStreak}</Text>
          <Text style={[styles.streakTitle, { marginLeft: 4 }]}>рекорд</Text>
        </View>
      </View>

      <Text style={getEquationStyle()}>
        {a} {operation} {b} = {answer}
      </Text>

      <View style={styles.message}>
        {isCorrect === true && (
          <Text style={styles.correctText}>Правильно!</Text>
        )}
        {isCorrect === false && (
          <Text style={styles.errorText}>Неправильно! Попробуй ещё раз!</Text>
        )}
      </View>

      <View style={{ marginTop: 16, marginBottom: 16 }}>
        <Keyboard onButtonClick={handleButtonClick} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  equation: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 8,
  },
  correct: {
    color: '#90EE90',
  },
  error: {
    color: '#FF6B6B',
  },
  message: {
    height: 24,
    marginBottom: 8,
  },
  correctText: {
    color: '#90EE90',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  streakWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 10,
  },
  streak: {
    color: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  streakEmoji: {
    fontSize: 32,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '500',
  },
  streakTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
});

