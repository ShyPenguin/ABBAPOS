import { useQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useCustomerStore } from "../../store/useCustomerStore";
import { useUserStore } from "../../store/useUserStore";

const getCustomers = async (page = 1, token) => {
  try {
    const feedBack = await API.get(`customers/?page=${page}`, {
      headers: { Authorization: `Token ${token}` },
    });
    return feedBack.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const useGetCustomers = () => {
  const customerStore = useCustomerStore((state) => state.setCustomerStore);
  const page = useCustomerStore((state) => state.currentPage);
  const token = useUserStore((state) => state.user.token);
  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    isSuccess,
  } = useQuery(["customers", page], () => getCustomers(page, token), {
    keepPreviousData: true,
  });

  if (isSuccess) {
    const listOfCustomers = data.results;
    const total = data.count;
    customerStore(listOfCustomers, Math.ceil(total / 6), page, total);
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
