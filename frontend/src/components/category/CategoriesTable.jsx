import { useState } from "react";
import { pencil, trashcan } from "../../assets/icons";
import { useCategoryStore } from "../../store/useCategoryStore";
import CategoryForm from "./CategoryForm";
import DeleteForm from "../DeleteForm";
import Loading from "../Loading";

function CategoriesTable({
  selectedCategories,
  setSelectedCategories,
  isFetching,
  isError,
}) {
  const categories = useCategoryStore((state) => state.categories);
  const [isEditForm, setIsEditForm] = useState(false);
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [recordId, setRecordId] = useState(-1);

  const isAllSelected =
    categories.length > 0 && selectedCategories.length === categories.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories);
    }
  };

  const handleCheckboxChange = (checkedCategory) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(checkedCategory)) {
        return prevSelectedCategories.filter(
          (category) => checkedCategory.id !== category.id
        );
      } else {
        return [...prevSelectedCategories, checkedCategory];
      }
    });
  };

  const body =
    categories.length > 0 ? (
      categories.map((category) => (
        <tr key={category.id}>
          <td className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
              id={`category-checkbox-${category.id}`}
            />
          </td>
          <td id={`category-name-${category.id}`}>{category.name}</td>
          <td id={`category-code-${category.id}`}>{category.code}</td>
          <td>
            <div className="flex justify-center gap-10">
              <button
                onClick={() => {
                  setRecordId(category.id);
                  setIsEditForm(true);
                }}
                id={`category-edit-button-${category.id}`}
              >
                <img src={pencil} className="w-4 h-4 fill-primary" alt="Edit" />
              </button>
              <button
                onClick={() => {
                  setRecordId(category.id);
                  setIsDeleteForm(true);
                }}
                id={`category-delete-button-${category.id}`}
              >
                <img
                  src={trashcan}
                  className="w-4 h-4 fill-primary"
                  alt="Delete"
                />
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr className="border-none h-[200px]">
        <td colSpan="4" className="text-center">
          <p className="text-abbaGray flex items-center justify-center h-full">
            There's no category yet. Please click the “Add” button to create a
            category.
          </p>
        </td>
      </tr>
    );
  return (
    <div id="categories-table">
      <table className="w-full h-full text-center">
        <thead>
          <tr>
            <th className="flex justify-center items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                id="categories-select-all-checkbox"
              />
            </th>
            <th>Name</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isError ? (
            <tr>
              <td colSpan="4">
                <h2 className="text-abbaRed">
                  Server is unreachable. Unable to fetch data
                </h2>
              </td>
            </tr>
          ) : !isFetching ? (
            body
          ) : (
            <tr>
              <td colSpan="4">
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
              type={"CATEGORY"}
              data={recordId}
              setIsDeleteForm={setIsDeleteForm}
            />
          ) : (
            <CategoryForm
              action={"EDIT"}
              setIsCategoryFormVisible={setIsEditForm}
              id={recordId}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CategoriesTable;
