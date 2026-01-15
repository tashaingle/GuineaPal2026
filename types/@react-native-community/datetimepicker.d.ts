declare module '@react-native-community/datetimepicker' {
  import React from 'react';
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

  const DateTimePicker: React.FC<DateTimePickerProps>;
  export default DateTimePicker;
} 