<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

import Button from '~/components/form/Button.vue';

const { cart, total } = storeToRefs(useCartStore());
</script>

<template>
  <div>
    <div class="bg-white border-t border-light-gray-2 p-3">
      <h2 class="text-lg font-semibold mb-2">Flights</h2>
      {{ total }}
      {{ cart }}
    </div>
    <Button
      type="button"
      variant="secondary"
      class="w-full mt-4 !font-black !text-base"
      disabled
    >
      Pay now
    </Button>
  </div>
</template>
