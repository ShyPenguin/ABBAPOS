import { useState, useEffect } from "react";
import { plus, trashcanWhite } from "../assets/icons";
import ItemForm from "../components/item/ItemForm";
import CustomersTable from "../components/customer/CustomersTable";
import ItemsTable from "../components/item/ItemsTable";
import Pagination from "../components/Pagination";
import { useItemStore } from "../store/useItemStore";
import DeleteForm from "../components/DeleteForm";
import { useCustomerStore } from "../store/useCustomerStore";
import { useGetCustomers } from "../hooks/customer/useGetCustomers";
import CustomerForm from "../components/customer/CustomerForm";
import { ToastContainer } from "react-toastify";
import { useGetItems } from "../hooks/item/useGetItems";
import { useGetCategory } from "../hooks/category/useGetCategory";
import CategoriesTable from "../components/category/CategoriesTable";
import CategoryForm from "../components/category/CategoryForm";
import { useCategoryStore } from "../store/useCategoryStore";

const ITEM = "ITEM";
const CUSTOMER = "CUSTOMER";
const CATEGORY = "CATEGORY";

function MasterList() {
  const [type, setType] = useState(ITEM);
  const [isAddForm, setIsAddForm] = useState(false);
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const itemTotalRecords = useItemStore((state) => Number(state.totalRecords));
  const customerTotalRecords = useCustomerStore((state) =>
    Number(state.totalRecords)
  );

  const categoryTotalRecords = useCategoryStore((state) =>
    Number(state.totalRecords)
  );

  const {
    isLoading: isItemLoading,
    isError: isItemError,
    error: itemError,
    data: itemData,
    isFetching: isItemFetching,
    isPreviousData: isItemPreviousData,
  } = useGetItems();

  const {
    isLoading: isCustomerLoading,
    isError: isCustomerError,
    error: customerError,
    data: customerData,
    isFetching: isCustomerFetching,
    isPreviousData: isCustomerPreviousData,
  } = useGetCustomers();

  const {
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
    data: categoryData,
    isFetching: isCategoryFetching,
    isPreviousData: isCategoryPreviousData,
  } = useGetCategory();

  useEffect(() => {
    setSelectedItems([]);
  }, [itemData]);

  useEffect(() => {
    setSelectedCustomers([]);
  }, [customerData]);

  useEffect(() => {
    setSelectedCategories([]);
  }, [categoryData]);

  return (
    <div className="w-full py-6">
      <h2>MASTER LIST</h2>
      {/* CARD */}
      <div className="w-full h-full card rounded-[10px] p-[32px] justify-between mt-[16px]">
        {/* TOP PART  */}
        <div className="w-full flex flex-row justify-between">
          {/* BUTTONS ON LEFT */}
          <div className="flex flex-row justify-between">
            <button
              className={`w-[166px] h-[45px] ${
                type == ITEM ? "blueButton" : "grayButton"
              } hover:blueButton`}
              onClick={() => setType(ITEM)}
              id="masterlist-item-button"
            >
              Item
            </button>
            <button
              className={`w-[166px] h-[45px] ml-[38px] ${
                type == CATEGORY ? "blueButton" : "grayButton"
              } hover:blueButton`}
              onClick={() => setType(CATEGORY)}
              id="masterlist-category-button"
            >
              Category
            </button>
            <button
              className={`w-[166px] h-[45px] ml-[38px] ${
                type == CUSTOMER ? "blueButton" : "grayButton"
              } hover:blueButton`}
              onClick={() => setType(CUSTOMER)}
              id="masterlist-customer-button"
            >
              Customer
            </button>
          </div>
          {/* BUTTONS ON RIGHT */}
          <div className="flex flex-row justify-between">
            {type == ITEM && selectedItems.length > 0 && (
              <div
                className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaRed rounded-md px-[27px] shadow cursor-pointer"
                onClick={() => {
                  setIsMultipleDelete(true);
                }}
                id="items-multiple-delete-button"
              >
                <img src={trashcanWhite} className="w-[15px] h-[15px]" />
                <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
                  Delete
                </h3>
              </div>
            )}

            {type == CUSTOMER && selectedCustomers.length > 0 && (
              <div
                className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaRed rounded-md px-[27px] shadow cursor-pointer"
                onClick={() => {
                  setIsMultipleDelete(true);
                }}
                id="customers-multiple-delete-button"
              >
                <img src={trashcanWhite} className="w-[15px] h-[15px]" />
                <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
                  Delete
                </h3>
              </div>
            )}

            {type == CATEGORY && selectedCategories.length > 0 && (
              <div
                className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaRed rounded-md px-[27px] shadow cursor-pointer"
                onClick={() => {
                  setIsMultipleDelete(true);
                }}
                id="categories-multiple-delete-button"
              >
                <img src={trashcanWhite} className="w-[15px] h-[15px]" />
                <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
                  Delete
                </h3>
              </div>
            )}
            <div
              className="w-[125px] h-[45px] flex flex-row justify-center items-center bg-abbaGreen rounded-md px-[27px] ml-[10px] shadow cursor-pointer"
              onClick={() => {
                setIsAddForm(true);
              }}
              id="masterlist-add-button"
            >
              <img src={plus} className="w-[15px] h-[15px] fill-white" />
              <h3 className="text-white font-bold w-[40px] h-[25px] ml-[16px] mt-[2px]">
                Add
              </h3>
            </div>
          </div>
        </div>
        {/* TOP PART  */}

        {/* TABLE */}
        <div className="w-full pt-[15px]">
          {type == ITEM ? (
            <ItemsTable
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              isFetching={isItemFetching}
              isError={isItemError}
            />
          ) : type == CUSTOMER ? (
            <CustomersTable
              selectedCustomers={selectedCustomers}
              setSelectedCustomers={setSelectedCustomers}
              isFetching={isCustomerFetching}
              isError={isCustomerError}
            />
          ) : (
            <CategoriesTable
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              isFetching={isCategoryFetching}
              isError={isCategoryError}
            />
          )}
        </div>
        {/* TABLE */}

        {/* BOTTOM PART */}
        <Pagination
          type={type == ITEM ? ITEM : type == CUSTOMER ? CUSTOMER : CATEGORY}
          isLoading={
            type == ITEM
              ? isItemLoading
              : type == CUSTOMER
              ? isCustomerLoading
              : isCategoryLoading
          }
          isError={
            type == ITEM
              ? isItemError
              : type == CUSTOMER
              ? isCustomerError
              : isCategoryError
          }
          isFetching={
            type == ITEM
              ? isItemFetching
              : type == CUSTOMER
              ? isCustomerFetching
              : isCategoryFetching
          }
          isPreviousData={
            type == ITEM
              ? isItemPreviousData
              : type == CUSTOMER
              ? isCustomerPreviousData
              : isCategoryPreviousData
          }
          error={
            type == ITEM
              ? itemError
              : type == CUSTOMER
              ? customerError
              : categoryError
          }
          data={
            type == ITEM
              ? itemData
              : type == CUSTOMER
              ? customerData
              : categoryData
          }
        />

        {/* FORM MODAL */}
        {(isAddForm || isMultipleDelete) && (
          <div className="overlay">
            {isMultipleDelete ? (
              <DeleteForm
                isMultipleDelete={isMultipleDelete}
                type={
                  type == ITEM ? ITEM : type == CUSTOMER ? CUSTOMER : CATEGORY
                }
                data={
                  type == ITEM
                    ? selectedItems
                    : type == CUSTOMER
                    ? selectedCustomers
                    : selectedCategories
                }
                setIsDeleteForm={setIsMultipleDelete}
              />
            ) : type == ITEM ? (
              <ItemForm
                action={"ADD"}
                setIsItemFormVisible={setIsAddForm}
                id={isAddForm ? itemTotalRecords + 1 : recordId}
              />
            ) : type == CUSTOMER ? (
              <CustomerForm
                action={"ADD"}
                setIsCustomerFormVisible={setIsAddForm}
                id={customerTotalRecords + 1}
              />
            ) : (
              <CategoryForm
                action={"ADD"}
                setIsCategoryFormVisible={setIsAddForm}
                id={categoryTotalRecords + 1}
              />
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default MasterList;
