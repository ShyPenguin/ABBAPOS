import { useQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useOrderStore } from "../../store/useOrderStore";
import { useUserStore } from "../../store/useUserStore";

const getOrders = async (page = 1, token) => {
  try {
    const feedBack = await API.get(`order/?page=${page}`, {
      headers: { Authorization: `Token ${token}` },
    });

    return feedBack.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const useGetOrders = () => {
  const orderStore = useOrderStore((state) => state.setOrderStore);
  const page = useOrderStore((state) => state.currentPage);
  const token = useUserStore((state) => state.user.token);

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    isSuccess,
  } = useQuery(["orders", page], () => getOrders(page, token), {
    keepPreviousData: true,
  });

  if (isSuccess) {
    const listOfOrders = data.results;
    const total = data.count;
    orderStore(
      listOfOrders,
      Math.ceil(total / 6),
      page,
      total,
      data.total_amount
    );
  }

  return {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  };
};
