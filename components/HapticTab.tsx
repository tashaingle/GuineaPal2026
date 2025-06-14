import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { GestureResponderEvent } from 'react-native';

type HapticTabProps = {
  onPressIn?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: any;
};

export function HapticTab(props: HapticTabProps) {
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
