<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStationsStore } from '~/stores/stations';
import { useCartStore } from '~/features/Cart/stores/cart';
import type { CartItem } from '~/features/Cart/stores/cart';
import { useSelectFlight } from '~/features/SelectFlight/composables/useSelectFlight';

import SvgIcon from '~/components/SvgIcon.vue';
import PlaneIcon from '~/assets/svg/plane.svg';

import Summary from '~/features/SelectFlight/component/Summary.vue';
import FlightBox from '~/features/SelectFlight/component/FlightsBox.vue';
import FlightDates from '~/features/SelectFlight/component/FlightDates.vue';
import FaresGrid from '~/features/SelectFlight/component/FaresGrid.vue';
import InboundForm from '~/features/SelectFlight/component/InboundForm.vue';
import SummaryModal from '~/features/SelectFlight/component/Modal/SummaryModal.vue';

const route = useRoute();
const cartStore = useCartStore();
const { isModalOpen } = storeToRefs(cartStore);
const { getStationName } = useStationsStore();
const { getFareCharts } = useSelectFlight();

const departure = computed(() => (route.query.departure as string) || '');
const arrival = computed(() => (route.query.arrival as string) || '');
const from = computed(() => (route.query.from as string) || '');
const to = computed(() => (route.query.to as string) || '');

function handlingAddToCart(cartItem: CartItem) {
  cartStore.addToCart(cartItem);
}

const {
  data: outboundData,
  pending: outboundPending,
  error: outboundError,
} = await useAsyncData(
  'outbound',
  async () => {
    return await getFareCharts({
      departure: departure.value,
      arrival: arrival.value,
      date: from.value,
    });
  },
  {
    immediate: true,
    lazy: true,
    watch: [from],
  },
);

const {
  data: inboundData,
  pending: inboundPending,
  error: inboundError,
} = await useAsyncData(
  'inbound',
  async () => {
    return await getFareCharts({
      departure: arrival.value,
      arrival: departure.value,
      date: to.value,
    });
  },
  {
    immediate: true,
    lazy: true,
    watch: [to],
  },
);
</script>

<template>
  <div>
    <div class="flex h-[60px] w-full items-center gap-6 lg:gap-40 bg-primary px-5">
      <NuxtLink to="/" title="Mito Airline">
        <SvgIcon name="logo" class="h-8 w-8 text-white" />
      </NuxtLink>
      <div class="flex items-center gap-6 text-white">
        <div>
          <p class="text-[10px] uppercase">Leaving from</p>
          <p class="text-lg">{{ getStationName(departure) }}</p>
        </div>
        <div>
          <SvgIcon name="long-arrow-right" class="text-white" />
          <SvgIcon name="long-arrow-right" class="rotate-180 text-white" />
        </div>
        <div class="mt-auto">
          <p class="text-lg">{{ getStationName(arrival) }}</p>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-3 pb-10">
      <div class="flex w-full items-center justify-center gap-5 py-6 lg:py-10">
        <PlaneIcon class="h-6 w-6 lg:h-8 lg:w-8" />
        <h1 class="text-2xl font-light uppercase text-primary lg:text-4xl">Select Flight</h1>
      </div>
      <div class="grid gap-4 lg:grid-cols-4">
        <div class="lg:order-2 lg:col-span-3">
          <FlightBox
            :departure="getStationName(departure)"
            :arrival="getStationName(arrival)"
            title="Outbound"
            class="mb-8"
          >
            <template v-if="outboundPending">
              <p>Loading...</p>
            </template>
            <template v-else>
              <template v-if="outboundError">
                <p class="p-4 text-red-500">Error loading outbound flights.</p>
              </template>
              <template v-if="outboundData?.flights?.length === 0">
                <p class="p-4">No outbound flights found.</p>
              </template>
              <template v-if="outboundData?.flights?.length">
                <FlightDates
                  :current-date="from"
                  :prev-date="outboundData.prevDate"
                  :next-date="outboundData.nextDate"
                />
                <FaresGrid
                  :fares-data="outboundData.flights"
                  type="outbound"
                  @add-to-cart="handlingAddToCart"
                />
              </template>
            </template>
          </FlightBox>

          <FlightBox
            :departure="getStationName(arrival)"
            :arrival="getStationName(departure)"
            title="Inbound"
          >
            <template v-if="!inboundData?.flights?.length">
              <InboundForm
                :departure="arrival"
                :arrival="departure"
                :from="from"
              />
            </template>
            <template v-if="inboundData?.flights?.length">
              <template v-if="inboundPending">
                <p>Loading...</p>
              </template>
              <template v-else>
                <template v-if="inboundError">
                  <p class="p-4 text-red-500">Error loading inbound flights.</p>
                </template>
                <template v-if="inboundData?.flights?.length === 0">
                  <p class="p-4">No inbound flights found.</p>
                </template>
                <template v-if="inboundData?.flights?.length">
                  <FlightDates
                    :current-date="to"
                    :prev-date="inboundData.prevDate"
                    :next-date="inboundData.nextDate"
                  />
                  <FaresGrid
                    :fares-data="inboundData.flights"
                    type="inbound"
                    @add-to-cart="handlingAddToCart"
                  />
                </template>
              </template>
            </template>
          </FlightBox>
        </div>
        <div class="lg:order-1 lg:col-span-1">
          <Summary />
        </div>
      </div>
    </div>
    <SummaryModal :is-active="isModalOpen" />
  </div>
</template>
