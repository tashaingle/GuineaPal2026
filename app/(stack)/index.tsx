import { useRouter } from 'expo-router/build/hooks';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(stack)/pet-list');
  }, [router]);

  return null;
} 