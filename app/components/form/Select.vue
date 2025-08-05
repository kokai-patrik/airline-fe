<script setup lang="ts">
import Error from '~/components/Error.vue';

interface Option {
  value: string;
  label: string;
}

const props = defineProps<{
  label: string;
  options: Option[];
  error?: string | null;
}>();

const selected = defineModel<string | null>();

const query = ref<string>('');
const focused = ref<boolean>(false);
const isUserTyping = ref(false);

const optionsByQuery = computed(() => {
  if (!isUserTyping.value) {
    return props.options;
  }

  return query.value
    ? props.options.filter((opt) =>
        opt.label.toLowerCase().includes(query.value.toLowerCase())
      )
    : props.options;
});

function selectOption(option: Option) {
  selected.value = option.value;
  query.value = option.label;
  focused.value = false;
  isUserTyping.value = false;
}

function onFocus() {
  focused.value = true;
  isUserTyping.value = false;
}

function onInput(event: Event) {
  isUserTyping.value = true;
  query.value = (event.target as HTMLInputElement).value;
}

watch(() => selected.value, (value) => {
  if (value) {
    const option = props.options.find(opt => opt.value === value);
    query.value = option ? option.label : '';
  } else {
    query.value = '';
  }
}, { immediate: true });
</script>

<template>
  <div class="w-full">
    <div class="relative w-full cursor-text">
      <label :class="[
        'transition-all ease-in-out absolute top-1.5 left-3 block mb-2 text-[10px] uppercase font-black text-gray',
        {
          'opacity-0 invisible': !query,
          'opacity-1 visible': query
        }
      ]">
        {{ props.label }}
      </label>
      <input
        type="text"
        v-model="query"
        :class="[
          'transition-all duration-150 ease-in-out w-full h-[50px] px-3 py-2 border border-gray rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
          {
            'pt-5': query,
            'border-gray': !query,
            'bg-light-magenta border-secondary ring-1 ring-secondary shadow-error': props.error
          }
        ]"
        :placeholder="props.label"
        @focus="onFocus"
        @input="onInput"
        @blur="focused = false"
      />
      <Transition name="fade-scale">
        <div
          v-if="focused"
          class="absolute top-[calc(100%+6px)] z-10 mt-1 w-full p-1 bg-white border border-gray rounded-sm max-h-60 overflow-auto"
        >
          <ul v-if="optionsByQuery.length > 0">
            <li
              v-for="option in optionsByQuery"
              :key="option.value"
              :class="['px-3 py-2 transition-all duration-200 hover:bg-primary/15 cursor-pointer text-sm rounded-sm', {
                'bg-primary/15 mb-1': query === option.label
              }]"
              @click="selectOption(option)"
            >
              {{ option.label }}
            </li>
          </ul>
          <p
            v-if="optionsByQuery.length === 0"
            class="px-4 py-2 text-sm text-gray-500"
          >
            No options found
          </p>
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
  @apply opacity-0 transform translate-y-1;
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  @apply opacity-100 transform translate-y-0;
}
</style>
