import { createWithEqualityFn } from "zustand/traditional";

// This store is for Order data. Basically for CRUD.
const store = (set) => ({
  id: null,
  order_items: [],
  amount: 0,
  status: "",
  discount: 0,
  customer: null,
  paymentMethod: "",
  reference_number: "",
  setOrderStore: (data) =>
    set(() => ({
      id: data.id,
      order_items: data.order_items,
      amount: Number(data.amount),
      status: data.status,
      discount: data.discount,
      customer: data.customer,
      paymentMethod: data.paymentMethod,
      reference_number: data.reference_number,
    })),
  setAmount: (amount) =>
    set((store) => ({
      ...store,
      amount: amount,
    })),
  setStatus: (status) =>
    set((store) => ({
      ...store,
      status: status,
    })),
  setDiscount: (discount) =>
    set((store) => ({
      ...store,
      discount: discount,
    })),
  setCustomer: (customer) =>
    set((store) => ({
      ...store,
      customer: customer,
    })),
  setPaymentMethod: (paymentMethod) =>
    set((store) => ({
      ...store,
      paymentMethod: paymentMethod,
    })),
  addItem: (item) =>
    set((store) => {
      const orderItem = {
        item: { ...item, price: Number(item.price) },
        quantity: 1,
      };
      return {
        order_items: [...store.order_items, orderItem],
        amount: store.amount + orderItem.item.price,
      };
    }),
  removeItem: (item) =>
    set((store) => ({
      order_items: store.order_items.filter(
        (orderItem) => orderItem.item.id !== item.id
      ),
      amount: store.amount - Number(item.price),
    })),
  increaseQuantity: (item) =>
    set((store) => {
      return {
        order_items: store.order_items.map((orderItem) =>
          orderItem.item.id === item.item.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
              }
            : orderItem
        ),
        amount: store.amount + Number(item.item.price),
      };
    }),
  decreaseQuantity: (item) =>
    set((store) => {
      if (item.quantity == 1) {
        return {
          order_items: store.order_items.filter(
            (orderItem) => orderItem.item.id !== item.item.id
          ),
          amount: store.amount - item.item.price,
        };
      }
      return {
        order_items: store.order_items.map((orderItem) =>
          orderItem.item.id === item.item.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity - 1,
              }
            : orderItem
        ),
        amount: store.amount - item.item.price,
      };
    }),
  empty: () =>
    set(() => ({
      id: null,
      order_items: [],
      amount: 0,
      status: "",
      discount: 0,
      customer: null,
      paymentMethod: "",
      reference_number: "",
    })),
});

export const useOrderItems = createWithEqualityFn(store);
