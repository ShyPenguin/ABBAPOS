import { deleteNotice } from "../assets/icons";
import { useDeleteCustomer } from "../hooks/customer/useDeleteCustomer";
import { useDeleteItem } from "../hooks/item/useDeleteItem";
import { useDeleteMultipleCustomers } from "../hooks/customer/UseDeleteMultipleCustomers";
import { useDeleteMultipleItems } from "../hooks/item/useDeleteMultipleItems";
import { useDeleteMultipleCategory } from "../hooks/category/useDeleteMultipleCategory";
import { useDeleteCategory } from "../hooks/category/useDeleteCategory";

function DeleteForm({ isMultipleDelete, type, data, setIsDeleteForm }) {
  let deleteData;

  switch (type) {
    case "ITEM":
      deleteData = isMultipleDelete
        ? useDeleteMultipleItems(setIsDeleteForm)
        : useDeleteItem(setIsDeleteForm);
      break;
    case "CUSTOMER":
      deleteData = isMultipleDelete
        ? useDeleteMultipleCustomers(setIsDeleteForm)
        : useDeleteCustomer(setIsDeleteForm);
      break;
    case "CATEGORY":
      deleteData = isMultipleDelete
        ? useDeleteMultipleCategory(setIsDeleteForm)
        : useDeleteCategory(setIsDeleteForm);
      break;
  }

  const onSubmit = (e) => {
    e.preventDefault();
    deleteData.mutate(data);
  };

  return (
    <>
      {/* CARD */}
      <div className="card bg-white z-10 flex flex-col justify-center gap-8 p-[32px]">
        <img src={deleteNotice} className="w-[104px] h-[104px]" />
        <h2 className="text-center">
          {`Are you sure you want to delete ${
            isMultipleDelete ? "these" : "the"
          } ${
            type === "ITEM"
              ? "item"
              : type === "CUSTOMER"
              ? "customer"
              : "category"
          }${isMultipleDelete ? "s" : ""}?`}
        </h2>
        {isMultipleDelete &&
          data.map((element) => (
            <p className="text-primary flex">
              {`Name: ${element.name} Code: ${element.code}`}
            </p>
          ))}
        <form
          className="w-full flex flex-row justify-between gap-6"
          id="delete-form"
        >
          <button
            className="grayButton w-[190px] h-[45px]"
            onClick={() => {
              setIsDeleteForm(false);
            }}
            id="delete-form-close-button"
          >
            No, please
          </button>
          <button
            className="blueButton w-[190px] h-[45px]"
            onClick={(e) => onSubmit(e)}
            id="delete-form-submit-button"
          >
            Yes, please.
          </button>
        </form>
      </div>
    </>
  );
}

export default DeleteForm;
