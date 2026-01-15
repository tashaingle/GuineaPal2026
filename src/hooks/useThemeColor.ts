import { colors } from '@/theme/colors';
import { useColorScheme } from 'react-native';

type ColorProps = {
  light?: string;
  dark?: string;
};

type ThemeType = 'light' | 'dark';

export function useThemeColor(
  props: ColorProps,
  colorName: keyof typeof colors
): string {
  const theme = useColorScheme() as ThemeType;
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  return colors[colorName] as string;
} 