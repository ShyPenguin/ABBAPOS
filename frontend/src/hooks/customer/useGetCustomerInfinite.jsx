import { useInfiniteQuery } from "@tanstack/react-query";
import { API } from "../../api";
import { useUserStore } from "../../store/useUserStore";

const getCustomer = async (pageParam = 1, q = "", token) => {
  try {
    const feedBack = await API.get(
      `customers/?page=${pageParam}&name=${q}
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

export const useGetCustomerInfinite = (q = "") => {
  const token = useUserStore((store) => store.user.token);
  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data,
    status,
    error,
  } = useInfiniteQuery(
    ["customerInfinite", q],
    ({ pageParam = 1 }) => getCustomer(pageParam, q, token),
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
