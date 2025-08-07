<script setup lang="ts">
import Modal from '~/components/Modal.vue';
import CartItem from '~/features/Cart/components/CartItem.vue';

import { useCartStore } from '~/features/Cart/stores/cart';

import { formatPrice } from '~/utils/priceFormat';

const cartStore = useCartStore();
const { cart, total, isModalOpen } = storeToRefs(cartStore);

function reset() {
  cartStore.clearCart();
  isModalOpen.value = false;
}
</script>

<template>
  <Modal @close="isModalOpen = false">
    <template #header>
      <div class="flex items-center justify-between bg-light-gray py-3 px-6">
        <h3 class="text-primary font-light uppercase">
          Thanks for buying your tickets at Mito Airlines
        </h3>
      </div>
    </template>
    <template #content>
      <div class="p-6">
        <div v-if="cart.length" class="flex flex-col lg:flex-row gap-2">
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
      <div class="flex items-center justify-between px-6 pb-4">
        <div class="flex items-center gap-1">
          <p class="text-lg font-medium text-medium-gray uppercase">Total:</p>
          <p class="text-lg font-bold text-primary uppercase">{{ formatPrice(total, 'HUF') }}</p>
        </div>
        <p class="text-secondary cursor-pointer text-xs font-bold uppercase underline" @click="reset">
          No, thanks (reset)
        </p>
      </div>
    </template>
  </Modal>
</template>
