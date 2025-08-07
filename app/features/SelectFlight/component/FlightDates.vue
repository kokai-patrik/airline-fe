<script setup lang="ts">
import { formatDate } from '~/helpers/datetime';

defineProps<{
  currentDate: string;
  prevDate: string | null;
  nextDate: string | null;
}>();
</script>

<template>
  <div class="flex items-center justify-between border-b border-light-gray-3 p-2 lg:p-4">
    <div class="flex items-center gap-2">
      <SvgIcon name="chevron-left" class="text-secondary" />
      <p class="text-[13px] font-bold text-gray hidden sm:block">
        {{ prevDate }}
      </p>
    </div>

    <p class="text-sm font-medium text-dark">
      {{ formatDate(currentDate) }}
    </p>

    <div class="flex items-center gap-2">
      <p class="text-[13px] font-bold text-gray hidden sm:block">
        {{ nextDate }}
      </p>
      <SvgIcon name="chevron-right" class="text-secondary" />
    </div>
  </div>
</template>
