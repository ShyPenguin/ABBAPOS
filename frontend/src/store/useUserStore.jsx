import { create } from "zustand";
import { persist } from "zustand/middleware";

//Delete and add Order haven't been used. But It might be used in the future.
const store = (set) => ({
  user: {
    token: null,
    user_id: null,
    email: null,
    first_name: null,
    last_name: null,
    mobile_number: null,
    business: null,
  },
  setLogin: (data) => set(() => ({ user: data })),
  setLogout: () =>
    set(() => ({
      user: {
        token: null,
        user_id: null,
        email: null,
        first_name: null,
        last_name: null,
        mobile_number: null,
        business: null,
      },
    })),
});

export const useUserStore = create(persist(store, { name: "userStore" }));
