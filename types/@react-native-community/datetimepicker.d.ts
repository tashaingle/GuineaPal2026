declare module '@react-native-community/datetimepicker' {
  import { ComponentType } from 'react';
    import { ViewStyle } from 'react-native';

  export interface DateTimePickerProps {
    value: Date;
    mode?: 'date' | 'time' | 'datetime';
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    onChange?: (event: any, selectedDate?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
    style?: ViewStyle;
  }

  export const DateTimePicker: ComponentType<DateTimePickerProps>;
} 