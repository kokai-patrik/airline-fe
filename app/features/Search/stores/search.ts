export const useSearchStore = defineStore(
  'search',
  () => {
    const origin = ref<string>('');
    const destination = ref<string>('');
    const departureDate = ref<Date | undefined>(undefined);
    const returnDate = ref<Date | undefined>(undefined);

    function setAllValues({
      origin: newOrigin,
      destination: newDestination,
      departureDate: newDepartureDate,
      returnDate: newReturnDate,
    }: {
      origin: string;
      destination: string;
      departureDate: Date;
      returnDate: Date | undefined;
    }) {
      origin.value = newOrigin;
      destination.value = newDestination;
      departureDate.value = newDepartureDate;
      returnDate.value = newReturnDate;
    }

    return {
      origin,
      destination,
      departureDate,
      returnDate,
      setAllValues,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  },
);
