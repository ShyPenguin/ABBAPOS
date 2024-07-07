import { useInfiniteQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useUserStore } from "../../store/useUserStore";

const getSearchItems = async (pageParam = 1, q, category, token) => {
  try {
    const feedBack = await API.get(
      `items/search/?category=${category}&name=${q}&page=${pageParam}
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

export const useSearchItemInfinite = (q, category) => {
  const token = useUserStore((store) => store.user.token);
  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data,
    status,
    error,
  } = useInfiniteQuery(
    ["itemInfinite", q, category],
    ({ pageParam = 1 }) => getSearchItems(pageParam, q, category, token),
    {
      getNextPageParam: (lastPage, pages) => {
        return lastPage.next ? pages.length + 1 : undefined;
      },
      enabled: !!q || !!category,
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
