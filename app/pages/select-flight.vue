<script setup lang="ts">
import { useStationsStore } from '~/stores/stations';
import { useCartStore } from '~/stores/cart';
import type { CartItem } from '~/stores/cart';
import { useSelectFlight } from '~/features/SelectFlight/composables/useSelectFlight';

import SvgIcon from '~/components/SvgIcon.vue';
import PlaneIcon from '~/assets/svg/plane.svg';

import Summary from '~/features/SelectFlight/component/Summary.vue';
import FlightBox from '~/features/SelectFlight/component/FlightsBox.vue';
import FlightDates from '~/features/SelectFlight/component/FlightDates.vue';
import FaresGrid from '~/features/SelectFlight/component/FaresGrid.vue';
import InboundForm from '~/features/SelectFlight/component/InboundForm.vue';

const route = useRoute();
const cartStore = useCartStore();
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
    })
  },
  {
    immediate: true,
    lazy: true,
    watch: [from],
  }
)

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
    })
  },
  {
    immediate: true,
    lazy: true,
    watch: [to],
  }
)
</script>

<template>
  <div>
    <div class="flex items-center gap-10 w-full h-[60px] px-5 bg-primary">
      <NuxtLink
        to="/"
        title="Mito Airline"
      >
        <SvgIcon
          name="logo"
          class="w-8 h-8 text-white"
        />
      </NuxtLink>
      <div class="flex items-center gap-6 text-white">
        <div>
          <p class="text-[0.7rem] uppercase">Leaving from</p>
          <p>{{ getStationName(departure) }}</p>
        </div>
        <div>
          <SvgIcon name="long-arrow-right" class="text-white" />
          <SvgIcon name="long-arrow-right" class="text-white rotate-180" />
        </div>
        <div class="mt-auto">{{ getStationName(arrival) }}</div>
      </div>
    </div>
    <div class="container mx-auto pb-10 px-3">
      <div class="flex items-center justify-center w-full gap-5 py-6 lg:py-10">
        <PlaneIcon class="w-6 h-6 lg:w-8 lg:h-8" />
        <h1 class="text-primary text-2xl lg:text-4xl font-light uppercase">
          Select Flight
        </h1>
      </div>
      <div class="grid lg:grid-cols-4 gap-4">
        <div class="lg:col-span-3 lg:order-2">
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
                <p class="text-red-500">Error loading outbound flights.</p>
              </template>
              <template v-if="outboundData?.length === 0">
                <p>No outbound flights found.</p>
              </template>
              <template v-if="outboundData?.length">
                <FlightDates
                  :currentDate="from"
                />
                <FaresGrid
                  :faresData="outboundData"
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
            <template v-if="inboundData?.length === 0">
              <InboundForm
                :departure="arrival"
                :arrival="departure"
                :from="from"
              />
            </template>
            <template v-if="inboundData?.length">
              <template v-if="inboundPending">
                <p>Loading...</p>
              </template>
              <template v-else>
                <template v-if="inboundError">
                  <p>Error loading inbound flights.</p>
                </template>
                <template v-if="inboundData?.length === 0">
                  <p>No inbound flights found.</p>
                </template>
                <template v-if="inboundData?.length">
                  <FlightDates
                    :currentDate="to"
                  />
                  <FaresGrid
                    :faresData="inboundData"
                    type="inbound"
                    @add-to-cart="handlingAddToCart"
                  />
                </template>
              </template>
            </template>
          </FlightBox>
        </div>
        <div class="lg:col-span-1 lg:order-1">
          <Summary />
        </div>
      </div>
    </div>
  </div>
</template>
