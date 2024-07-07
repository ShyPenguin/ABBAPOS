import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API } from "../../api";
import { useItemStore } from "../../store/useItemStore";
import { useUserStore } from "../../store/useUserStore";

const deleteItem = async (data, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.delete(`items/${data}/`, {
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

export const useDeleteItem = (setIsDeleteForm) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useItemStore((state) => state.currentPage);
  const setPage = useItemStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["deleteItem"],
    mutationFn: (data) => deleteItem(data, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["items", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully deleted a item",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setIsDeleteForm(false);
    },
    onError: ({ error, toastId }) => {
      toast.update(toastId, {
        render: " Item: " + " " + error.detail,
        type: "error",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });
    },
  });

  return mutation;
};
