import { useState } from "react";
import { crossMarkCircle } from "../../assets/icons";
import ItemList from "./ItemList";
import PreviewCard from "./PreviewCard";
import SearchBar from "../SearchBar";
import OrderCategoryScroll from "./OrderCategoryScroll";
import { useOrderItems } from "../../store/useOrderItems";
import { useOrderVisbility } from "../../store/useOrderVisibility";

function OrderForm() {
  const [activeCategory, setActiveCategory] = useState("");
  const [q, setQ] = useState("");
  const removeOrderFormVisible = useOrderVisbility(
    (state) => state.removeOrderFormVisible
  );
  const empty = useOrderItems((state) => state.empty);
  const reference_number = useOrderItems((state) => state.reference_number);

  return (
    <>
      {/* CARD */}
      <div className="w-[1207px] h-[632px] card bg-white z-10 justify-normal">
        {/* TOP PART */}
        <div className="h-[45px] w-full bg-primary rounded-[10px] flex flex-row justify-between items-center px-[31px]">
          <h3 className="font-golos font-semibold tracking-tight text-white">
            {`Order ${reference_number && `- ${reference_number}`}`}
          </h3>
          <img
            src={crossMarkCircle}
            className="fill-white w-[19px] h-[19px] cursor-pointer"
            onClick={() => {
              removeOrderFormVisible(false);
              empty();
            }}
            id="order-form-close-button"
          />
        </div>
        {/* BOTTOM PART */}
        <div className="w-full h-full flex flex-row py-[28px] px-[38px] ">
          {/* LEFT */}
          <div className="flex-1 border-solid border-r-[1px] pr-[26px]">
            <PreviewCard />
          </div>
          {/* RIGHT */}
          <div className="ml-[26px] flex-1 flex flex-col">
            {/* TOP */}
            <SearchBar q={q} setQ={setQ} />
            <div className="flex-1 pt-[24px]">
              {/* BOTTOM */}
              <div className="w-full h-full flex justify-between">
                {/* CATEGORIES */}
                <OrderCategoryScroll
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  setQ={setQ}
                />
                <ItemList q={q} category={activeCategory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderForm;
