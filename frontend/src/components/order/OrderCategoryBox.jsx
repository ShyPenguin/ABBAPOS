import { forwardRef } from "react";

const OrderCategoryBox = forwardRef(
  ({ category, activeCategory, setActiveCategory, setQ }, ref) => {
    return (
      <div
        className={`w-[105px] h-[92px] ${
          category.name == activeCategory
            ? "blueButton"
            : "grayButton bg-[#E9E7F3]"
        }  flex justify-center items-center text-center mb-[30px]`}
        onClick={() => {
          activeCategory !== category.name
            ? setActiveCategory(category.name)
            : setActiveCategory("");

          setQ("");
        }}
        id={`order-form-category-box-${category.id}`}
        key={category.id}
        ref={ref ? ref : null}
      >
        {category.name}
      </div>
    );
  }
);

export default OrderCategoryBox;
