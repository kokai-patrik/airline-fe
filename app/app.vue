<script lang="ts" setup>
import { useStationsStore } from '~/stores/stations';

const stationsStore = useStationsStore();

const config = useRuntimeConfig();
const apiUrl = config.public.API;

if (import.meta.server && stationsStore.stations.length === 0) {
  const { data } = await useFetch(`${apiUrl}/stations`);

  const stationsData = data.value as any;

  if (stationsData?.data) {
    stationsStore.setStations(stationsData.data);
  }
}

useHead({
  title: 'Mito Airline',
  meta: [
    { name: 'description', content: 'A simple airline booking application.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
    },
  ],
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
