import { useApi } from '~/composables/useApi';

import type { ApiResponse, Flight } from '~/types';

export function useSelectFlight() {
  async function getFareCharts({
    departure,
    arrival,
    date,
  }: {
    departure: string;
    arrival: string;
    date: string;
  }) {
    try {
      const response: ApiResponse<Flight[]> = await useApi('fare-charts', {
        method: 'GET',
        params: {
          departure,
          arrival,
          date,
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
    getFareCharts,
  };
}
