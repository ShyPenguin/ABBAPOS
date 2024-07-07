import { useRef, useCallback } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useSearchItemInfinite } from "../../hooks/item/useSearchItemInfinite";
import { useOrderItems } from "../../store/useOrderItems";

function ItemList({ q, category }) {
  const orderItems = useOrderItems((state) => state.order_items);
  const addItem = useOrderItems((state) => state.addItem);
  const removeItem = useOrderItems((state) => state.removeItem);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    status,
    error,
  } = useSearchItemInfinite(q, category);

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (entry) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (entry) intObserver.current.observe(entry);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === "error")
    return <p className="text-center text-abbaRed">Error: {error.message}</p>;

  const handleOnClick = (checkedItem) => {
    if (orderItems.find((orderItem) => orderItem.item.id == checkedItem.id)) {
      removeItem(checkedItem);
    } else {
      addItem(checkedItem);
    }
  };

  const content = data?.pages.map((pg) => {
    return pg.results.map((item, i) => {
      return (
        <p
          className={`${
            orderItems.find((orderItem) => orderItem.item.id == item.id)
              ? "text-abbaGreen"
              : "text-primary"
          } text-center mt-[15px] cursor-pointer`}
          onClick={() => handleOnClick(item)}
          key={item.id}
          ref={pg.results.length === i + 1 ? lastPostRef : null}
        >
          {item.name}
        </p>
      );
    });
  });
  return (
    <div
      className="card-gray flex flex-col items-center h-full w-[322px] py-[20px]"
      id="order-form-item-list"
    >
      <h4 className="mb-[20px]">Item List</h4>
      <Scrollbars>
        {data ? (
          data.pages[0].results.length > 0 ? (
            <div className="flex flex-col">{content}</div>
          ) : (
            <p className="text-center text-abbaGray">There's no data.</p>
          )
        ) : (
          <p className="text-center text-abbaGray">
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

export default ItemList;
