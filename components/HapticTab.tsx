import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { ComponentProps } from 'react';
import { GestureResponderEvent } from 'react-native';

type HapticTabProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
  onPressIn?: (event: GestureResponderEvent) => void;
};

export function HapticTab(props: HapticTabProps): React.JSX.Element {
  const { onPressIn, children, style } = props;

  return (
    <PlatformPressable
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPressIn?.(ev);
      }}
      style={style}
    >
      {children}
    </PlatformPressable>
  );
}
