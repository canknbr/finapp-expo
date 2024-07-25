import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { UserInactivityProvider } from '@/context/InactivityContext';

const queryClient = new QueryClient();
WebBrowser.maybeCompleteAuthSession();
SplashScreen.preventAutoHideAsync();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
const InitialLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isLoaded, isSignedIn } = useAuth();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (isSignedIn && !inAuthGroup) {
      router.replace('(auth)/(modals)/lock');
    } else if (!isSignedIn) {
      router.replace('/');
    }
  }, [isSignedIn]);

  if (!loaded || !isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <ActivityIndicator size={'large'} color={Colors.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href={'/help'} asChild>
              <TouchableOpacity>
                <Ionicons
                  name="help-circle-outline"
                  size={34}
                  color={Colors.dark}
                />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: 'Help',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="(auth)/(tabs)"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="(auth)/(modals)/lock"
        options={{
          headerShown: false,
        }}
      />
        <Stack.Screen
        name="(auth)/(modals)/account"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)/crypto/[id]"
        options={{
          headerLargeTitle: true,
          headerTransparent: true,

          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity>
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color={Colors.dark}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="star-outline" size={30} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          title: '',
          headerBackTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <UserInactivityProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <InitialLayout />
        </GestureHandlerRootView>
        </UserInactivityProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};
export default RootLayoutNav;
