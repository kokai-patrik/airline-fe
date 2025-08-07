import type { Fare, Flight } from '~/types';

import { getISODate } from '~/helpers/datetime';
import type { CartItem } from '../stores/cart';

export function getCartItemId(fare: Fare, option: Flight, type: 'outbound' | 'inbound'): string {
  const date = getISODate(new Date(option.departureDateTime));
  return `${date}-${type}-${fare.bundle}-${fare.price.amount}`;
};

export function sortByType(cart: CartItem[]): CartItem[] {
  return [...cart].sort((a, b) => a.type === 'outbound' ? -1 : b.type === 'outbound' ? 1 : 0);
}
