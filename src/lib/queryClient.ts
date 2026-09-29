import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 1000 * 60 * 60 * 24, // keep a day of cache for offline reads
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Persists the query cache (assets, maintenance records, documents, prefs)
// to on-device storage so the app stays usable and shows last-known data
// while offline; queries revalidate automatically once connectivity returns.
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'fixbook-query-cache',
});
