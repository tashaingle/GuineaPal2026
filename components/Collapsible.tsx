import React, { useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type CollapsibleProps = {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
};

export function Collapsible({
  title,
  children,
  initiallyExpanded = false,
}: CollapsibleProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));
  const theme = useColorScheme();

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <IconSymbol
          name="chevron-forward"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={[
            styles.icon,
            {
              transform: [
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '90deg'],
                  }),
                },
              ],
            },
          ]}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.content,
          {
            maxHeight: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1000],
            }),
            opacity: animation,
          },
        ]}
      >
        {children}
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 8,
  },
  content: {
    overflow: 'hidden',
  },
});
