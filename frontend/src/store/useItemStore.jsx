import { createWithEqualityFn } from "zustand/traditional";

const maxSize = 6;

//Delete and add Item haven't been used. But It might be used in the future.
const store = (set) => ({
  items: [],
  numberOfPages: 1,
  currentPage: 1,
  totalRecords: 0,
  setItemStore: (items, numberOfPages, currentPage, totalRecords) =>
    set(() => ({
      items: items,
      numberOfPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords,
    })),
  setCurrentPage: (currentPage) => set(() => ({ currentPage: currentPage })),
  addItem: (id, name, code, unitOfMeasure, price, category) =>
    set((store) => ({
      items: [
        { id, name, code, unitOfMeasure, price, category },
        ...store.items,
      ].slice(0, maxSize),
      totalRecords: Number(store.totalRecords) + 1,
      numberOfPages: Math.ceil(store.totalRecords / maxSize),
      currentPage: 1,
    })),
  deleteItem: (code) =>
    set((store) => ({
      tasks: store.items.filter((item) => item.code !== code),
    })),
});

export const useItemStore = createWithEqualityFn(store);
