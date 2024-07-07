import { createWithEqualityFn } from "zustand/traditional";

// State Management For DashBoard Visibilities. Such as the forms and the page.
const store = (set) => ({
  onOrderPage: true,
  orderFormVisible: false,
  authenticationFormVisible: false,
  chargeOrderFormVisible: false,
  paymentFormVisible: false,
  action: "", // edit or add
  statusVisible: "", // void or charge or pay or hold
  setOnOrderPage: (onOrderPage) =>
    set((store) => ({
      ...store,
      onOrderPage: onOrderPage,
    })),
  onOrderFormVisible: () =>
    set((store) => ({
      ...store,
      orderFormVisible: true,
    })),
  removeOrderFormVisible: () =>
    set(() => ({
      orderFormVisible: false,
      authenticationFormVisible: false,
      chargeOrderFormVisible: false,
      paymentFormVisible: false,
      action: "",
      statusVisible: "",
    })),
  setAuthenticationFormVisible: (authenticationFormVisible) =>
    set((store) => ({
      ...store,
      authenticationFormVisible: authenticationFormVisible,
    })),
  setPaymentFormVisible: (paymentFormVisible) =>
    set((store) => ({
      ...store,
      paymentFormVisible: paymentFormVisible,
    })),
  setChargeOrderFormVisible: (chargeOrderFormVisible) =>
    set((store) => ({
      ...store,
      chargeOrderFormVisible: chargeOrderFormVisible,
    })),
  setAction: (action) =>
    set((store) => ({
      ...store,
      action: action,
    })),
  setStatusVisible: (statusVisible) =>
    set((store) => ({
      ...store,
      statusVisible: statusVisible,
    })),
});

export const useOrderVisbility = createWithEqualityFn(store);
