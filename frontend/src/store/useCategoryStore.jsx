import { createWithEqualityFn } from "zustand/traditional";

const maxSize = 6;

//Delete and add Category haven't been used. But It might be used in the future.

const store = (set) => ({
  categories: [],
  numberOfPages: 1,
  currentPage: 1,
  totalRecords: 0,
  setCategoryStore: (categories, numberOfPages, currentPage, totalRecords) =>
    set(() => ({
      categories: categories,
      numberOfPages: numberOfPages,
      currentPage: currentPage,
      totalRecords: totalRecords,
    })),
  setCurrentPage: (currentPage) => set(() => ({ currentPage: currentPage })),
  addCategory: (id, name, code) =>
    set((store) => ({
      categories: [{ id, name, code }, ...store.categories].slice(0, maxSize),
      totalRecords: Number(store.totalRecords) + 1,
      numberOfPages: Math.ceil(store.totalRecords / maxSize),
      currentPage: 1,
    })),
  deleteCategory: (code) =>
    set((store) => ({
      tasks: store.categories.filter((category) => category.code !== code),
    })),
});

export const useCategoryStore = createWithEqualityFn(store);
