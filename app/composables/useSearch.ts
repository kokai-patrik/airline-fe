import { useApi } from '~/composables/useApi';

export function useSearch() {
  async function fetchDates(origin: string, destination: string, departureDate: string, returnDate: string) {
    try {
      const { data, error } = await useApi('flight-dates', {
        method: 'GET',
        params: {
          departure: origin,
          arrival: destination,
          from: departureDate,
          to: returnDate,
        },
      });

      if (error.value) {
        throw new Error(`Error fetching flight dates: ${error.value.message}`);
      }

      const response: any = data.value;

      if (response?.data) {
        return response.data;
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'An unknown error occurred while fetching flight dates');
    }
  }

  return {
    fetchDates,
  };
}
