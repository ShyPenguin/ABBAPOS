import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sally, sallyBlur } from "../assets/images";
import { useUserStore } from "../store/useUserStore";

function WelcomePage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const handleStartMyDayClick = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    navigate("/master");
  };

  return (
    <section className="abbapos-background h-full w-full flex justify-center items-center font-golos">
      <div className="card h-[539px] w-[744px]">
        <div className="relative">
          <img src={sally} alt="Sally" />
          <img
            src={sallyBlur}
            alt="Sally Blur"
            className="absolute bottom-[-17px] w-[230px] h-[94px]"
          />
        </div>
        <h1 className="text-primary font-bold text-[35px] mb-[36px]">
          {`Welcome back, ${user.first_name}!`}
        </h1>
        <button
          className="w-[397px] height-[45px] p-[11px] greenButton tracking-[0.4px] text-[20px]"
          onClick={handleStartMyDayClick}
          disabled={isLoading}
          id="welcome-continue-button"
        >
          {isLoading ? "Loading data..." : "Start my day!"}
        </button>
      </div>
    </section>
  );
}

export default WelcomePage;
