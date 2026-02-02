import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

interface NetworkStatus {
  isConnected: boolean | null;
  type: string;
  details: NetInfoState['details'];
  isInternetReachable: boolean | null;
}

export const useNetworkStatus = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: null,
    type: 'unknown',
    details: null,
    isInternetReachable: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus({
        isConnected: state.isConnected,
        type: state.type,
        details: state.details,
        isInternetReachable: state.isInternetReachable,
      });
    });

    NetInfo.fetch().then(state => {
      setNetworkStatus({
        isConnected: state.isConnected,
        type: state.type,
        details: state.details,
        isInternetReachable: state.isInternetReachable,
      });
    });

    return unsubscribe;
  }, []);

  return networkStatus;
};
