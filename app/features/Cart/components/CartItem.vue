<script setup lang="ts">
import type { CartItem } from '~/features/Cart/stores/cart';

import { getDay, getMonth } from '~/helpers/datetime';

defineProps<{
  cartItem: CartItem;
}>();
</script>

<template>
  <div class="cart-item flex items-center gap-2 mb-6 last:mb-0">
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
    <div class="separator" />
  </div>
</template>

<style scoped>
.cart-item {
  @apply relative;

  .separator {
    @apply absolute -bottom-4 content-[''] w-full h-[1px] bg-light-gray border-b border-dashed border-light-gray-2;

    &::before,
    &::after {
      @apply content-[''] w-[12px] h-[1px] bg-light-gray-2 absolute top-[5px] transform -translate-y-1/2;
    }

    &::before {
      @apply rotate-45 left-1/2 -translate-x-[4px];
    }

    &::after {
      @apply -rotate-45 left-1/2 translate-x-[4px];
    }
  }

  &:last-child .separator {
    @apply hidden;
  }

  &.hide-separator {
    @apply lg:mb-0;

    .separator {
      @apply lg:hidden;
    }
  }
}
</style>
