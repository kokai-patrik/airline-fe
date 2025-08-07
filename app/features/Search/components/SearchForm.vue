<script lang="ts" setup>
import { useForm, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { useSearchForm } from '~/features/Search/composables/useSearchForm';
import { useSearchStore } from '~/features/Search/stores/search';

import { getISODate } from '~/utils/helpers';
import { schema } from '~/features/Search/schemas/searchFormSchema';

import Box from '~/components/Box.vue';
import SvgIcon from '~/components/SvgIcon.vue';
import Datepicker from '~/components/form/Datepicker.vue';
import Select from '~/components/form/Select.vue';
import Button from '~/components/form/Button.vue';

const router = useRouter();
const searchStore = useSearchStore();
const {
  fetchDates,
  isStoreInitialized,
  origins,
  destinations,
} = useSearchForm();

const { values, setFieldValue, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
});

const departureDates = ref<string[]>([]);
const returnDates = ref<string[]>([]);

const onSubmit = handleSubmit(async values => {
  await router.push({
    name: 'select-flight',
    query: {
      departure: values.origin,
      arrival: values.destination,
      from: getISODate(values.departure as Date),
      to: values.return ? getISODate(values.return as Date) : null,
    },
  });
});

onMounted(() => {
  if (searchStore.origin) {
    setFieldValue('origin', searchStore.origin);
  }

  if (searchStore.destination) {
    setFieldValue('destination', searchStore.destination);
  }

  if (searchStore.departureDate) {
    setFieldValue('departure', new Date(searchStore.departureDate));
  }

  if (searchStore.returnDate) {
    setFieldValue('return', new Date(searchStore.returnDate));
  }

  isStoreInitialized.value = true;
});

const now = new Date();
const nowLaterMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

watch(() => [values.origin, values.destination], async ([origin, destination]) => {
  if (origin && destination) {
    const getDepartureDates = await fetchDates(origin, destination, getISODate(now), getISODate(nowLaterMonth));
    const getReturnDates = await fetchDates(destination, origin, getISODate(now), getISODate(nowLaterMonth));

    if (getDepartureDates) {
      departureDates.value = getDepartureDates;
    }

    if (getReturnDates) {
      returnDates.value = getReturnDates;
    }
  }
}, { immediate: true });

watch(() => values, (currentValues) => {
  if (!isStoreInitialized.value) return;

  searchStore.setAllValues({
    origin: currentValues.origin ?? '',
    destination: currentValues.destination ?? '',
    departureDate: currentValues.departure as Date,
    returnDate: currentValues.return as Date,
  });
}, { deep: true });
</script>

<template>
  <div class="flex items-center w-full h-screen p-3 md:p-0">
    <Box class="w-[570px] mx-auto">
      <template #header>
        <div class="flex items-center gap-5 h-[50px] px-4 bg-primary">
          <SvgIcon name="logo" class="w-8 h-8 text-white" />
          <h1 class="font-bold text-white text-[17px] uppercase">
            Mito Airline
          </h1>
        </div>
      </template>
      <template #content>
        <div class="p-6">
          <form
            class='flex h-full flex-wrap gap-[20px]'
            @submit="onSubmit"
          >
            <div class="flex flex-col sm:flex-row gap-4 w-full">
              <Field
                v-slot="{ value, errors, handleChange }"
                name="origin"
              >
                <Select
                  :model-value="value"
                  @update:model-value="handleChange"
                  :error="errors?.[0]"
                  label="Origin"
                  :options="origins"
                />
              </Field>
              <Field
                v-slot="{ value, errors, handleChange }"
                name="destination"
              >
                <Select
                  :model-value="value"
                  @update:model-value="handleChange"
                  :error="errors?.[0]"
                  label="Destination"
                  :options="destinations"
                />
              </Field>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 w-full">
              <Field
                v-slot="{ value, errors, handleChange }"
                name="departure"
              >
                <Datepicker
                  :model-value="value"
                  @update:model-value="handleChange"
                  :error="errors?.[0]"
                  placeholder="Departure"
                  :allowedDates="departureDates"
                />
              </Field>
              <Field
                v-slot="{ value, errors, handleChange }"
                name="return"
              >
                <Datepicker
                  :model-value="value"
                  @update:model-value="handleChange"
                  :error="errors?.[0]"
                  placeholder="Return"
                  :allowedDates="returnDates"
                />
              </Field>
            </div>
            <div class="w-full">
              <Button
                type="submit"
                variant="primary"
                class="w-full mx-auto sm:w-auto sm:px-16"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </template>
    </Box>
  </div>
</template>
