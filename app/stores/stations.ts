export const useStationsStore = defineStore('stations', () => {
  const stations = ref([]);

  const setStations = (data: any) => {
    stations.value = data;
  };

  return {
    stations,
    setStations,
  };
});
