import { object, string, preprocess, date } from 'zod';

import { normalizeDate } from '~/helpers/datetime';

export const schema = object({
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

  departureDate: preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    date({
      required_error: 'Please select departure',
    }),
  ),

  returnDate: preprocess((val) => (val ? new Date(val as string) : undefined), date()
  .optional()),
}).refine((data) => {
  if (!data.returnDate || !data.departureDate) return true;

  const dep = normalizeDate(data.departureDate);
  const ret = normalizeDate(data.returnDate);

  return ret > dep;
}, {
  message: 'Return date must be after departure',
  path: ['returnDate'],
});
