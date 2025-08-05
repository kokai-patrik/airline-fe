<script lang="ts" setup>
import { useForm, Field } from 'vee-validate';
import { object, string, preprocess, date } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { storeToRefs } from 'pinia';

import { useSearch } from '~/composables/useSearch';
import { useSearchStore } from '~/stores/search';
import { useStationsStore } from '~/stores/stations';

import Box from '~/components/Box.vue';
import SvgIcon from '~/components/SvgIcon.vue';
import Datepicker from '~/components/form/Datepicker.vue';
import Select from '~/components/form/Select.vue';
import Button from '~/components/form/Button.vue';

const searchStore = useSearchStore();
const { stations } = storeToRefs(useStationsStore());
const { fetchDates } = useSearch();

const departureDates = ref([]);
const returnDates = ref([]);

const origins = stations.value.map((station: any) => ({
  value: station.iata,
  label: station.shortName,
}));

const destinations = computed(() => {
  const selectedOrigin = values.origin;

  if (!selectedOrigin) {
    return [];
  }

  const originConnections = stations.value.find((station: any) => station.iata === selectedOrigin)?.connections || [];

  return stations.value?.map((station: any) => {
    if (originConnections.includes(station.iata)) {
      return {
        value: station.iata,
        label: station.shortName,
      };
    }
    return null;
  }).filter(Boolean);
});

const schema = toTypedSchema(
  object({
    origin: string({
      required_error: 'Please select an origin',
    }).min(1, {
      message: 'Origin is required',
    }),

    destination: string({
      required_error: 'Please select a destination',
    }).min(1, {
      message: 'Destination is required',
    }),

    departure: preprocess((val) => (val ? new Date(val as string) : undefined),
      date({
        required_error: 'Please select departure',
      }),
    ),

    return: preprocess((val) => (val ? new Date(val as string) : undefined),
      date().optional(),
    ),
  })
);

const { values, setFieldValue, handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async values => {
  console.log('Form submitted:', values);
});

function getISODate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

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

  console.log('Return date:', searchStore.returnDate);

  if (searchStore.returnDate) {
    setFieldValue('return', new Date(searchStore.returnDate));
  }
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
                  v-bind="field"
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
