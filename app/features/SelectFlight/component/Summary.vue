<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

import Button from '~/components/form/Button.vue';

const { cart, total } = storeToRefs(useCartStore());
</script>

<template>
  <div>
    <div class="border-t border-light-gray-2 bg-white p-3">
      <h2 class="mb-2 text-lg font-semibold">Flights</h2>
      {{ total }}
      {{ cart }}
    </div>
    <Button
      type="button"
      variant="secondary"
      class="mt-4 w-full !text-base !font-black"
      disabled
    >
      Pay now
    </Button>
  </div>
</template>
