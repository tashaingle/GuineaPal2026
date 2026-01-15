import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router/build/hooks';
import { RootStackParamList } from './types';

interface NavigationAdapterReturn<T extends keyof RootStackParamList> {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
}

export function useNavigationAdapter<T extends keyof RootStackParamList>(): NavigationAdapterReturn<T> {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pathname = usePathname();

  const navigation: NativeStackNavigationProp<RootStackParamList, T> = {
    navigate: (screen, params) => {
      router.push({
        pathname: `/${screen}`,
        params: params as Record<string, string>,
      });
    },
    goBack: () => router.back(),
    pop: () => router.back(),
    popToTop: () => router.replace('/'),
    push: (screen, params) => {
      router.push({
        pathname: `/${screen}`,
        params: params as Record<string, string>,
      });
    },
    replace: (screen, params) => {
      router.replace({
        pathname: `/${screen}`,
        params: params as Record<string, string>,
      });
    },
    addListener: (_event, _callback) => {
      // Not supported in expo-router
      return () => {};
    },
  };

  const route: RouteProp<RootStackParamList, T> = {
    key: 'current',
    name: pathname.replace('/', '') as T,
    params: params as RootStackParamList[T],
  };

  return { navigation, route };
} 