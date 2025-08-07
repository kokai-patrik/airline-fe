<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useForm, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { useSearchForm } from '~/features/Search/composables/useSearchForm';
import { useSearchStore } from '~/features/Search/stores/search';

import { schema } from '~/features/SelectFlight/schemas/inboundFormSchema';
import { getISODate, now, nowLaterMonth } from '~/helpers/datetime';

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
  if (values.returnDate) {
    returnDate.value = values.returnDate as Date;

    router.replace({
      query: {
        ...route.query,
        to: getISODate(values.returnDate as Date),
      },
    });
  }
});

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
      setFieldValue('departureDate', new Date(newFrom));
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<template>
  <form class="flex max-w-lg h-full flex-col gap-[20px] p-5 mx-auto md:flex-row" @submit="onSubmit">
    <Field v-slot="{ value, errors, handleChange }" name="returnDate">
      <Datepicker
        :model-value="value"
        :error="errors?.[0]"
        placeholder="Return"
        :allowed-dates="returnDates"
        @update:model-value="handleChange"
      />
    </Field>
    <Button
      type="submit"
      variant="primary"
      class="sm:h-[50px]"
    >
      Search
    </Button>
  </form>
</template>
