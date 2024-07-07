import { useInfiniteQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useUserStore } from "../../store/useUserStore";

const getCategories = async (pageParam = 1, q = "", token) => {
  try {
    const feedBack = await API.get(
      `category/?page=${pageParam}&name=${q}
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

export const useGetCategoryInfinite = (q = "") => {
  const token = useUserStore((store) => store.user.token);
  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data,
    status,
    error,
  } = useInfiniteQuery(
    ["categoryInfinite", q],
    ({ pageParam = 1 }) => getCategories(pageParam, q, token),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.next ? pages.length + 1 : undefined;
      },
    }
  );

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    status,
    error,
  };
};
