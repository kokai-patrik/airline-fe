import { object, preprocess, date } from 'zod';

import { normalizeDate } from '~/helpers/datetime';

export const schema = object({
  departureDate: preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    date({
      required_error: 'Please select departure',
    }),
  ),

  returnDate: preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    date({
      required_error: 'Please select return',
    }),
  ),
}).refine((data) => {
  if (!data.returnDate || !data.departureDate) return true;

  const dep = normalizeDate(data.departureDate);
  const ret = normalizeDate(data.returnDate);

  return ret > dep;
}, {
  message: 'Return date must be after departure',
  path: ['returnDate'],
});
