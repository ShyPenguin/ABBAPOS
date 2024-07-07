import { leftArrow, rightArrow } from "../assets/icons";
import { useCategoryStore } from "../store/useCategoryStore";
import { useCustomerStore } from "../store/useCustomerStore";
import { useItemStore } from "../store/useItemStore";
import { useOrderHoldStore } from "../store/useOrderHoldStore";
import { useOrderStore } from "../store/useOrderStore";

function Pagination({
  type,
  isLoading,
  isError,
  error,
  data,
  isFetching,
  isPreviousData,
}) {
  let currentPage;
  let totalRecords;
  let numberOfPages;
  let setCurrentPage;

  switch (type) {
    case "ITEM":
      currentPage = useItemStore((state) => state.currentPage);
      totalRecords = useItemStore((state) => state.totalRecords);
      numberOfPages = useItemStore((state) => state.numberOfPages);
      setCurrentPage = useItemStore((state) => state.setCurrentPage);
      break;
    case "CUSTOMER":
      currentPage = useCustomerStore((state) => state.currentPage);
      totalRecords = useCustomerStore((state) => state.totalRecords);
      numberOfPages = useCustomerStore((state) => state.numberOfPages);
      setCurrentPage = useCustomerStore((state) => state.setCurrentPage);
      break;
    case "ORDER":
      currentPage = useOrderStore((state) => state.currentPage);
      totalRecords = useOrderStore((state) => state.totalRecords);
      numberOfPages = useOrderStore((state) => state.numberOfPages);
      setCurrentPage = useOrderStore((state) => state.setCurrentPage);
      break;
    case "HOLD":
      currentPage = useOrderHoldStore((state) => state.currentPage);
      totalRecords = useOrderHoldStore((state) => state.totalRecords);
      numberOfPages = useOrderHoldStore((state) => state.numberOfPages);
      setCurrentPage = useOrderHoldStore((state) => state.setCurrentPage);
      break;
    case "CATEGORY":
      currentPage = useCategoryStore((state) => state.currentPage);
      totalRecords = useCategoryStore((state) => state.totalRecords);
      numberOfPages = useCategoryStore((state) => state.numberOfPages);
      setCurrentPage = useCategoryStore((state) => state.setCurrentPage);
      break;
  }

  if (isLoading) {
    return <h2>{"Loading...."}</h2>;
  }
  return (
    <div className="w-full flex flex-row justify-between" id="pagination">
      <p className="text-primary">{`Total Record/s:${totalRecords}`}</p>
      <div className="flex flex-row h-[23px] justify-between gap-5">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage == 1}
          id="pagination-previous-button"
        >
          <img src={leftArrow} className="w-full h-full cursor-pointer" />
        </button>
        <div
          className={`w-full flex flex-row items-center ${
            numberOfPages <= 1 ? "justify-center" : "justify-between"
          }`}
        >
          {numberOfPages > 0 ? (
            Array.from({ length: numberOfPages }, (_, index) => (
              <p
                className={
                  index + 1 == currentPage ? `text-primary` : "text-[#66809B]"
                }
                key={index}
              >
                {index + 1}
              </p>
            ))
          ) : (
            <p className={"text-[#66809B]"}> 1</p>
          )}
        </div>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage == numberOfPages}
          id="pagination-next-button"
        >
          <img src={rightArrow} className="w-full h-full cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
