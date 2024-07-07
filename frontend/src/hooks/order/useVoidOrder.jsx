import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useOrderItems } from "../../store/useOrderItems";
import { useOrderStore } from "../../store/useOrderStore";
import { useOrderVisbility } from "../../store/useOrderVisibility";
import { useUserStore } from "../../store/useUserStore";

const voidPassword = async (id, password, formData, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    await API.post(
      "check-password/",
      { password: password },
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

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

export const useVoidOrder = () => {
  const queryClient = useQueryClient();

  const removeOrderFormVisible = useOrderVisbility(
    (state) => state.removeOrderFormVisible
  );
  let toastId;
  const page = useOrderStore((state) => state.currentPage);
  const setPage = useOrderStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  // Data
  const formData = {
    status: "void",
  };

  // remove all the data
  const empty = useOrderItems((state) => state.empty);
  const mutation = useMutation({
    mutationKey: ["voidOrder"],
    mutationFn: ({ id, password }) =>
      voidPassword(id, password, formData, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully voided an order",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
      empty();
      removeOrderFormVisible();
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        let message;
        if (error.message) {
          message = capitalizeFirstLetter(error.message);
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
