import Header from "./Header";
import Navbar from "./navbar";
import HomeRouters from "../routers/HomeRouters";
import { useState } from "react";

function Home() {
  const [isNavVisible, setIsNavVisible] = useState(true);

  return (
    <section className="h-screen w-screen text-white bg-[#F8F9FD] relative">
      {isNavVisible && <Navbar />}
      {/* MAKE THIS FIXED NALANG */}
      <div
        className={`absolute bottom-0 top-0 ${
          isNavVisible ? "left-[184px]" : "left-0"
        } right-0 flex flex-col`}
      >
        <Header isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} />
        <div className="flex-1 px-[38px] font-golos flex flex-col justify-normal items-center bg-[#F8F9FD]">
          <HomeRouters />
        </div>
      </div>
    </section>
  );
}

export default Home;
