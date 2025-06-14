import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Text, TextProps } from 'react-native';

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText(props: ThemedTextProps) {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? { fontSize: 16 } : {},
        type === 'title' ? { fontSize: 32, fontWeight: 'bold' } : {},
        type === 'defaultSemiBold' ? { fontSize: 16, fontWeight: '600' } : {},
        type === 'subtitle' ? { fontSize: 20, fontWeight: '600' } : {},
        type === 'link' ? { fontSize: 16, color: '#0A7EA4' } : {},
        style,
      ]}
      {...otherProps}
    />
  );
} 