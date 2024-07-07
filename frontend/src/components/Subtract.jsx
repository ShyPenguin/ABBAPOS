import React from "react";
import { subtract } from "../assets/icons";

function Subtract({ style }) {
  return (
    <div
      className="absolute flex flex-col w-full h-[145px] items-center justify-center z-[-1] transition-all duration-[0.3s] ease-[ease-in-out]"
      style={{ ...style, transform: `translate(-45%, -50%)` }}
    >
      <img src={subtract} />
    </div>
  );
}

export default Subtract;
