import type { Station } from '~/types';

export const useStationsStore = defineStore('stations', () => {
  const stations = ref<Station[]>([]);

  const setStations = (data: Station[]) => {
    stations.value = data;
  };

  const getStationName = (iata: string): string => {
    const station = stations.value.find((station) => station.iata === iata);
    return station ? station.shortName : iata;
  };

  return {
    stations,
    setStations,
    getStationName,
  };
});
