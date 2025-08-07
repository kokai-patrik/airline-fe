<script lang="ts" setup>
import { useForm, Field } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { useSearchForm } from '~/features/Search/composables/useSearchForm';
import { useSearchStore } from '~/features/Search/stores/search';
import { useCartStore } from '~/features/Cart/stores/cart';

import { getISODate, now, nowLaterMonth } from '~/helpers/datetime';
import { schema } from '~/features/Search/schemas/searchFormSchema';

import Box from '~/components/Box.vue';
import SvgIcon from '~/components/SvgIcon.vue';
import Datepicker from '~/components/form/Datepicker.vue';
import Select from '~/components/form/Select.vue';
import Button from '~/components/form/Button.vue';

const router = useRouter();
const searchStore = useSearchStore();
const cartStore = useCartStore();
const { fetchDates, isStoreInitialized, origins, destinations } = useSearchForm();

const { values, setFieldValue, handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
});

const departureDates = ref<string[]>([]);
const returnDates = ref<string[]>([]);

const onSubmit = handleSubmit(async (values) => {
  cartStore.clearCart();

  await router.push({
    name: 'select-flight',
    query: {
      departure: values.origin,
      arrival: values.destination,
      from: getISODate(values.departureDate as Date),
      to: values.returnDate ? getISODate(values.returnDate as Date) : null,
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
    setFieldValue('departureDate', new Date(searchStore.departureDate));
  }

  if (searchStore.returnDate) {
    setFieldValue('returnDate', new Date(searchStore.returnDate));
  }

  isStoreInitialized.value = true;
});

watch(
  () => [values.origin, values.destination],
  async ([origin, destination]) => {
    if (origin && destination) {
      const getDepartureDates = await fetchDates(
        origin,
        destination,
        getISODate(now),
        getISODate(nowLaterMonth),
      );
      const getReturnDates = await fetchDates(
        destination,
        origin,
        getISODate(now),
        getISODate(nowLaterMonth),
      );

      if (getDepartureDates) {
        departureDates.value = getDepartureDates;
      }

      if (getReturnDates) {
        returnDates.value = getReturnDates;
      }
    }
  },
  { immediate: true },
);

watch(
  () => values,
  (currentValues) => {
    if (!isStoreInitialized.value) return;

    searchStore.setAllValues({
      origin: currentValues.origin ?? '',
      destination: currentValues.destination ?? '',
      departureDate: currentValues.departureDate as Date,
      returnDate: currentValues.returnDate as Date,
    });
  },
  { deep: true },
);
</script>

<template>
  <div class="flex h-screen w-full items-center p-3 md:p-0">
    <Box class="mx-auto w-[570px]">
      <template #header>
        <div class="flex h-[50px] items-center gap-5 bg-primary px-4">
          <SvgIcon name="logo" class="h-8 w-8 text-white" />
          <h1 class="text-[17px] font-bold uppercase text-white">Mito Airline</h1>
        </div>
      </template>
      <template #content>
        <div class="p-6">
          <form class="flex h-full flex-wrap gap-[20px]" @submit="onSubmit">
            <div class="flex w-full flex-col gap-4 sm:flex-row">
              <Field v-slot="{ value, errors, handleChange }" name="origin">
                <Select
                  :model-value="value"
                  :error="errors?.[0]"
                  label="Origin"
                  :options="origins"
                  @update:model-value="handleChange"
                />
              </Field>
              <Field v-slot="{ value, errors, handleChange }" name="destination">
                <Select
                  :model-value="value"
                  :error="errors?.[0]"
                  label="Destination"
                  :options="destinations"
                  @update:model-value="handleChange"
                />
              </Field>
            </div>
            <div class="flex w-full flex-col gap-4 sm:flex-row">
              <Field v-slot="{ value, errors, handleChange }" name="departureDate">
                <Datepicker
                  :model-value="value"
                  :error="errors?.[0]"
                  placeholder="Departure"
                  :allowed-dates="departureDates"
                  @update:model-value="handleChange"
                />
              </Field>
              <Field v-slot="{ value, errors, handleChange }" name="returnDate">
                <Datepicker
                  :model-value="value"
                  :error="errors?.[0]"
                  placeholder="Return"
                  :allowed-dates="returnDates"
                  @update:model-value="handleChange"
                />
              </Field>
            </div>
            <div class="w-full">
              <Button
                type="submit"
                variant="primary"
                class="mx-auto w-full sm:w-auto sm:px-16"
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
