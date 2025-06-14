declare module '@react-native-community/datetimepicker' {
  import { ComponentType } from 'react';

  export interface DateTimePickerProps {
    value: Date;
    mode?: 'date' | 'time' | 'datetime';
    display?: 'default' | 'spinner' | 'calendar' | 'clock';
    onChange?: (event: any, selectedDate?: Date) => void;
    minimumDate?: Date;
    maximumDate?: Date;
  }

  const DateTimePicker: ComponentType<DateTimePickerProps>;
  export default DateTimePicker;
} 