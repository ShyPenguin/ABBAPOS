import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../api";
import { useOrderItems } from "../../store/useOrderItems";
import { useOrderStore } from "../../store/useOrderStore";
import { useOrderVisbility } from "../../store/useOrderVisibility";
import { useUserStore } from "../../store/useUserStore";

const postOrder = async (formData, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.post("order/", formData, {
      headers: { Authorization: `Token ${token}` },
    });
    return { data: feedBack.data, toastId: toastId };
  } catch (error) {
    throw {
      error: error.response ? error.response.data : error,
      toastId: toastId,
    };
  }
};

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const useAddOrder = () => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useOrderStore((state) => state.currentPage);
  const setPage = useOrderStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  //visiblity
  const removeOrderFormVisible = useOrderVisbility(
    (state) => state.removeOrderFormVisible
  );
  const setOnOrder = useOrderVisbility((state) => state.setOnOrderPage);
  // Data
  const orderItems = useOrderItems((state) => state.order_items);
  const amount = useOrderItems((state) => state.amount);
  const status = useOrderItems((state) => state.status);
  const customer = useOrderItems((state) => state.customer);
  const discount = useOrderItems((state) => state.discount);
  const paymentMethod = useOrderItems((state) => state.paymentMethod);
  const formData = {
    order_items: orderItems,
    amount: amount,
    status: status,
    discount: discount,
  };

  if (customer) formData.customer = customer.id;
  if (paymentMethod) formData.payment_method = paymentMethod;

  // remove all the data
  const empty = useOrderItems((state) => state.empty);
  const mutation = useMutation({
    mutationKey: ["addOrder"],
    mutationFn: () => postOrder(formData, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully created an order",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
      empty();
      removeOrderFormVisible(false);
      if (status == "hold") {
        queryClient.invalidateQueries({ queryKey: ["ordersHold", 1] });
        setOnOrder(false);
      }
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        let message;
        if (error.code && Array.isArray(error.code) && error.code.length > 0) {
          message = capitalizeFirstLetter(error.code[0]);
        } else if (
          error.amount &&
          Array.isArray(error.amount) &&
          error.amount.length > 0
        ) {
          message = capitalizeFirstLetter(error.amount[0]);
        } else if (
          error.status &&
          Array.isArray(error.status) &&
          error.status.length > 0
        ) {
          message = capitalizeFirstLetter(error.status[0]);
        } else {
          message = capitalizeFirstLetter(error.detail);
        }

        toast.update(toastId, {
          render: message,
          type: "error",
          autoClose: 3000,
          theme: "colored",
          isLoading: false,
        });
      }, 1);
    },
  });

  return mutation;
};
