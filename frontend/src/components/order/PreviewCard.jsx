import { toast } from "react-toastify";
import { useOrderItems } from "../../store/useOrderItems";
import PaymentForm from "../PaymentForm";
import PreviewTable from "./PreviewTable";
import "react-toastify/dist/ReactToastify.css";
import { useAddOrder } from "../../hooks/order/useAddOrder";
import AuthenticationForm from "../AuthenticationForm";
import { useEditOrder } from "../../hooks/order/useEditOrder";
import { useOrderVisbility } from "../../store/useOrderVisibility";
import ChargeOrderForm from "./ChargeOrderForm";

function PreviewCard() {
  const amount = useOrderItems((state) => state.amount);
  const orderItems = useOrderItems((state) => state.order_items);
  const setStatus = useOrderItems((state) => state.setStatus);

  const paymentFormVisible = useOrderVisbility(
    (state) => state.paymentFormVisible
  );
  const authenticationFormVisible = useOrderVisbility(
    (state) => state.authenticationFormVisible
  );
  const chargeOrderFormVisible = useOrderVisbility(
    (state) => state.chargeOrderFormVisible
  );
  const setPaymentFormVisible = useOrderVisbility(
    (state) => state.setPaymentFormVisible
  );
  const setAuthenticationFormVisible = useOrderVisbility(
    (state) => state.setAuthenticationFormVisible
  );
  const setStatusVisible = useOrderVisbility((state) => state.setStatusVisible);
  const setChargeOrderFormVisible = useOrderVisbility(
    (state) => state.setChargeOrderFormVisible
  );

  const action = useOrderVisbility((state) => state.action);

  const mutateOrder = action == "add" ? useAddOrder() : useEditOrder();

  const handleOnClickPayCharge = (value) => {
    if (orderItems.length < 1) {
      toast.error("Please select an item", {
        autoClose: 4000,
        pauseOnHover: true,
        theme: "colored",
      });
      return;
    }

    switch (value) {
      case "pay":
        setStatusVisible("pay");
        setPaymentFormVisible(true);
        break;
      case "charge":
        setStatusVisible("charge");
        action == "add"
          ? setAuthenticationFormVisible(true)
          : setChargeOrderFormVisible(true);
        break;
    }
  };

  const handleOnClickHold = () => {
    if (orderItems.length < 1) {
      toast.error("Please select an item", {
        autoClose: 4000,
        pauseOnHover: true,
        theme: "colored",
      });
      return;
    }

    setStatus("hold");
    mutateOrder.mutate();
  };
  return (
    <div
      className="relative w-full h-full card-gray pt-[12px] px-[20px]"
      id="previewCard"
    >
      <h3 className="font-semibold">Preview</h3>
      {/* TABLE */}
      <PreviewTable />

      {/* BOTTOM PART */}
      <div className="absolute bottom-0 left-[20px] right-[20px]">
        {/* TOTAL */}
        <div className="flex w-full justify-between py-[16px] border-solid border-y-2 border-[#F2F3F8] ">
          <h3 className="font-semibold">
            Total
            <span className="text-[13px] font-golos text-[#9C9C9C] font-normal tracking-tight">
              {" (incl. vat)"}
            </span>
          </h3>
          <h3 className="font-semibold tracking-tight text-abbaGreen pr-[33px]">
            PHP {amount}
          </h3>
        </div>
        {/* ACTION BUTTONS */}
        <div className="flex w-full justify-between py-[24px]">
          <button
            className="previewButton w-[96px] h-[44px]"
            onClick={() => handleOnClickPayCharge("pay")}
            id="previewCard-pay-button"
          >
            Pay
          </button>
          <button className="previewButton w-[96px] h-[44px]">Discount</button>
          <button
            className="previewButton w-[96px] h-[44px]"
            onClick={() => handleOnClickPayCharge("charge")}
            id="previewCard-charge-button"
          >
            Charge
          </button>
          <button
            className="previewButton w-[96px] h-[44px]"
            onClick={() => handleOnClickHold()}
            id="previewCard-hold-button"
          >
            Hold
          </button>
        </div>
      </div>

      {(paymentFormVisible ||
        authenticationFormVisible ||
        chargeOrderFormVisible) && (
        <div className="overlay">
          {paymentFormVisible && <PaymentForm />}
          {action == "add" && authenticationFormVisible && (
            <AuthenticationForm />
          )}
          {action == "edit" && chargeOrderFormVisible && <ChargeOrderForm />}
        </div>
      )}
    </div>
  );
}

export default PreviewCard;
