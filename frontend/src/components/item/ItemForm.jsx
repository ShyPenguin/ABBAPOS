import { crossMarkCircle } from "../../assets/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddItem } from "../../hooks/item/useAddItem";
import { useEditItem } from "../../hooks/item/useEditItem";
import { useItemStore } from "../../store/useItemStore";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useGetCategoryInfinite } from "../../hooks/category/useGetCategoryInfinite";
import CustomDropdown from "../CustomDropDown";

function ItemForm({ action, setIsItemFormVisible, id }) {
  const schema = yup.object().shape({
    name: yup
      .string()
      .max(50, "Item Name can only have a maximum of 50 characters")
      .required("Item Name is required"),
    code: yup
      .string()
      .max(50, "Item Code can only have a maximum of 50 characters")
      .required("Item Code is required"),
    unit_of_measure: yup
      .string()
      .max(30, "Unit of Measure can only have a maximum of 30 characters")
      .required("Unit of Measure is required"),
    price: yup
      .number("Price must be number")
      .positive("Price must be positive")
      .required("Price is required")
      .test("maxDigits", "Price cannot have more than 9 integers", (value) => {
        const priceStr = String(value);
        const decimalSeparatorIndex = priceStr.indexOf(".");
        if (decimalSeparatorIndex !== -1) {
          // If there is a decimal part, check the number of digits before and after the decimal separator.
          const integerPart = priceStr.slice(0, decimalSeparatorIndex);
          const decimalPart = priceStr.slice(decimalSeparatorIndex + 1);
          if (decimalPart.length <= 2) {
            return integerPart.length <= 9;
          } else {
            throw new yup.ValidationError(
              "Price cannot have more than 2 decimal places",
              value,
              "price"
            );
          }
        } else {
          // If there is no decimal part, just check the number of digits in the integer part.
          return priceStr.length <= 9;
        }
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onSubmit",
  });

  const item =
    action == "ADD"
      ? null
      : useItemStore((state) => state.items.find((item) => item.id === id));

  const mutateItem =
    action == "ADD"
      ? useAddItem(setIsItemFormVisible)
      : useEditItem(setIsItemFormVisible);

  const [selectedCategory, setSelectedCategory] = useState(
    item ? item.category : null
  );
  const [q, setQ] = useState(item ? item.category.name : "");
  const [categoryError, setCategoryError] = useState("");
  const {
    fetchNextPage, //function
    hasNextPage, // boolean
    isFetchingNextPage, // boolean
    data,
    status,
    error,
  } = useGetCategoryInfinite(q);
  const onSubmit = (formData) => {
    const { name, code, unit_of_measure, price } = formData;

    if (!selectedCategory) {
      setCategoryError("Item Category is required");
      return;
    } else {
      setCategoryError("");
    }

    const data = {
      name,
      code,
      unit_of_measure,
      price,
      category: selectedCategory.id,
    };

    if (action == "ADD") {
      mutateItem.mutate(data);
    } else {
      mutateItem.mutate({ id, data });
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="w-[607px] card bg-white z-10 justify-normal">
        {/* TOP PART */}
        <div className="h-[45px] w-full bg-primary rounded-[10px] flex flex-row justify-between items-center px-[31px]">
          <h3 className="font-golos font-semibold tracking-tight text-white">
            {action == "ADD" ? "Add Item" : "Edit Item"}
          </h3>
          <img
            src={crossMarkCircle}
            className="fill-white w-[19px] h-[19px] cursor-pointer"
            onClick={() => setIsItemFormVisible(false)}
            id="item-form-top-close-button"
          />
        </div>
        {/* FORM */}
        <form
          className="w-full h-full flex-1 flex flex-col"
          id={`${action == "ADD" ? "item-add-form" : "item-edit-form"}`}
        >
          <div className="w-full h-full flex flex-col gap-5 px-[30px] py-[18px] border-b-2 border-[#DFE0E4]">
            <div className="relative mt-[10px]">
              <label className="form-label">
                <span className="text-primary">Item Name</span>
                <span className="text-abbaRed">*</span>
              </label>
              <input
                className={`input-box-field ${errors.name && "border-abbaRed"}`}
                placeholder="Enter Item Name..."
                defaultValue={item && item.name}
                {...register("name")}
                id={`${
                  action == "ADD"
                    ? "item-add-name-field"
                    : "item-edit-name-field"
                }`}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {errors.name?.message}
              </p>
            </div>
            <div className="relative">
              <label className="form-label">
                <span className="text-primary">Item Code</span>
                <span className="text-abbaRed">*</span>
              </label>
              <input
                className={`input-box-field ${errors.code && "border-abbaRed"}`}
                placeholder="Enter Item Code..."
                defaultValue={item && item.code}
                {...register("code")}
                id={`${
                  action == "ADD"
                    ? "item-add-code-field"
                    : "item-edit-code-field"
                }`}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {errors.code?.message}
              </p>
            </div>
            <div className="relative">
              <label className="form-label">
                <span className="text-primary">Unit of Measure</span>
                <span className="text-abbaRed">*</span>
              </label>
              <input
                className={`input-box-field ${
                  errors.unit_of_measure && "border-abbaRed"
                }`}
                placeholder="Enter Unit Measure..."
                defaultValue={item && item.unit_of_measure}
                {...register("unit_of_measure")}
                id={`${
                  action == "ADD"
                    ? "item-add-unitOfMeasure-field"
                    : "item-edit-unitOfMeasure-field"
                }`}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {errors.unit_of_measure?.message}
              </p>
            </div>
            <div className="relative">
              <label className="form-label">
                <span className="text-primary">Price</span>
                <span className="text-abbaRed">*</span>
              </label>
              <input
                type="number"
                className={`input-box-field ${
                  errors.price && "border-abbaRed"
                }`}
                defaultValue={item ? item.price : 0.0}
                {...register("price")}
                id={`${
                  action == "ADD"
                    ? "item-add-price-field"
                    : "item-edit-price-field"
                }`}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {errors.price?.message}
              </p>
            </div>
            <div className="relative mb-[10px]">
              <label className="form-label">
                <span className="text-primary">Category</span>
                <span className="text-abbaRed">*</span>
              </label>
              <CustomDropdown
                data={data}
                selectedRecord={selectedCategory}
                setSelectedRecord={setSelectedCategory}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                status={status}
                error={error}
                query={q}
                setQuery={setQ}
                frontendError={categoryError}
                setFrontendError={setCategoryError}
                type={"category"}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {categoryError}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center py-[18px] pr-[30px]">
            <button
              className="grayButton w-[125px] h-[45px] mr-[21px]"
              onClick={() => setIsItemFormVisible(false)}
              id={`${
                action == "ADD"
                  ? "item-add-close-button"
                  : "item-edit-close-button"
              }`}
            >
              Close
            </button>
            <button
              className="blueButton w-[125px] h-[45px]"
              onClick={handleSubmit(onSubmit)}
              id={`${
                action == "ADD"
                  ? "item-add-save-button"
                  : "item-edit-save-button"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ItemForm;
