import { storeToRefs } from 'pinia';

import type { Station } from '~/types';

import { useApi } from '~/composables/useApi';

import { useStationsStore } from '~/stores/stations';
import { useSearchStore } from '~/features/Search/stores/search';

export function useSearchForm() {
  const { origin } = storeToRefs(useSearchStore());
  const { stations } = storeToRefs(useStationsStore());

  const isStoreInitialized = ref<boolean>(false);

  const origins = stations.value.map((station: Station) => ({
    value: station.iata,
    label: station.shortName,
  }));

  const destinations = computed(() => {
    const selectedOrigin = origin.value;

    if (!selectedOrigin) {
      return [];
    }

    const originConnections =
      stations.value.find((station: Station) => station.iata === selectedOrigin)?.connections || [];

    return stations.value
      ?.map((station: Station) => {
        if (originConnections.includes(station.iata)) {
          return {
            value: station.iata,
            label: station.shortName,
          };
        }
        return null;
      })
      .filter(Boolean);
  });

  async function fetchDates(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string,
  ) {
    try {
      const response: any = await useApi('flight-dates', {
        method: 'GET',
        params: {
          departure: origin,
          arrival: destination,
          from: departureDate,
          to: returnDate,
        },
      });

      if (response?.data) {
        return response.data;
      }

      throw new Error('No data returned from API');
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while fetching flight dates',
      );
    }
  }

  return {
    fetchDates,
    isStoreInitialized,
    origins,
    destinations,
  };
}
