import React, { useState, useEffect } from "react";
import { group111 } from "../assets/icons";

function Header({ isNavVisible, setIsNavVisible }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Extract the hour and minutes from currentDate
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Format the time as "HH:mm"
  const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
  const formattedDate = currentDate.toLocaleDateString();

  return (
    <div className="h-[73px] flex flex-row bg-white shadow justify-between px-[38px] text-golos">
      <div className="flex flex-row items-center">
        <img
          src={group111}
          className="w-[31px] h-[23px] cursor-pointer"
          alt="Icon"
          onClick={() => setIsNavVisible(!isNavVisible)}
          id="navbar-hamburger-button"
        />
        <h3 className="w-[133px] h-[23px] text-primary font-semibold ml-[12px]">
          THE ABBA POS
        </h3>
      </div>
      <div className="flex flex-col items-end justify-center text-primary text-right font-normal">
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
    </div>
  );
}

export default Header;
