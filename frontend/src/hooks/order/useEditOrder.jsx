import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../api";
import { useOrderHoldStore } from "../../store/useOrderHoldStore";
import { useOrderItems } from "../../store/useOrderItems";
import { useOrderStore } from "../../store/useOrderStore";
import { useOrderVisbility } from "../../store/useOrderVisibility";
import { useUserStore } from "../../store/useUserStore";

const putOrder = async (id, formData, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.put(`order/${id}/`, formData, {
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

export const useEditOrder = () => {
  const queryClient = useQueryClient();

  let toastId;
  const pageHold = useOrderHoldStore((state) => state.currentPage);
  const page = useOrderStore((state) => state.currentPage);
  const setPage = useOrderStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  //visiblity
  const removeOrderFormVisible = useOrderVisbility(
    (state) => state.removeOrderFormVisible
  );
  const onOrder = useOrderVisbility((state) => state.onOrderPage);
  const setOnOrder = useOrderVisbility((state) => state.setOnOrderPage);
  // Data
  const id = useOrderItems((state) => state.id);
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
    mutationKey: ["putOrder"],
    mutationFn: () => putOrder(id, formData, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully updated an order",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
      empty();
      removeOrderFormVisible(false);

      if (status == "hold" || !onOrder) {
        queryClient.invalidateQueries({ queryKey: ["ordersHold", pageHold] });
      }

      if (status == "hold") {
        setOnOrder(false);
      } else {
        setOnOrder(true);
      }
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        const message = capitalizeFirstLetter(error.detail);

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
