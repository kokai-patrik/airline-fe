<script setup lang="ts">
defineProps<{
  title: string;
  departure: string;
  arrival: string;
}>();
</script>

<template>
  <div class="bg-white shadow-box">
    <div class="flex flex-col lg:flex-row items-center py-1 lg:p-4 lg:gap-8 bg-light-gray">
      <p class="uppercase text-gray font-medium">
        {{ title }}
      </p>
      <div class="flex items-center gap-3 lg:gap-5 font-bold text-lg text-primary">
        <p>{{ departure }}</p>
        <SvgIcon
          name="long-arrow-right"
          class="text-primary"
        />
        <p>{{ arrival }}</p>
      </div>
    </div>
    <slot />
  </div>
</template>
