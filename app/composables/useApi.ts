import type { UseFetchOptions } from 'nuxt/app'

export function useApi<T>(url: string, options: Partial<UseFetchOptions<T>> = {}) {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API;

  return useFetch(`${apiUrl}/${url}`, {
    ...options,
  });
}
