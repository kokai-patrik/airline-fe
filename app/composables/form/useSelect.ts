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

  const optionsByQuery = computed(() => {
    if (!isUserTyping.value) return props.options;

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
    { immediate: true }
  );

  return {
    query,
    focused,
    optionsByQuery,
    onFocus,
    onInput,
    selectOption,
  };
}
