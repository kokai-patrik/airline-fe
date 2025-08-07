<script setup lang="ts">
import clsx from 'clsx';

import { FareBundle } from '~/types';
import type { Fare, Flight } from '~/types';
import type { CartItem } from '~/stores/cart';

import { useStationsStore } from '~/stores/stations';

import Button from '~/components/form/Button.vue';

import { formatPrice } from '~/utils/priceFormat';
import { getTime, getISODate } from '~/utils/helpers';

const props = defineProps<{
  faresData: Flight[];
  type: 'outbound' | 'inbound';
}>();

const emit = defineEmits<{
  (e: 'addToCart', cartItem: CartItem): void;
}>();

const stationsStore = useStationsStore();

const getButtonText = (fare: Fare) => {
  if (fare.remainingTickets === 0) {
    return 'Sold Out';
  }

  return formatPrice(fare.price.amount, fare.price.currencyCode);
};

function addToCart(fare: Fare, option: Flight) {
  const name = `${stationsStore.getStationName(option.departureStation)} – ${stationsStore.getStationName(option.arrivalStation)}`;
  const date = getISODate(new Date(option.departureDateTime));
  const id = `${date}-${props.type}-${fare.bundle}-${fare.price.amount}`;

  emit('addToCart', {
    type: props.type,
    id,
    name,
    price: fare.price.amount,
    date,
    travelTime: {
      departureDateTime: getTime(option.departureDateTime),
      arrivalDateTime: getTime(option.arrivalDateTime),
    },
  });
}

function getFareWrapperClass(fare: Fare) {
  return clsx(
    'flex flex-col items-center py-2 lg:py-6 row-start-2 lg:col-span-1 lg:row-start-1',
    {
      'bg-light-gray': fare.bundle === FareBundle.STANDARD,
    }
  );
}

function getBundleTextClass(index: number) {
  return clsx('text-[10px] font-bold uppercase mb-1', {
    'lg:hidden': index > 0,
  });
}
</script>

<template>
  <div
    v-for="(option, index) in faresData"
    :key="`${option.departureDateTime}-${option.arrivalDateTime}`"
    class="flex flex-col gap-2 lg:gap-0 border-b border-light-gray-3"
  >
    <div class="grid grid-cols-3 grid-rows-[auto_auto] lg:grid-cols-4 lg:grid-rows-1">
      <div class="flex items-center justify-center gap-2 py-1 lg:justify-start lg:px-4 w-full text-sm text-medium-gray font-light col-span-3 lg:col-span-1 lg:row-start-1">
        <p>{{ getTime(option.departureDateTime) }}</p>
        <SvgIcon name="arrow-right" class="text-medium-gray" />
        <p>{{ getTime(option.arrivalDateTime) }}</p>
      </div>

      <div
        v-for="fare in option.fares"
        :key="`${option.departureDateTime}-${fare.bundle}`"
        :class="getFareWrapperClass(fare)"
      >
        <p :class="getBundleTextClass(index)">
          {{ fare.bundle }}
        </p>
        <Button
          type="button"
          variant="secondary-outline"
          class="!font-bold"
          @click="addToCart(fare, option)"
        >
          {{ getButtonText(fare) }}
        </Button>
      </div>
    </div>
  </div>
</template>
