import { useRef, useCallback } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useGetCategoryInfinite } from "../../hooks/category/useGetCategoryInfinite";
import OrderCategoryBox from "./OrderCategoryBox";

function OrderCategoryScroll({ activeCategory, setActiveCategory, setQ }) {
  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data,
    status,
    error,
  } = useGetCategoryInfinite();

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (entry) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          // "We are near the last category!"
          fetchNextPage();
        }
      });

      if (entry) intObserver.current.observe(entry);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === "error")
    return <p className="text-center text-abbaRed">Error: {error.message}</p>;

  const content = data?.pages.map((pg) => {
    return pg.results.map((category, i) => {
      return (
        <OrderCategoryBox
          ref={pg.results.length === i + 1 ? lastPostRef : null}
          key={category.id}
          category={category}
          activeCategory={activeCategory}
          setQ={setQ}
          setActiveCategory={setActiveCategory}
        />
      );
    });
  });

  return (
    <div
      className="card-gray h-full w-[197px] py-[22px] pl-[32px] pr-[10px]"
      id="order-form-category-scroll"
    >
      <Scrollbars
      // onUpdate={handleUpdate}
      // style={{ backGroundColor: "red" }}
      >
        {data ? (
          data.pages[0].results.length > 0 ? (
            <> {content}</>
          ) : (
            <p className="text-abbaGray">There's no data.</p>
          )
        ) : (
          <p className="text-abbaGray">
            Please choose a category to show an item list.
          </p>
        )}
        {isFetchingNextPage && (
          <p className="text-center text-abbaGray">
            Loading More Categories...
          </p>
        )}
      </Scrollbars>
    </div>
  );
}

export default OrderCategoryScroll;
