declare module 'react-native-paper' {
  import { ComponentType } from 'react';
    import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface ButtonProps {
    mode?: 'text' | 'outlined' | 'contained';
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
    labelStyle?: TextStyle;
    contentStyle?: ViewStyle;
    children?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
  }

  export interface TextInputProps {
    value?: string;
    onChangeText?: (text: string) => void;
    style?: ViewStyle | ViewStyle[];
    label?: string;
    mode?: 'flat' | 'outlined';
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    placeholder?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    left?: React.ReactNode;
    right?: React.ReactNode;
  }

  export interface TextInputIconProps {
    icon: string;
    color?: string;
    onPress?: () => void;
  }

  export interface CardProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }

  export interface CardContentProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }

  export interface CardTitleProps {
    title?: string;
    subtitle?: string;
    style?: ViewStyle;
  }

  export interface CheckboxProps {
    status?: 'checked' | 'unchecked';
    onPress?: () => void;
    color?: string;
  }

  export interface FABProps {
    icon?: string;
    onPress?: () => void;
    style?: ViewStyle | ViewStyle[];
    label?: string;
    color?: string;
    labelStyle?: TextStyle;
  }

  export interface FABGroupProps {
    visible?: boolean;
    open?: boolean;
    icon?: string;
    label?: string;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    onPress?: () => void;
    color?: string;
    fabStyle?: StyleProp<ViewStyle>;
    actions?: {
      icon: string;
      label: string;
      onPress: () => void;
      labelStyle?: StyleProp<TextStyle>;
      style?: StyleProp<ViewStyle>;
    }[];
    onStateChange?: ({ open }: { open: boolean }) => void;
    children?: React.ReactNode;
  }

  export interface PortalProps {
    children?: React.ReactNode;
  }

  export interface ProviderProps {
    children?: React.ReactNode;
  }

  export interface ChipProps {
    onPress?: () => void;
    children?: React.ReactNode;
    selected?: boolean;
    selectedColor?: string;
    showSelectedCheck?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
  }

  export interface IconButtonProps {
    icon?: string;
    onPress?: () => void;
    iconColor?: string;
    size?: number;
  }

  export interface SegmentedButtonsProps {
    value?: string;
    onValueChange?: (value: string) => void;
    buttons: Array<{
      value: string;
      label: string;
      disabled?: boolean;
    }>;
  }

  export interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  }

  export interface ProgressBarProps {
    progress?: number;
    color?: string;
    style?: ViewStyle;
  }

  export interface RadioButtonProps {
    value: string;
    status?: 'checked' | 'unchecked';
    onPress?: () => void;
  }

  export interface RadioButtonItemProps {
    label: string;
    value: string;
    status?: 'checked' | 'unchecked';
    onPress?: () => void;
  }

  export interface RadioButtonGroupProps {
    onValueChange?: (value: string) => void;
    value?: string;
    children?: React.ReactNode;
  }

  export const Button: ComponentType<ButtonProps>;
  export const TextInput: ComponentType<TextInputProps> & {
    Icon: ComponentType<TextInputIconProps>;
  };
  export const Card: ComponentType<CardProps> & {
    Content: ComponentType<CardContentProps>;
    Title: ComponentType<CardTitleProps>;
  };
  export const Checkbox: ComponentType<CheckboxProps> & {
    Android: ComponentType<CheckboxProps>;
  };
  export const FAB: ComponentType<FABGroupProps> & {
    Group: ComponentType<FABGroupProps>;
  };
  export const Portal: ComponentType<PortalProps>;
  export const Provider: ComponentType<ProviderProps>;
  export const Chip: ComponentType<ChipProps>;
  export const IconButton: ComponentType<IconButtonProps>;
  export const SegmentedButtons: ComponentType<SegmentedButtonsProps>;
  export const Text: ComponentType<TextProps>;
  export const ProgressBar: ComponentType<ProgressBarProps>;
  export const RadioButton: ComponentType<RadioButtonProps> & {
    Item: ComponentType<RadioButtonItemProps>;
    Group: ComponentType<RadioButtonGroupProps>;
  };
} 