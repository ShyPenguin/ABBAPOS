import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../api";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useUserStore } from "../../store/useUserStore";

const postCategory = async (formData, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.post("category/", formData, {
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

export const useAddCategory = (
  setIsPaymentFormVisible,
  setIsOrderFormVisible
) => {
  const queryClient = useQueryClient();

  let toastId;
  const page = useCategoryStore((state) => state.currentPage);
  const setPage = useCategoryStore((state) => state.setCurrentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["addCategory"],
    mutationFn: (formData) => postCategory(formData, token, toastId),
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", page] });
      setPage(1);
      toast.update(toastId, {
        render: "Successfully created a category",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setIsPaymentFormVisible(false);
      setIsOrderFormVisible(false);
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        let message;
        if (error.code && Array.isArray(error.code) && error.code.length > 0) {
          message = capitalizeFirstLetter(error.code[0]);
        } else if (
          error.name &&
          Array.isArray(error.name) &&
          error.name.length > 0
        ) {
          message = capitalizeFirstLetter(error.name[0]);
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
