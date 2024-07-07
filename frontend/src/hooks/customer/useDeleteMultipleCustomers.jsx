import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useCustomerStore } from "../../store/useCustomerStore";
import { useUserStore } from "../../store/useUserStore";

const deleteMultipleCustomer = async (data, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    // Iterate through the array of customers and delete each category individually.
    const feedbackPromises = data.map((customer) => {
      return API.delete(`customers/${customer.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
    });

    const feedbacks = await Promise.all(feedbackPromises);

    return { data: feedbacks.map((feedback) => feedback.data), toastId };
  } catch (error) {
    throw {
      error: error.response ? error.response.data : error,
      toastId: toastId,
    };
  }
};

export const useDeleteMultipleCustomers = (setIsDeleteForm) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useCustomerStore((state) => state.currentPage);
  const setPage = useCustomerStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["deleteMultipleCustomer"],
    mutationFn: (data) => deleteMultipleCustomer(data, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["customers", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully deleted customers",
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
