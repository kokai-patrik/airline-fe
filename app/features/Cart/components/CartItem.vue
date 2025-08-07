<script setup lang="ts">
import type { CartItem } from '~/features/Cart/stores/cart';

import { getDay, getMonth } from '~/helpers/datetime';

defineProps<{
  cartItem: CartItem;
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-[40px] h-[46px] border-2 border-light-gray-4 rounded-sm">
      <p class="bg-light-gray text-[13px] uppercase text-center font-bold">
        {{ getMonth(cartItem.date, 'short') }}
      </p>
      <p class="pt-[3px] text-lg text-center font-bold leading-none">
        {{ getDay(cartItem.date, 'numeric') }}
      </p>
    </div>
    <div class="flex flex-col">
      <p class="text-base font-bold leading-none">
        {{ cartItem.name }}
      </p>
      <p class="text-[10px] font-semibold">
        {{ getDay(cartItem.date, 'short') }} {{ cartItem.travelTime.departureDateTime }} - {{ cartItem.travelTime.arrivalDateTime }}
      </p>
    </div>
  </div>
</template>
