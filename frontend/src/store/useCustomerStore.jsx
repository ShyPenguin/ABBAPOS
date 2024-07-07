import { createWithEqualityFn } from "zustand/traditional";

const maxSize = 6;

//Delete and add Customer haven't been used. But It might be used in the future.

const store = (set) => ({
  customers: [],
  numberOfPages: 1,
  currentPage: 1,
  totalRecords: 0,
  setCustomerStore: (customers, numberOfPages, currentPage, totalRecords) =>
    set(() => ({
      customers: customers,
      numberOfPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords,
    })),
  setCurrentPage: (currentPage) => set(() => ({ currentPage: currentPage })),
  addCustomer: (id, name, code, unitOfMeasure, price) =>
    set((store) => ({
      customers: [
        { id, name, code, unitOfMeasure, price },
        ...store.customers,
      ].slice(0, maxSize),
      totalRecords: Number(store.totalRecords) + 1,
      numberOfPages: Math.ceil(store.totalRecords / maxSize),
      currentPage: 1,
    })),
  deleteCustomer: (code) =>
    set((store) => ({
      tasks: store.customers.filter((item) => item.code !== code),
    })),
});

export const useCustomerStore = createWithEqualityFn(store);
