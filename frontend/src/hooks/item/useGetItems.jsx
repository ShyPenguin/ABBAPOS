import { useQuery } from "@tanstack/react-query";
import { useItemStore } from "../../store/useItemStore";
import { API } from "../../api";
import { useUserStore } from "../../store/useUserStore";

const getItems = async (page = 1, token) => {
  try {
    const feedBack = await API.get(`items/?page=${page}`, {
      headers: { Authorization: `Token ${token}` },
    });
    return feedBack.data;
  } catch (error) {
    if (!error.response) {
      throw error.response ? error.response.data : error;
    }
  }
};

export const useGetItems = () => {
  const itemStore = useItemStore((state) => state.setItemStore);
  const page = useItemStore((state) => state.currentPage);
  const token = useUserStore((state) => state.user.token);

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    isSuccess,
  } = useQuery({
    queryKey: ["items", page],
    queryFn: () => getItems(page, token),
    keepPreviousData: true,
  });

  if (isSuccess) {
    const listOfItems = data.results;
    const total = data.count;
    itemStore(listOfItems, Math.ceil(total / 6), page, total);
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
