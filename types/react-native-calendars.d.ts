declare module 'react-native-calendars' {
  import { ComponentType } from 'react';
    import { ViewStyle } from 'react-native';

  export interface DateData {
    dateString: string;
    day: number;
    month: number;
    year: number;
    timestamp: number;
  }

  export interface CalendarTheme {
    backgroundColor?: string;
    calendarBackground?: string;
    textSectionTitleColor?: string;
    selectedDayBackgroundColor?: string;
    selectedDayTextColor?: string;
    todayTextColor?: string;
    dayTextColor?: string;
    textDisabledColor?: string;
    dotColor?: string;
    selectedDotColor?: string;
    arrowColor?: string;
    monthTextColor?: string;
    textDayFontSize?: number;
    textMonthFontSize?: number;
    textDayHeaderFontSize?: number;
    textMonthFontWeight?: string;
  }

  export interface CalendarProps {
    current?: string;
    minDate?: string;
    maxDate?: string;
    onDayPress?: (day: DateData) => void;
    onDayLongPress?: (day: DateData) => void;
    onMonthChange?: (date: DateData) => void;
    onPressArrowLeft?: (month: DateData) => void;
    onPressArrowRight?: (month: DateData) => void;
    enableSwipeMonths?: boolean;
    hideExtraDays?: boolean;
    disableAllTouchEventsForDisabledDays?: boolean;
    disableAllTouchEventsForInactiveDays?: boolean;
    hideArrows?: boolean;
    renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
    hideDayNames?: boolean;
    showWeekNumbers?: boolean;
    disableArrowLeft?: boolean;
    disableArrowRight?: boolean;
    disabledByDefault?: boolean;
    disabledDaysIndexes?: number[];
    firstDay?: number;
    markedDates?: {
      [date: string]: {
        selected?: boolean;
        disabled?: boolean;
        disableTouchEvent?: boolean;
        selectedColor?: string;
        selectedTextColor?: string;
        marked?: boolean;
        dotColor?: string;
        dots?: Array<{
          color: string;
          key: string;
        }>;
      };
    };
    theme?: CalendarTheme;
    style?: ViewStyle;
  }

  export const Calendar: ComponentType<CalendarProps>;
} 