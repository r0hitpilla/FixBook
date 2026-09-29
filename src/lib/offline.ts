import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { queryClient } from './queryClient';

// Wires TanStack Query's online/offline detection to the device's real
// network state, and resumes any mutations that were paused while offline
// (see mutations in src/hooks, which set `networkMode: 'offlineFirst'`) so a
// maintenance record or asset saved without a connection is retried
// automatically instead of being lost.
export function setupOfflineSync() {
  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      setOnline(isOnline);
      if (isOnline) {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }
    });
  });
}
