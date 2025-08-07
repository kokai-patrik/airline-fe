<script setup lang="ts">
import clsx from 'clsx';

import { FareBundle } from '~/types';
import type { Fare, Flight } from '~/types';
import type { CartItem } from '~/features/Cart/stores/cart';

import { useCartStore } from '~/features/Cart/stores/cart';
import { useStationsStore } from '~/stores/stations';

import Button from '~/components/form/Button.vue';

import { formatPrice } from '~/utils/priceFormat';
import { getTime, getISODate } from '~/helpers/datetime';
import { getCartItemId } from '~/features/Cart/helpers/cart';

const props = defineProps<{
  faresData: Flight[];
  type: 'outbound' | 'inbound';
}>();

const emit = defineEmits<{
  (e: 'addToCart', cartItem: CartItem): void;
}>();

const { isInCart } = useCartStore();
const stationsStore = useStationsStore();

const getButtonText = (fare: Fare) => {
  if (fare.remainingTickets === 0) {
    return 'Sold Out';
  }

  return formatPrice(fare.price.amount, fare.price.currencyCode);
};

function addToCart(fare: Fare, option: Flight) {
  const date = getISODate(new Date(option.departureDateTime));

  emit('addToCart', {
    type: props.type,
    id: getCartItemId(fare, option, props.type),
    name: `${stationsStore.getStationName(option.departureStation)} – ${stationsStore.getStationName(option.arrivalStation)}`,
    price: fare.price.amount,
    date,
    travelTime: {
      departureDateTime: getTime(option.departureDateTime),
      arrivalDateTime: getTime(option.arrivalDateTime),
    },
  });
}

function getFareWrapperClass(fare: Fare) {
  return clsx('flex flex-col items-center py-2 lg:py-6 row-start-2 lg:col-span-1 lg:row-start-1', {
    'bg-light-gray': fare.bundle === FareBundle.STANDARD,
  });
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
    class="flex flex-col gap-2 border-b border-light-gray-3 lg:gap-0"
  >
    <div class="grid grid-cols-3 grid-rows-[auto_auto] lg:grid-cols-[120px_1fr_1fr_1fr] lg:grid-rows-1">
      <div
        class="col-span-3 flex w-full items-center justify-center gap-2 py-1 text-sm font-light text-medium-gray lg:col-span-1 lg:row-start-1 lg:justify-start lg:px-4"
      >
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
          :class="['!font-bold', {
            '!bg-secondary text-white': isInCart(getCartItemId(fare, option, props.type)),
          }]"
          :disabled="fare.remainingTickets === 0"
          @click="addToCart(fare, option)"
        >
          {{ getButtonText(fare) }}
        </Button>
      </div>
    </div>
  </div>
</template>
