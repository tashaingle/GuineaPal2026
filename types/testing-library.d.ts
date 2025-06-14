declare module '@testing-library/react-native' {
  import { RenderOptions } from '@testing-library/react';
    import { ReactElement } from 'react';

  export interface RenderResult extends RenderOptions {
    container: HTMLElement;
    debug: (baseElement?: HTMLElement) => void;
    rerender: (ui: ReactElement) => void;
    unmount: () => void;
    asFragment: () => DocumentFragment;
  }

  export function render(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'queries'>
  ): RenderResult;

  export const screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    getByTestId: (testId: string) => HTMLElement;
    getByPlaceholderText: (text: string | RegExp) => HTMLElement;
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryByTestId: (testId: string) => HTMLElement | null;
    queryByPlaceholderText: (text: string | RegExp) => HTMLElement | null;
  };

  export const fireEvent: {
    press: (element: HTMLElement) => void;
    change: (element: HTMLElement, value: string) => void;
    scroll: (element: HTMLElement, options: { contentOffset: { x: number; y: number } }) => void;
  };

  export function waitFor(
    callback: () => void | Promise<void>,
    options?: {
      timeout?: number;
      interval?: number;
    }
  ): Promise<void>;

  export function act(callback: () => void | Promise<void>): Promise<void>;
} 