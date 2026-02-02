import { AuthStack } from '@/app/navigation/AuthStack';
import { DeepLinkHandler } from '@/app/navigation/DeepLinkHandler';
import { TabNavigator } from '@/app/navigation/TabNavigator';
import { useAuth } from '@/features/auth/hooks/useAuth';
import CustomSplashScreen from '@/shared/components/CustomSplashScreen';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

const queryClient = new QueryClient();

export const AppNavigator: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigationRef = useNavigationContainerRef();
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setIsInitialized(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash && !isInitialized) {
    return <CustomSplashScreen />;
  }

  if (authLoading && !isInitialized) {
    return <CustomSplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef}>
        {user ? (
          <>
            <TabNavigator />
            <DeepLinkHandler navigation={navigationRef} />
          </>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </QueryClientProvider>
  );
};
