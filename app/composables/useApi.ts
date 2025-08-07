import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack/types';

export async function useApi<T>(endpoint: string, options?: NitroFetchOptions<NitroFetchRequest>): Promise<T> {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API;

  return $fetch<T>(`${apiUrl}/${endpoint}`, options);
}
