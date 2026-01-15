import { useThemeColor } from '@/hooks/useThemeColor';
import { commonStyles } from '@/theme/styles';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText(props: ThemedTextProps): React.ReactElement {
  const { style, lightColor, darkColor, type = 'default', ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getTextStyle = (): TextStyle => {
    switch (type) {
      case 'title':
        return commonStyles.heading;
      case 'defaultSemiBold':
        return commonStyles.label;
      case 'subtitle':
        return commonStyles.subheading;
      case 'link':
        return commonStyles.link;
      default:
        return commonStyles.text;
    }
  };

  return (
    <Text
      style={[getTextStyle(), { color }, style]}
      {...otherProps}
    />
  );
} 