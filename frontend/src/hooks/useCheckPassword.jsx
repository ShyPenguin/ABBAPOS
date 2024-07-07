import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../api";
import { useOrderVisbility } from "../store/useOrderVisibility";
import { useUserStore } from "../store/useUserStore";

const checkPassword = async (formData, token, toastId) => {
  try {
    toastId = toast.loading("Loading...", {
      position: "top-right",
      theme: "dark",
    });

    const feedBack = await API.post("check-password/", formData, {
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

export const useCheckpassword = () => {
  let toastId;
  const token = useUserStore((state) => state.user.token);
  const setChargeOrderFormVisible = useOrderVisbility(
    (state) => state.setChargeOrderFormVisible
  );
  const onOrderFormVisible = useOrderVisbility(
    (state) => state.onOrderFormVisible
  );

  const action = useOrderVisbility((state) => state.action);
  const setAuthenticationFormVisible = useOrderVisbility(
    (state) => state.setAuthenticationFormVisible
  );
  const mutation = useMutation({
    mutationKey: ["checkManagerPassword"],
    mutationFn: (formData) => checkPassword(formData, token, toastId),
    onSuccess: ({ data, toastId }) => {
      toast.dismiss();

      if (action === "edit") {
        setAuthenticationFormVisible(false);
        onOrderFormVisible();
      } else {
        setChargeOrderFormVisible(true);
      }
    },
    onError: ({ error, toastId }) => {
      setTimeout(() => {
        const message = capitalizeFirstLetter(error.message);

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
