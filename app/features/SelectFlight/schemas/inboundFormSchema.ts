import { object, preprocess, date } from 'zod';

export const schema = object({
  departure: preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    date({
      required_error: 'Please select departure',
    }),
  ),

  return: preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    date({
      required_error: 'Please select return',
    }),
  ),
}).refine((data) => !data.return || (data.departure && data.return > data.departure), {
  message: 'Return date must be after departure',
  path: ['return'],
});
