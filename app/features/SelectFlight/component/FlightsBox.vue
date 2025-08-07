<script setup lang="ts">
defineProps<{
  title: string;
  departure: string;
  arrival: string;
}>();
</script>

<template>
  <div class="bg-white shadow-box">
    <div class="flex flex-col items-center bg-light-gray py-1 lg:flex-row lg:gap-8 lg:p-4">
      <p class="font-medium uppercase text-gray">
        {{ title }}
      </p>
      <div class="flex items-center gap-3 text-lg font-bold text-primary lg:gap-5">
        <p>{{ departure }}</p>
        <SvgIcon name="long-arrow-right" class="text-primary" />
        <p>{{ arrival }}</p>
      </div>
    </div>
    <slot />
  </div>
</template>
