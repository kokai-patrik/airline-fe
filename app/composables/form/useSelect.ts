import { ref, computed, watch } from 'vue';

export interface Option {
  value: string;
  label: string;
}

interface UseSelectProps {
  options: Option[];
  error?: string | null;
}

export function useSelect(props: UseSelectProps, selected: Ref<string | null>) {
  const query = ref<string>('');
  const focused = ref<boolean>(false);
  const isUserTyping = ref<boolean>(false);
  const activeIndex = ref<number>(-1);

  const optionsByQuery = computed(() => {
    const filtered = query.value
      ? props.options.filter((opt) =>
          opt.label.toLowerCase().includes(query.value.toLowerCase())
        )
      : props.options;

    if (activeIndex.value >= filtered.length) {
      activeIndex.value = filtered.length - 1;
    }

    return filtered;
  });

  function selectOption(option: Option) {
    selected.value = option.value;
    query.value = option.label;
    focused.value = false;
    isUserTyping.value = false;
    activeIndex.value = -1;
  }

  function onFocus() {
    focused.value = true;
    isUserTyping.value = false;
  }

  function onInput(event: Event) {
    isUserTyping.value = true;
    query.value = (event.target as HTMLInputElement).value;
    activeIndex.value = 0;
  }

  function moveUp() {
    if (activeIndex.value > 0) {
      activeIndex.value -= 1;
    }
  }

  function moveDown() {
    if (activeIndex.value < optionsByQuery.value.length - 1) {
      activeIndex.value += 1;
    }
  }

  function selectActive() {
    const option = optionsByQuery.value[activeIndex.value];

    if (option) {
      selectOption(option);
    }
  }

  watch(
    () => selected.value,
    (value) => {
      if (value) {
        const option = props.options.find((opt) => opt.value === value);
        query.value = option ? option.label : '';
      } else {
        query.value = '';
      }
    },
    { immediate: true },
  );

  return {
    query,
    focused,
    optionsByQuery,
    activeIndex,
    onFocus,
    onInput,
    selectOption,
    moveUp,
    moveDown,
    selectActive,
  };
}
