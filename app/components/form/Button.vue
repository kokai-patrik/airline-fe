<script setup lang="ts">
import clsx from 'clsx';

const props = defineProps<{
  type: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'secondary-outline';
}>();

const baseClasses =
  'flex items-center justify-center h-9 md:h-12 px-2 md:px-4 font-medium text-sm md:text-xl uppercase rounded-sm transition-all active:scale-[.98]';

const buttonClass = computed(() => {
  const variants: Record<string, string> = {
    primary: 'bg-blue hover:bg-blue/90 text-white',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white',
    'secondary-outline':
      'bg-white border-2 border-secondary hover:bg-secondary text-black hover:text-white',
  };

  return clsx(baseClasses, variants[props.variant ?? 'primary']);
});
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="buttonClass"
  >
    <slot />
  </button>
</template>
