import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../../api";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useUserStore } from "../../store/useUserStore";

const putCategory = async (id, formData, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.put(`category/${id}/`, formData, {
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

export const useEditCategory = (setIsCategoryFormVisible) => {
  const queryClient = useQueryClient();

  let toastId;

  const page = useCategoryStore((state) => state.currentPage);
  const token = useUserStore((state) => state.user.token);

  const mutation = useMutation({
    mutationKey: ["editCategory"],
    mutationFn: ({ id, formData }) => {
      return putCategory(id, formData, token, toastId);
    },
    onSuccess: async ({ data, toastId }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", page] });
      toast.update(toastId, {
        render: "Successfully edited a category",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      setIsCategoryFormVisible(false);
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        let message;
        if (error.code && Array.isArray(error.code) && error.code.length > 0) {
          message = capitalizeFirstLetter(error.code[0]);
        } else if (
          error.price &&
          Array.isArray(error.price) &&
          error.price.length > 0
        ) {
          message = capitalizeFirstLetter(error.price[0]);
        } else if (
          error.unit_of_measure &&
          Array.isArray(error.unit_of_measure) &&
          error.unit_of_measure.length > 0
        ) {
          message = capitalizeFirstLetter(error.unit_of_measure[0]);
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
