import React from "react";
import { crossMarkCircle } from "../../assets/icons";
import { useState } from "react";
import Calculator from "../Calculator";
import CustomDropdown from "../CustomDropDown";
import { useGetCustomerInfinite } from "../../hooks/customer/useGetCustomerInfinite";
import { useOrderItems } from "../../store/useOrderItems";
import { useAddOrder } from "../../hooks/order/useAddOrder";
import { useOrderVisbility } from "../../store/useOrderVisibility";
import { useEditOrder } from "../../hooks/order/useEditOrder";

function formatWithCommas(number) {
  return number.toLocaleString();
}

function ChargeOrderForm() {
  const total = useOrderItems((state) => state.amount);
  const setAmount = useOrderItems((state) => state.setAmount);
  const setStatus = useOrderItems((state) => state.setStatus);
  const [q, setQ] = useState("");
  const selectedCustomer = useOrderItems((state) => state.customer);
  const setSelectedCustomer = useOrderItems((state) => state.setCustomer);
  const [customerError, setCustomerError] = useState("");
  const setChargeOrderFormVisible = useOrderVisbility(
    (state) => state.setChargeOrderFormVisible
  );
  const [displayContent, setDisplayContent] = useState(
    formatWithCommas(parseFloat(String(total)))
  );

  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data,
    status,
    error,
  } = useGetCustomerInfinite(q);

  const action = useOrderVisbility((state) => state.action);
  const mutate = action == "add" ? useAddOrder() : useEditOrder();
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const number = parseFloat(displayContent.replace(/,/g, ""));
      if (total > number) {
        throw new Error("Payment is not enough");
      }

      setStatus("charged");
      setAmount(number);
      mutate.mutate();
    } catch (e) {
      showToastError(e.message);
    }
  };

  return (
    <>
      <div
        className="w-[607px] card bg-white z-10 justify-normal"
        id="charge-form"
      >
        <div className="h-[45px] w-full bg-primary rounded-[10px] flex flex-row justify-between items-center px-[31px]">
          <h3 className="font-golos font-semibold tracking-tight text-white">
            Payment
          </h3>
          <img
            src={crossMarkCircle}
            className="fill-white w-[19px] h-[19px] cursor-pointer"
            onClick={() => setChargeOrderFormVisible(false)}
            id="charge-form-x-button"
          />
        </div>
        <form
          className="w-full h-full flex-1 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="w-full h-full flex flex-col gap-5 px-[30px] py-[18px] border-b-2 border-[#DFE0E4]">
            <div className="relative mb-[25px] mt-[10px]">
              <label className="form-label">
                <span className="text-primary">Customer</span>
                <span className="text-abbaRed">*</span>
              </label>
              <CustomDropdown
                data={data}
                selectedRecord={selectedCustomer}
                setSelectedRecord={setSelectedCustomer}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                status={status}
                error={error}
                query={q}
                setQuery={setQ}
                frontendError={customerError}
                setFrontendError={setCustomerError}
                type={"customer"}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {customerError}
              </p>
            </div>
            <div className="flex flex-col">
              <label className="form-label">
                <span className="text-primary">Amount</span>
                <span className="text-abbaRed">*</span>
              </label>
              <Calculator
                displayContent={displayContent}
                setDisplayContent={setDisplayContent}
              />
            </div>
          </div>
          <div className="flex flex-row justify-end items-center py-[18px] pr-[30px]">
            <button
              className="grayButton w-[125px] h-[45px] mr-[21px]"
              onClick={() => setChargeOrderFormVisible(false)}
              id="charge-form-close-button"
            >
              Close
            </button>

            <button className="blueButton w-[125px] h-[45px]" type="submit">
              Charge
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ChargeOrderForm;
