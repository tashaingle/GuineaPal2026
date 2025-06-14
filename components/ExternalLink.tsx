import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet } from 'react-native';

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink(props: ExternalLinkProps) {
  const { href, children, style } = props;
  const colorScheme = useColorScheme();

  return (
    <Link href={href}>
      <Pressable
        onPress={async (event) => {
          event.preventDefault();
          await WebBrowser.openBrowserAsync(href);
        }}
        style={({ pressed }) => [
          styles.container,
          { opacity: pressed ? 0.5 : 1 },
          style,
        ]}
      >
        <ThemedView
          style={[
            styles.linkContainer,
            { backgroundColor: Colors[colorScheme].tint },
          ]}
        >
          <ThemedText style={styles.linkText}>{children}</ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  linkContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
