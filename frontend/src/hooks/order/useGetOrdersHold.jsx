import { useQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useOrderHoldStore } from "../../store/useOrderHoldStore";
import { useUserStore } from "../../store/useUserStore";

const getOrdersHold = async (page = 1, token) => {
  try {
    const feedBack = await API.get(`order/?page=${page}&status=${"hold"}`, {
      headers: { Authorization: `Token ${token}` },
    });

    return feedBack.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const useGetOrdersHold = () => {
  const orderStore = useOrderHoldStore((state) => state.setOrderStore);
  const page = useOrderHoldStore((state) => state.currentPage);
  const token = useUserStore((state) => state.user.token);

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    isSuccess,
  } = useQuery(["ordersHold", page], () => getOrdersHold(page, token), {
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
