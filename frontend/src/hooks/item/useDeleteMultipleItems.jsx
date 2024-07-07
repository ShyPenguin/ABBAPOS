import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useItemStore } from "../../store/useItemStore";
import { useUserStore } from "../../store/useUserStore";

const deleteMultipleItems = async (data, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });
    // Iterate through the array of itemIds and delete each item individually.
    const feedbackPromises = data.map((item) => {
      return API.delete(`items/${item.id}/`, {
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

export const useDeleteMultipleItems = (setIsDeleteForm) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useItemStore((state) => state.currentPage);
  const setPage = useItemStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["deleteMultipleItems"],
    mutationFn: (data) => deleteMultipleItems(data, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["items", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully deleted items",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setIsDeleteForm(false);
    },

    onError: ({ error, toastId }) => {
      toast.update(toastId, {
        render: " Delete: " + " " + error.detail,
        type: "error",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
    },
  });
  return mutation;
};
