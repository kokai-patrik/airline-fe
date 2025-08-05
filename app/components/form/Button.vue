<script setup lang="ts">
const props = defineProps<{
  type: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}>();
</script>

<template>
  <button
    class="flex items-center justify-center h-[50px] px-4 font-medium text-white text-lg uppercase rounded-sm transition-all active:scale-[.98]"
    :type="props.type"
    :disabled="props.disabled"
    :class="{
      'bg-blue hover:bg-blue/90': props.variant === 'primary',
      'bg-secondary hover:bg-secondary/90': props.variant === 'secondary',
    }"
  >
    <slot />
  </button>
</template>
