import { useState } from "react";
import { pencil, trashcan } from "../../assets/icons";
import { useCustomerStore } from "../../store/useCustomerStore";
import CustomerForm from "./CustomerForm";
import DeleteForm from "../DeleteForm";
import Loading from "../Loading";

function CustomersTable({
  selectedCustomers,
  setSelectedCustomers,
  isFetching,
  isError,
}) {
  const customers = useCustomerStore((state) => state.customers);
  const [isEditForm, setIsEditForm] = useState(false);
  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [recordId, setRecordId] = useState(-1);

  const isAllSelected =
    customers.length > 0 && selectedCustomers.length === customers.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers);
    }
  };

  const handleCheckboxChange = (checkedCustomer) => {
    setSelectedCustomers((prevSelectedCustomers) => {
      if (prevSelectedCustomers.includes(checkedCustomer)) {
        return prevSelectedCustomers.filter(
          (customer) => checkedCustomer.id !== customer.id
        );
      } else {
        return [...prevSelectedCustomers, checkedCustomer];
      }
    });
  };

  const body =
    customers.length > 0 ? (
      customers.map((customer) => (
        <tr key={customer.id}>
          <td className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={selectedCustomers.includes(customer)}
              onChange={() => handleCheckboxChange(customer)}
              id={`customer-checkbox-${customer.id}`}
            />
          </td>
          <td id={`customer-name-${customer.id}`}>{customer.name}</td>
          <td id={`customer-code-${customer.id}`}>{customer.code}</td>
          <td>
            <div className="flex justify-center gap-10">
              <button
                onClick={() => {
                  setRecordId(customer.id);
                  setIsEditForm(true);
                }}
                id={`customer-edit-button-${customer.id}`}
              >
                <img src={pencil} className="w-4 h-4 fill-primary" alt="Edit" />
              </button>
              <button
                onClick={() => {
                  setRecordId(customer.id);
                  setIsDeleteForm(true);
                }}
                id={`customer-delete-button-${customer.id}`}
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
            There's no customer yet. Please click the “Add” button to create a
            customer.
          </p>
        </td>
      </tr>
    );
  return (
    <div id="customers-table">
      <table className="w-full h-full text-center">
        <thead>
          <tr>
            <th className="flex justify-center items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                id="customers-select-all-checkbox"
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
              type={"CUSTOMER"}
              data={recordId}
              setIsDeleteForm={setIsDeleteForm}
            />
          ) : (
            <CustomerForm
              action={"EDIT"}
              setIsCustomerFormVisible={setIsEditForm}
              id={recordId}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CustomersTable;
