import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useCustomerStore } from "../../store/useCustomerStore";
import { useUserStore } from "../../store/useUserStore";

const deleteCustomer = async (id, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.delete(`customers/${id}/`, {
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

export const useDeleteCustomer = (setIsDeleteForm) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useCustomerStore((state) => state.currentPage);
  const setPage = useCustomerStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["deleteCustomer"],
    mutationFn: (id) => deleteCustomer(id, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["customers", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully deleted a customer",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setIsDeleteForm(false);
    },
    onError: ({ error, toastId }) => {
      toast.update(toastId, {
        render: " Customer: " + " " + error.detail,
        type: "error",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
    },
  });

  return mutation;
};
