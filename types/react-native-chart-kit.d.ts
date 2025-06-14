declare module 'react-native-chart-kit' {
  import { ComponentType } from 'react';
    import { ViewStyle } from 'react-native';

  export interface LineChartProps {
    data: {
      labels: string[];
      datasets: Array<{
        data: number[];
        color?: (opacity: number) => string;
        strokeWidth?: number;
      }>;
    };
    width: number;
    height: number;
    chartConfig: {
      backgroundColor?: string;
      backgroundGradientFrom?: string;
      backgroundGradientTo?: string;
      decimalPlaces?: number;
      color?: (opacity: number) => string;
      labelColor?: (opacity: number) => string;
      style?: ViewStyle;
      propsForDots?: {
        r?: string;
        strokeWidth?: string;
        stroke?: string;
      };
    };
    bezier?: boolean;
    style?: ViewStyle;
  }

  export const LineChart: ComponentType<LineChartProps>;
} 