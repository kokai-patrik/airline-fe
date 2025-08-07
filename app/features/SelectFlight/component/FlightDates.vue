<script setup lang="ts">
import { formatDate } from '~/utils/helpers';

defineProps<{
  currentDate: string;
  dates?: string[];
}>();
</script>

<template>
  <div class="flex items-center justify-between border-b border-light-gray-3 p-2 lg:p-4">
    <p>
      <SvgIcon name="chevron-left" class="text-secondary" />
    </p>
    <p>{{ formatDate(currentDate) }}</p>
    <p>
      <SvgIcon name="chevron-right" class="text-secondary" />
    </p>
  </div>
</template>
