export interface CartItem {
  type: 'outbound' | 'inbound';
  id: string;
  name: string;
  price: number;
  date: string;
  travelTime: {
    departureDateTime: string;
    arrivalDateTime: string;
  };
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartItem[]>([]);
  const isModalOpen = ref<boolean>(false);

  const total = computed(() => {
    return cart.value.reduce((acc, item) => acc + item.price, 0);
  });

  const addToCart = (item: CartItem) => {
    if (cart.value.find((cartItem) => cartItem.id === item.id)) {
      return;
    }

    const existingType = cart.value.find(
      (cartItem) => cartItem.type === item.type && cartItem.date === item.date,
    );

    if (existingType) {
      removeFromCart(existingType.id);
    }

    cart.value.push(item);
  };

  const removeFromCart = (id: string) => {
    cart.value = cart.value.filter((cartItem) => cartItem.id !== id);
  };

  const clearCart = () => {
    cart.value = [];
  };

  const isInCart = (id: string) => {
    return cart.value.some((item) => item.id === id);
  };

  return {
    cart,
    total,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
    isModalOpen,
  };
});
