import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useUserStore } from "../../store/useUserStore";

const deleteCategory = async (data, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.delete(`category/${data}/`, {
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

export const useDeleteCategory = (setIsDeleteForm) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useCategoryStore((state) => state.currentPage);
  const setPage = useCategoryStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: (data) => deleteCategory(data, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully deleted a category",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setIsDeleteForm(false);
    },
    onError: ({ error, toastId }) => {
      toast.update(toastId, {
        render: "Category: " + " " + error.detail,
        type: "error",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
    },
  });

  return mutation;
};
