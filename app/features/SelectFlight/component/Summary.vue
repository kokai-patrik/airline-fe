<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/features/Cart/stores/cart';

import CartItem from '~/features/Cart/components/CartItem.vue';
import Button from '~/components/form/Button.vue';

import { formatPrice } from '~/utils/priceFormat';

const { cart, total, isModalOpen } = storeToRefs(useCartStore());
</script>

<template>
  <div class="lg:sticky lg:top-4">
    <div class="border-t border-light-gray-2 bg-white p-4">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold uppercase">Flights</h2>
        <p class="font-bold text-primary">{{ formatPrice(total, 'HUF') }}</p>
      </div>
      <div v-if="cart.length" class="flex flex-col gap-2">
        <CartItem
          v-for="item in cart"
          :key="item.id"
          :cart-item="item"
        />
      </div>
      <p v-if="cart.length === 0" class="text-gray font-bold">
        Choose an outbound flight
      </p>
    </div>
    <div class="flex items-center justify-between bg-primary p-4">
      <p class="font-black text-white uppercase">Total</p>
      <p class="font-black text-white">{{ formatPrice(total, 'HUF') }}</p>
    </div>
    <Button
      type="button"
      variant="secondary"
      class="mt-4 w-full !text-base !font-black"
      :disabled="!cart.length"
      @click="isModalOpen = true"
    >
      Pay now
    </Button>
  </div>
</template>
