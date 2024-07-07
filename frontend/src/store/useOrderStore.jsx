import { createWithEqualityFn } from "zustand/traditional";

const maxSize = 6;

//Delete and add Order haven't been used. But It might be used in the future.
const store = (set) => ({
  orders: [],
  numberOfPages: 1,
  currentPage: 1,
  totalRecords: 0,
  totalAmount: 0,
  setOrderStore: (
    orders,
    numberOfPages,
    currentPage,
    totalRecords,
    totalAmount
  ) =>
    set(() => ({
      orders: orders,
      numberOfPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords,
      totalAmount: totalAmount,
    })),
  setCurrentPage: (currentPage) => set(() => ({ currentPage: currentPage })),
  addOrder: (id, date, refNo, customer, amount) =>
    set((store) => ({
      orders: [{ id, date, refNo, customer, amount }, ...store.orders].slice(
        0,
        maxSize
      ),
      totalRecords: Number(store.totalRecords) + 1,
      numberOfPages: Math.ceil(store.totalRecords / maxSize),
      currentPage: 1,
    })),
  deleteOrder: (code) =>
    set((store) => ({
      orders: store.orders.filter((order) => order.code !== code),
    })),
});

export const useOrderStore = createWithEqualityFn(store);
