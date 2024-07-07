import { crossMarkCircle } from "../../assets/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCustomerStore } from "../../store/useCustomerStore";
import { useAddCustomer } from "../../hooks/customer/useAddCustomer";
import { useEditCustomer } from "../../hooks/customer/useEditCustomer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomerForm({ action, setIsCustomerFormVisible, id }) {
  const schema = yup.object().shape({
    name: yup
      .string()
      .max(20, "Customer Name can only have a maximum of 20 characters")
      .required("Customer Name is required"),
    code: yup
      .string()
      .max(10, "Customer Code can only have a maximum of 10 characters")
      .required("Customer Code is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onSubmit",
  });

  const customer =
    action == "ADD"
      ? null
      : useCustomerStore((state) =>
          state.customers.find((customer) => customer.id === id)
        );

  const showToastError = (message) => {
    toast.error(message, {
      toastId: 1,
      autoClose: 1000,
      theme: "colored",
    });
  };

  const mutateCustomer =
    action == "ADD"
      ? useAddCustomer(setIsCustomerFormVisible)
      : useEditCustomer(setIsCustomerFormVisible);

  const onSubmit = (formData) => {
    const { name, code } = formData;

    if (action == "ADD") {
      mutateCustomer.mutate({
        id,
        name,
        code,
      });
    } else {
      mutateCustomer.mutate({ id, formData });
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="w-[607px] card bg-white z-10 justify-normal">
        {/* TOP PART */}
        <div className="h-[45px] w-full bg-primary rounded-[10px] flex flex-row justify-between items-center px-[31px]">
          <h3 className="font-golos font-semibold tracking-tight text-white">
            {action == "ADD" ? "Add Customer" : "Edit Customer"}
          </h3>
          <img
            src={crossMarkCircle}
            className="fill-white w-[19px] h-[19px] cursor-pointer"
            onClick={() => setIsCustomerFormVisible(false)}
          />
        </div>
        {/* FORM */}
        <form
          className="w-full h-full flex-1 flex flex-col"
          id={`${action == "ADD" ? "customer-add-form" : "customer-edit-form"}`}
        >
          <div className="w-full h-full flex flex-col gap-5 px-[30px] py-[18px] border-b-2 border-[#DFE0E4]">
            <div className="relative mb-[25px] mt-[10px]">
              <label className="form-label">
                <span className="text-primary">Customer Name</span>
                <span className="text-abbaRed">*</span>
              </label>
              <input
                className={`input-box-field ${errors.name && "border-abbaRed"}`}
                placeholder="Enter Customer Name..."
                defaultValue={customer && customer.name}
                {...register("name")}
                id={`${
                  action == "ADD"
                    ? "customer-add-name-field"
                    : "customer-edit-name-field"
                }`}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {errors.name?.message}
              </p>
            </div>
            <div className="relative mb-[25px]">
              <label className="form-label">
                <span className="text-primary">Customer Code</span>
                <span className="text-abbaRed">*</span>
              </label>
              <input
                className={`input-box-field ${errors.code && "border-abbaRed"}`}
                placeholder="Enter Customer Code..."
                defaultValue={customer && customer.code}
                {...register("code")}
                id={`${
                  action == "ADD"
                    ? "customer-add-code-field"
                    : "customer-edit-code-field"
                }`}
              />
              <p className="text-abbaRed p-0 m-0 absolute bottom-[-20px]">
                {errors.code?.message}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center py-[18px] pr-[30px]">
            <button
              className="grayButton w-[125px] h-[45px] mr-[21px]"
              onClick={() => setIsCustomerFormVisible(false)}
              id={`${
                action == "ADD"
                  ? "customer-add-close-button"
                  : "customer-edit-close-button"
              }`}
            >
              Close
            </button>
            <button
              className="blueButton w-[125px] h-[45px]"
              onClick={handleSubmit(onSubmit)}
              id={`${
                action == "ADD"
                  ? "customer-add-save-button"
                  : "customer-edit-save-button"
              }`}
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* FRONT END ERRORS */}
      {errors.name && showToastError(errors.name.message)}
      {errors.code && showToastError(errors.code.message)}
    </>
  );
}

export default CustomerForm;
