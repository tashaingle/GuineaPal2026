import { ComponentType } from 'react';
import { ViewProps } from 'react-native';

export interface DateTimePickerEvent {
  type: 'set' | 'dismissed';
  nativeEvent: {
    timestamp?: number;
  };
}

export interface DateTimePickerProps extends ViewProps {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'calendar' | 'clock';
  onChange?: (event: DateTimePickerEvent, date?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  timeZoneOffsetInMinutes?: number;
  timeZoneOffsetInSeconds?: number;
  dayOfWeekFormat?: string;
  firstDayOfWeek?: number;
  textColor?: string;
  accentColor?: string;
  themeVariant?: 'light' | 'dark';
  locale?: string;
  neutralButtonLabel?: string;
  neutralButton?: {
    label: string;
    textColor?: string;
  };
  positiveButtonLabel?: string;
  positiveButton?: {
    label: string;
    textColor?: string;
  };
  negativeButtonLabel?: string;
  negativeButton?: {
    label: string;
    textColor?: string;
  };
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
  style?: any;
  disabled?: boolean;
  is24Hour?: boolean;
}

declare const DateTimePicker: ComponentType<DateTimePickerProps>;
export default DateTimePicker; 