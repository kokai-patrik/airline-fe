<script setup lang="ts">
import SvgIcon from './SvgIcon.vue';

const props = defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="flex gap-1 text-secondary" role="alert">
    <SvgIcon name="error" class="h-5 w-5" />
    <p class="pt-1 text-xs">{{ props.message }}</p>
  </div>
</template>

<style scoped></style>
