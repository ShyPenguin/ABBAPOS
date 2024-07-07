import { useState } from "react";
import { pencil, trashcan } from "../../assets/icons";
import { useItemStore } from "../../store/useItemStore";
import DeleteForm from "../DeleteForm";
import Loading from "../Loading";
import ItemForm from "./ItemForm";

function ItemsTable({ selectedItems, setSelectedItems, isFetching, isError }) {
  const items = useItemStore((state) => state.items);
  const [isEditForm, setIsEditForm] = useState(false);
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [recordId, setRecordId] = useState(-1);

  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item));
    }
  };

  const handleCheckboxChange = (checkedItem) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(checkedItem)) {
        return prevSelectedItems.filter((item) => checkedItem.id !== item.id);
      } else {
        return [...prevSelectedItems, checkedItem];
      }
    });
  };

  const body =
    items.length > 0 ? (
      items.map((item) => (
        <tr key={item.id}>
          <td className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => handleCheckboxChange(item)}
              id={`item-checkbox-${item.id}`}
            />
          </td>
          <td id={`item-name-${item.id}`}>{item.name}</td>
          <td id={`item-code-${item.id}`}>{item.code}</td>
          <td id={`item-unit-of-measure-${item.id}`}>{item.unit_of_measure}</td>
          <td id={`item-price-${item.id}`}>PHP {item.price}</td>
          <td id={`item-category-${item.id}`}>{item.category.name}</td>
          <td>
            <div className="flex justify-center gap-10">
              <button
                onClick={() => {
                  setRecordId(item.id);
                  setIsEditForm(true);
                }}
                id={`item-edit-button-${item.id}`}
              >
                <img src={pencil} className="w-4 h-4 fill-primary" alt="Edit" />
              </button>
              <button
                onClick={() => {
                  setRecordId(item.id);
                  setIsDeleteForm(true);
                }}
                id={`item-delete-button-${item.id}`}
              >
                <img
                  src={trashcan}
                  className="w-4 h-4 fill-abbaRed"
                  alt="Delete"
                />
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr className="border-none h-[200px]">
        <td colSpan="7" className="text-center">
          <p className="text-abbaGray flex items-center justify-center h-full">
            There's no item yet. Please click the “Add” button to create an
            item.
          </p>
        </td>
      </tr>
    );

  return (
    <div id="items-table">
      <table className="w-full h-full text-center">
        <thead>
          <tr>
            <th className="flex justify-center items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                id="items-select-all-checkbox"
              />
            </th>
            <th>Name</th>
            <th>Code</th>
            <th>Unit of Measure</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isError ? (
            <tr>
              <td colSpan="7">
                <h2 className="text-abbaRed">
                  Server is unreachable. Unable to fetch data
                </h2>
              </td>
            </tr>
          ) : !isFetching ? (
            body
          ) : (
            <tr>
              <td colSpan="7">
                <div className="flex justify-center w-full h-full">
                  <Loading />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* FORM MODAL */}
      {(isDeleteForm || isEditForm) && (
        <div className="overlay">
          {isDeleteForm ? (
            <DeleteForm
              isMultipleDelete={false}
              type={"ITEM"}
              data={recordId}
              setIsDeleteForm={setIsDeleteForm}
            />
          ) : (
            <ItemForm
              type={"EDIT"}
              setIsItemFormVisible={setIsEditForm}
              id={recordId}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ItemsTable;
