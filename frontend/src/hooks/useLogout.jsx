import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API } from "../api";

export const useLogout = () => {
  const logout = useUserStore((state) => state.setLogout);
  const token = useUserStore((state) => state.user.token);

  const deleteToken = async () => {
    try {
      const feedBack = await API.delete(`auth/logout`, {
        headers: { Authorization: `Token ${token}` },
      });
      return feedBack.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: deleteToken,
    onSuccess: (data) => {
      logout();
      navigate("/");

      toast.success("Logout successful", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },

    onError: (error) => {
      toast.error("Server is unreachable. Unable to logout.", {
        toastId: 1,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
  });

  return mutation;
};
