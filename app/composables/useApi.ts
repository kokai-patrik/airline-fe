export async function useApi<T = any>(endpoint: string, options?: any): Promise<T> {
  const config = useRuntimeConfig();
  const apiUrl = config.public.API;

  return $fetch<T>(`${apiUrl}/${endpoint}`, options);
}
