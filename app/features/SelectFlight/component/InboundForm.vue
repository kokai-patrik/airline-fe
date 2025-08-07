<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useForm, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { useSearchForm } from '~/features/Search/composables/useSearchForm';
import { useSearchStore } from '~/features/Search/stores/search';

import { schema } from '~/features/SelectFlight/schemas/inboundFormSchema';
import { getISODate } from '~/utils/helpers';

import Datepicker from '~/components/form/Datepicker.vue';
import Button from '~/components/form/Button.vue';

const props = defineProps<{
  departure: string;
  arrival: string;
  from: string;
}>();

const route = useRoute();
const router = useRouter();

const { fetchDates } = useSearchForm();
const { returnDate } = storeToRefs(useSearchStore());

const { setFieldValue, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
});

const returnDates = ref<string[]>([]);

const onSubmit = handleSubmit(async (values) => {
  if (values.return) {
    returnDate.value = values.return;

    router.replace({
      query: {
        ...route.query,
        to: getISODate(values.return as Date),
      },
    });
  }
});

const now = new Date();
const nowLaterMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

onMounted(async () => {
  const getReturnDates = await fetchDates(
    props.arrival,
    props.departure,
    getISODate(now),
    getISODate(nowLaterMonth),
  );

  if (getReturnDates) {
    returnDates.value = getReturnDates;
  }
});

watch(
  () => props.from,
  async (newFrom) => {
    if (newFrom) {
      setFieldValue('departure', new Date(newFrom));
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<template>
  <form class="flex h-full flex-col gap-[20px] p-5 md:flex-row" @submit="onSubmit">
    <Field v-slot="{ value, errors, handleChange }" name="return">
      <Datepicker
        :model-value="value"
        :error="errors?.[0]"
        placeholder="Return"
        :allowed-dates="returnDates"
        @update:model-value="handleChange"
      />
    </Field>
    <Button type="submit" variant="primary"> Search </Button>
  </form>
</template>
