import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useUserStore } from "../../store/useUserStore";

const deleteMultipleCategory = async (data, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    // Iterate through the array of categories and delete each category individually.
    const feedbackPromises = data.map((category) => {
      return API.delete(`category/${category.id}/`, {
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

export const useDeleteMultipleCategory = (setIsDeleteForm) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useCategoryStore((state) => state.currentPage);
  const setPage = useCategoryStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["deleteMultipleCategory"],
    mutationFn: (data) => deleteMultipleCategory(data, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully deleted categories",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
      setIsDeleteForm(false);
    },

    onError: ({ error, toastId }) => {
      toast.update(toastId, {
        render: " Category: " + " " + error.detail,
        type: "error",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
    },
  });
  return mutation;
};
