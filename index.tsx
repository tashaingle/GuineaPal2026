import { registerRootComponent } from 'expo';
import * as AppModule from './App';

const App = AppModule.default;

if (!App) {
  console.error('App import is undefined');
}

registerRootComponent(App);