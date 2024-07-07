import React, { useState } from "react";
import { crossMarkCircle } from "../assets/icons";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useCheckpassword } from "../hooks/useCheckPassword";
import ChargeOrderForm from "./order/ChargeOrderForm";
import { useVoidOrder } from "../hooks/order/useVoidOrder";
import { useOrderVisbility } from "../store/useOrderVisibility";
import { useOrderItems } from "../store/useOrderItems";

function AuthenticationForm() {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const chargeOrderFormVisible = useOrderVisbility(
    (state) => state.chargeOrderFormVisible
  );
  const statusVisible = useOrderVisbility((state) => state.statusVisible);
  const action = useOrderVisbility((state) => state.action);

  const setAuthenticationFormVisible = useOrderVisbility(
    (state) => state.setAuthenticationFormVisible
  );
  const setStatusVisible = useOrderVisbility((state) => state.setStatusVisible);
  const setAction = useOrderVisbility((state) => state.setAction);
  const mutate = statusVisible === "void" ? useVoidOrder() : useCheckpassword();

  const chosenID = useOrderItems((state) => state.id);
  const reference_number = useOrderItems((state) => state.reference_number);

  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirm = () => {
    if (statusVisible === "void") {
      mutate.mutate({ id: chosenID, password: password });
    } else {
      mutate.mutate({ password: password });
    }
  };

  const EndAdornmentPassword = ({ visible, setVisible }) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
        </IconButton>
      </InputAdornment>
    );
  };

  return (
    <>
      <div className="w-[477px] card bg-white z-10 justify-normal">
        <div className="h-[45px] w-full bg-primary rounded-[10px] flex flex-row justify-between items-center px-[31px]">
          <h3 className="font-golos font-semibold tracking-tight text-white">
            {`Reference No. ${reference_number && `${reference_number}`}`}
          </h3>
          <img
            src={crossMarkCircle}
            className="fill-white w-[19px] h-[19px] cursor-pointer"
            onClick={() => {
              setAction("");
              setStatusVisible("");
              setAuthenticationFormVisible(false);
            }}
            id="authentication-form-x-button"
          />
        </div>
        <div>
          <form className="w-full h-full flex-1 flex flex-col">
            <div className="w-full h-full flex flex-col gap-5 px-[30px] py-[18px]">
              <div className="relative mb-[25px] mt-[10px]">
                <label className="form-label">
                  <span className="text-primary text-center text-[25px] font-semibold">
                    AUTHENTICATION REQUIRED
                  </span>
                </label>
              </div>
            </div>
          </form>
          <div>
            <label className="form-label">
              <span className="text-primary text-[20px] font-medium">
                Password
              </span>
            </label>
            <TextField
              type={visible ? "text" : "password"}
              id="sign-up-password-field"
              className="w-full h-[45px] bg-white rounded-[10px] border border-zinc-200 pl-4"
              placeholder="Enter Password..."
              value={password}
              onChange={handleSetPassword}
              required
              InputProps={{
                endAdornment: (
                  <EndAdornmentPassword
                    visible={visible}
                    setVisible={setVisible}
                  />
                ),
              }}
            />
            <p className="text-[15px] text-[#9C9C9C] text-center mt-[20px]">
              {action == "edit"
                ? "This will allow you to edit the selected order."
                : statusVisible == "void"
                ? "This will void the selected order."
                : "This will allow you to charge transactions."}
            </p>

            <button
              onClick={handleConfirm}
              className="w-full h-[45px] blueButton mt-[20px] mb-[20px]"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {chargeOrderFormVisible && (
        <div className="overlay">
          {chargeOrderFormVisible && <ChargeOrderForm />}
        </div>
      )}
    </>
  );
}

export default AuthenticationForm;
