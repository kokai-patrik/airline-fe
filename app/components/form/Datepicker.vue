<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import SvgIcon from '~/components/SvgIcon.vue';
import Error from '~/components/Error.vue';

const value = defineModel<Date | null>();

const props = defineProps<{
  allowedDates?: string[];
  placeholder?: string;
  error?: string | null;
}>();

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
</script>

<template>
  <div :class="['datepicker', {
    'has-error': props.error
  }]">
    <VueDatePicker
      v-model="value"
      auto-apply
      hide-offset-dates
      :time-picker="false"
      :format="formatDate"
      :allowed-dates="props.allowedDates"
      :action-row="{
        showNow: false,
        showPreview: false,
        showSelect: false,
        showCancel: false
      }"
      :placeholder="props.placeholder"
      auto-position="top"
    >
      <template #input-icon>
        <SvgIcon
          name="date"
          class="w-5 h-5 text-gray"
        />
      </template>
    </VueDatePicker>
    <Error
      v-if="props.error"
      :message="props.error"
      class="mt-2"
    />
  </div>
</template>

<style scoped>
:deep(.dp__main) {
  --dp-primary-color: #06038d;
  @apply font-medium;

  .dp__button,
  .dp__calendar_header_separator,
  .dp__arrow_bottom,
  .dp--clear-btn {
    display: none;
  }

  /* Header */
  .dp--header-wrap {
    @apply mb-1;
  }

  .dp__calendar_header {
    @apply bg-light-gray border-0 rounded-sm;
  }

  .dp__calendar_header_item {
    @apply flex items-center text-sm leading-none;
  }

  /* Navigation */
  .dp__inner_nav:hover {
    @apply rounded-sm;
  }

  /* Today */
  .dp__today {
    @apply text-primary border-2 border-primary bg-white;

    &.dp__cell_disabled {
      @apply border-primary/50 bg-white text-gray;
    }
  }

  /* Input */
  .dp__input {
    @apply transition-all h-[50px] border-gray rounded-sm pl-3 font-normal;
  }

  .dp__input_focus {
    @apply border-primary ring-1 ring-primary;
  }

  .dp__input_icon {
    @apply left-auto right-3;
  }

  /* Menu */
  .dp--menu-wrapper {
    top: auto !important;
    bottom: calc(100% + 10px) !important;
  }
}

.datepicker {
  @apply w-full;

  &.has-error {
    :deep(.dp__input) {
      @apply bg-light-magenta border-secondary ring-1 ring-secondary shadow-error;
    }
  }
}
</style>
