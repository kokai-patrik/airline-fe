import type { Fare, Flight } from '~/types';

import { getISODate } from '~/helpers/datetime';

export function getCartItemId(fare: Fare, option: Flight, type: 'outbound' | 'inbound'): string {
  const date = getISODate(new Date(option.departureDateTime));
  return `${date}-${type}-${fare.bundle}-${fare.price.amount}`;
};
