import { useQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useUserStore } from "../../store/useUserStore";

const getCategories = async (page = 1, token) => {
  try {
    const feedBack = await API.get(
      `category/?page=${page}
    `,
      {
        headers: { Authorization: `Token ${token}` },
      }
    );

    return feedBack.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const useGetCategory = () => {
  const categoryStore = useCategoryStore((state) => state.setCategoryStore);
  const page = useCategoryStore((state) => state.currentPage);
  const token = useUserStore((state) => state.user.token);

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    isSuccess,
  } = useQuery(["categories", page], () => getCategories(page, token), {
    keepPreviousData: true,
  });

  if (isSuccess) {
    const listOfCategories = data.results;
    const total = data.count;
    categoryStore(listOfCategories, Math.ceil(total / 6), page, total);
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
