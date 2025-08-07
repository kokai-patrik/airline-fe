<script setup lang="ts">
import clsx from 'clsx';

import { useSelect } from '~/composables/form/useSelect';
import type { Option } from '~/composables/form/useSelect';

import Error from '~/components/Error.vue';

const props = defineProps<{
  label: string;
  options: Option[];
  error?: string | null;
}>();

const selected = defineModel<string | null>({ default: null });

const { query, focused, optionsByQuery, onFocus, onInput, selectOption } = useSelect(
  props,
  selected,
);

const labelClass = computed(() =>
  clsx(
    'transition-all ease-in-out absolute top-1.5 left-3 block mb-2 text-[10px] uppercase font-black text-gray',
    {
      'opacity-0 invisible': !query.value,
      'opacity-1 visible': query.value,
    },
  ),
);

const inputClass = computed(() =>
  clsx(
    'transition-all duration-150 ease-in-out w-full h-[50px] px-3 py-2 border rounded-sm focus:outline-none focus:ring-1',
    {
      'pt-5': query.value,
      'border-gray focus:ring-primary focus:border-primary': !props.error,
      'bg-light-magenta border-secondary ring-1 ring-secondary shadow-error': props.error,
    },
  ),
);

const optionClass = (optionLabel: string) =>
  clsx(
    'px-3 py-2 transition-all duration-200 hover:bg-primary/15 cursor-pointer text-sm rounded-sm',
    {
      'bg-primary/15 mb-1': query.value === optionLabel,
    },
  );
</script>

<template>
  <div class="w-full">
    <div class="relative w-full cursor-text">
      <label :class="labelClass">{{ props.label }}</label>

      <input
        v-model="query"
        type="text"
        :placeholder="props.label"
        :class="inputClass"
        @focus="onFocus"
        @input="onInput"
        @blur="focused = false"
      >

      <Transition name="fade-scale">
        <div
          v-if="focused"
          class="absolute top-[calc(100%+6px)] z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm border border-gray bg-white p-1"
        >
          <ul v-if="optionsByQuery.length > 0">
            <li
              v-for="option in optionsByQuery"
              :key="option.value"
              :class="optionClass(option.label)"
              @click="selectOption(option)"
            >
              {{ option.label }}
            </li>
          </ul>

          <p v-else class="text-gray-500 px-4 py-2 text-sm">No options found</p>
        </div>
      </Transition>
    </div>

    <Error
      v-if="props.error"
      :message="props.error"
      class="mt-2"
    />
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  @apply transition-all duration-200 ease-in-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  @apply translate-y-1 transform opacity-0;
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  @apply translate-y-0 transform opacity-100;
}
</style>
