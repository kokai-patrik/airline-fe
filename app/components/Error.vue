<script setup lang="ts">
import SvgIcon from './SvgIcon.vue';

const props = defineProps<{
  message: string;
}>();
</script>

<template>
  <div
    class="flex gap-1 text-secondary"
    role="alert"
  >
    <SvgIcon name="error" class="w-5 h-5" />
    <p class="text-xs pt-1">{{ props.message }}</p>
  </div>
</template>

<style scoped>
</style>
