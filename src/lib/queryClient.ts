import {
  QueryClient,
  dehydrate,
  hydrate,
  type DehydratedState,
} from '@tanstack/react-query';

const QUERY_CACHE_KEY = 'observaapp:query-cache:v1';
const QUERY_CACHE_TTL_MS = 30 * 60 * 1000;

interface PersistedQueryCache {
  timestamp: number;
  state: DehydratedState;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const restorePersistedQueryCache = () => {
  if (!canUseStorage()) return;

  const raw = window.localStorage.getItem(QUERY_CACHE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as PersistedQueryCache;
    const isExpired = Date.now() - parsed.timestamp > QUERY_CACHE_TTL_MS;

    if (isExpired) {
      window.localStorage.removeItem(QUERY_CACHE_KEY);
      return;
    }

    hydrate(queryClient, parsed.state);
  } catch {
    window.localStorage.removeItem(QUERY_CACHE_KEY);
  }
};

export const setupQueryCachePersistence = () => {
  if (!canUseStorage()) return () => {};

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const unsubscribe = queryClient.getQueryCache().subscribe(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const state = dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => query.state.status === 'success',
      });

      const payload: PersistedQueryCache = {
        timestamp: Date.now(),
        state,
      };

      window.localStorage.setItem(QUERY_CACHE_KEY, JSON.stringify(payload));
    }, 400);
  });

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    unsubscribe();
  };
};

export const clearPersistedQueryCache = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(QUERY_CACHE_KEY);
};
