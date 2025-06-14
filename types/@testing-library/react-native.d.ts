declare module '@testing-library/react-native' {
  import { ReactElement } from 'react';

  export interface RenderResult {
    getByText: (text: string) => any;
    getByTestId: (testId: string) => any;
    getByPlaceholderText: (text: string) => any;
    queryByText: (text: string) => any;
    queryByTestId: (testId: string) => any;
    queryByPlaceholderText: (text: string) => any;
    debug: () => void;
  }

  export function render(component: ReactElement): RenderResult;
  export function fireEvent(element: any, eventName: string, eventData?: any): void;
} 