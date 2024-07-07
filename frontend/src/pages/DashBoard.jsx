import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { plus } from "../assets/icons";
import OrderForm from "../components/order/OrderForm";
import OrdersTable from "../components/order/OrdersTable";
import Pagination from "../components/Pagination";
import { useGetOrders } from "../hooks/order/useGetOrders";
import { useGetOrdersHold } from "../hooks/order/useGetOrdersHold";
import { useOrderHoldStore } from "../store/useOrderHoldStore";
import { useOrderStore } from "../store/useOrderStore";
import { useOrderVisbility } from "../store/useOrderVisibility";

function DashBoard() {
  const onOrder = useOrderVisbility((state) => state.onOrderPage);
  const setOnOrder = useOrderVisbility((state) => state.setOnOrderPage);
  const onOrderFormVisible = useOrderVisbility(
    (state) => state.onOrderFormVisible
  );
  const orderFormVisible = useOrderVisbility((state) => state.orderFormVisible);
  const setAction = useOrderVisbility((state) => state.setAction);
  const [selectedOrders, setSelectedOrders] = useState([]);

  const totalAmount = onOrder
    ? useOrderStore((state) => state.totalAmount)
    : useOrderHoldStore((state) => state.totalAmount);
  const {
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
    data: orderData,
    isFetching: isOrderFetching,
    isPreviousData: isOrderPreviousData,
  } = useGetOrders();
  const {
    isLoading: isOrderHoldLoading,
    isError: isOrderHoldError,
    error: orderHoldError,
    data: orderHoldData,
    isFetching: isOrderHoldFetching,
    isPreviousData: isOrderHoldPreviousData,
  } = useGetOrdersHold();

  return (
    <div className="w-full py-6" id="dashboard">
      <h2>DASHBOARD</h2>
      {/* CARD */}
      <div className="w-full card rounded-[10px] mt-[16px] justify-normal items-start pt-[32px] pb-[23px]">
        {/* BEFORE BORDER */}
        <div className="w-full flex flex-col justify-between px-[32px] border-solid border-abbaGray border-b-2">
          {/* TOP PART  */}
          <div className="w-full flex flex-row justify-between">
            {/* LEFT BUTTONS */}
            <div className="flex flex-row justify-between">
              <button
                className={`w-[166px] h-[45px] ${
                  onOrder ? "blueButton" : "grayButton"
                } hover:blueButton`}
                onClick={() => setOnOrder(true)}
                id="dashboard-order-button"
              >
                Order
              </button>
              <button
                className={`w-[166px] h-[45px] ml-[38px] ${
                  onOrder ? "grayButton" : "blueButton"
                } hover:blueButton`}
                onClick={() => setOnOrder(false)}
                id="dashboard-hold-button"
              >
                Hold
              </button>
            </div>

            {/* RIGHT BUTTONS */}
            {onOrder && (
              <div
                className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaGreen rounded-md px-[27px] shadow cursor-pointer"
                onClick={() => {
                  setAction("add");
                  onOrderFormVisible();
                }}
                id="Order-add-button"
              >
                <img src={plus} className="w-[15px] h-[15px] fill-white" />
                <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
                  Add
                </h3>
              </div>
            )}
          </div>
          {/* TABLE */}
          <div className="w-full mt-[38px]">
            <OrdersTable
              selectedOrders={selectedOrders}
              setSelectedOrders={setSelectedOrders}
              isFetching={onOrder ? isOrderFetching : isOrderHoldFetching}
              isError={onOrder ? isOrderError : isOrderHoldError}
            />
          </div>
          {/* PAGINATION */}
          <div className="pt-[22px] pb-[13px]">
            <Pagination
              type={onOrder ? "ORDER" : "HOLD"}
              isLoading={onOrder ? isOrderLoading : isOrderHoldLoading}
              isError={onOrder ? isOrderError : isOrderHoldError}
              isFetching={onOrder ? isOrderFetching : isOrderHoldFetching}
              isPreviousData={
                onOrder ? isOrderPreviousData : isOrderHoldPreviousData
              }
              error={onOrder ? orderError : orderHoldError}
              data={onOrder ? orderData : orderHoldData}
            />
          </div>
        </div>

        {/* AFTER BORDER */}
        <div className="w-full flex flex-row justify-end pt-[24px] pr-[90px]">
          <h3
            className="flex font-semibold mr-[100px]"
            id="dashboard-total-amount"
          >
            Overall Total Amount
          </h3>
          <h3 className="font-semibold">
            PHP {totalAmount && `${totalAmount}`}
          </h3>
        </div>
      </div>

      {/* FORM MODAL */}
      {orderFormVisible && (
        <div className="overlay">
          <OrderForm />
        </div>
      )}

      {/* TOASTER */}
      <ToastContainer />
    </div>
  );
}

export default DashBoard;
