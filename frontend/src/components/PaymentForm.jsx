import { crossMarkCircle } from "../assets/icons";
import { useState } from "react";
import { useOrderItems } from "../store/useOrderItems";
import { toast } from "react-toastify";
import Calculator from "./Calculator";
import { useAddOrder } from "../hooks/order/useAddOrder";
import { useOrderVisbility } from "../store/useOrderVisibility";
import { useEditOrder } from "../hooks/order/useEditOrder";

function formatWithCommas(number) {
  return number.toLocaleString();
}

function PaymentForm() {
  const total = useOrderItems((state) => state.amount);
  const setAmount = useOrderItems((state) => state.setAmount);
  const setStatus = useOrderItems((state) => state.setStatus);
  const setPaymentMethod = useOrderItems((state) => state.setPaymentMethod);

  const [displayContent, setDisplayContent] = useState(
    formatWithCommas(parseFloat(String(total)))
  );

  const setPaymentFormVisible = useOrderVisbility(
    (state) => state.setPaymentFormVisible
  );

  const action = useOrderVisbility((state) => state.action);
  const mutate = action == "add" ? useAddOrder() : useEditOrder();
  const showToastError = (message) => {
    toast.error(message, {
      autoClose: 5000,
      pauseOnHover: true,
      theme: "colored",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const paymentMethod = e.target.paymentMethod.value;
      if (!paymentMethod) {
        throw new Error("Please choose a payment method");
      }
      const number = parseFloat(displayContent.replace(/,/g, ""));
      if (total > number) {
        throw new Error("Payment is not enough");
      }

      setStatus("paid");
      setAmount(number);
      setPaymentMethod(paymentMethod);
      mutate.mutate();
    } catch (e) {
      showToastError(e.message);
    }
  };
  return (
    <>
      <div
        className="w-[930px] card bg-white z-10 flex flex-col"
        id="payment-form"
      >
        <div className="w-[930px] h-[50px] bg-primary rounded-[10px] flex flex-row justify-between items-center px-[31px]">
          <h3 className="font-golos font-semibold tracking-tight text-white">
            Payment Form
          </h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={crossMarkCircle}
              className="fill-white w-[19px] h-[19px] cursor-pointer"
              onClick={() => setPaymentFormVisible(false)}
              id="payment-form-x-button"
            />
          </div>
        </div>
        <form
          className="w-full h-full flex-1 flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="w-full h-full flex flex-col gap-5 px-[30px] py-[18px] border-b-2 border-[#DFE0E4]">
            <div className="relative mb-[25px] mt-[10px] text-[#32404F] font-golos text-[15px] font-normal leading-normal">
              <label className="form-label">
                <span className="text-primary font-semibold leading-normal font-golos text-[15px]">
                  Payment Method
                </span>
              </label>
              <div className="flex justify-between">
                <div className="flex flex-col w-[200px]">
                  <div className="mt-[20px]">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="debit_credit_card"
                        className="mr-[10px]"
                        id="payment-form-radio-debit-card"
                      />
                      Debit/Credit Card
                    </label>
                  </div>
                  <div className="mt-[10px]">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="gcash"
                        className="mr-[10px]"
                        id="payment-form-radio-gcash"
                      />
                      Gcash
                    </label>
                  </div>
                  <div className="mt-[10px]">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        className="mr-[10px]"
                        id="payment-form-radio-cash"
                      />
                      Cash
                    </label>
                  </div>
                </div>

                <Calculator
                  displayContent={displayContent}
                  setDisplayContent={setDisplayContent}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center py-[18px] pr-[30px]">
            <button
              className="grayButton w-[125px] h-[45px] mr-[21px]"
              onClick={() => setPaymentFormVisible(false)}
              id="payment-form-close-button"
            >
              Close
            </button>
            <button
              className="blueButton w-[125px] h-[45px]"
              type="submit"
              id="payment-form-submit-button"
            >
              Pay
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PaymentForm;
