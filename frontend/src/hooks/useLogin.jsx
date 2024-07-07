import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../api";
import { useUserStore } from "../store/useUserStore";

const generateToken = async (formData, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });
    const feedBack = await API.post(`auth/login`, formData);
    return { data: feedBack.data, toastId: toastId };
  } catch (error) {
    throw {
      error: error.response ? error.response.data : error,
      toastId: toastId,
    };
  }
};

export const useLogin = () => {
  const login = useUserStore((state) => state.setLogin);
  const navigate = useNavigate();
  let toastId;
  const mutation = useMutation({
    mutationFn: (formData) => generateToken(formData, toastId),
    onSuccess: async ({ data, toastId }) => {
      login(data);
      toast.update(toastId, {
        render: "Successfully added a item",
        type: "success",
        autoClose: 3000,
        theme: "colored",
        isLoading: false,
      });

      navigate("/welcome");
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        toast.update(toastId, {
          render: error.message ? error.message : error,
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
