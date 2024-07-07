import React, { useState } from "react";
import { plus, trashcanWhite } from "../assets/icons";
import { useUserStore } from "../store/useUserStore";

function User() {
  const [isEditForm, setIsEditForm] = useState(false);
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const user = useUserStore((state) => state.user);
  return (
    <div className="w-full py-6">
      <h2>User</h2>
      {/* CARD */}
      <div className="w-full h-full card rounded-[10px] p-[32px] justify-between items-normal mt-[16px]">
        {/* TOP PART */}
        <div className="w-full flex flex-row justify-start gap-8">
          <div
            className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaGreen rounded-md px-[27px] shadow cursor-pointer"
            onClick={() => {
              setIsEditForm(true);
            }}
            id="user-edit-button"
          >
            <img src={plus} className="w-[15px] h-[15px] fill-white" />
            <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
              Edit
            </h3>
          </div>
          <div
            className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaRed rounded-md px-[27px] shadow cursor-pointer"
            onClick={() => {
              setIsDeleteForm(true);
            }}
            id="user-delete-button"
          >
            <img src={trashcanWhite} className="w-[15px] h-[15px]" />
            <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
              Delete
            </h3>
          </div>
        </div>

        {/* USER'S INFO */}
        <div className="w-full grid grid-cols-2 gap-5 mt-3">
          <div className="flex flex-col items-start">
            <h3>Email</h3>
            <p className="text-primary">{user.email}</p>
          </div>
          <div className="flex flex-col items-start">
            <h3>Mobile Number</h3>
            <p className="text-primary">{user.mobile_number}</p>
          </div>
          <div className="flex flex-col items-start">
            <h3>First Name</h3>
            <p className="text-primary">{user.first_name}</p>
          </div>
          <div className="flex flex-col items-start">
            <h3>Last Name</h3>
            <p className="text-primary">{user.last_name}</p>
          </div>
          <div className="flex flex-col items-start">
            <h3>Business Name</h3>
            <p className="text-primary">{user.business_name}</p>
          </div>
          <div className="flex flex-col items-start">
            <h3>Business Category</h3>
            <p className="text-primary">{user.business_category}</p>
          </div>
          <div className="flex flex-col items-start">
            <h3>Country</h3>
            <p className="text-primary">{user.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
