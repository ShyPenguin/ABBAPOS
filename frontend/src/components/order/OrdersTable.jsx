import { pencil, XCircleBlue } from "../../assets/icons";
import { useOrderHoldStore } from "../../store/useOrderHoldStore";
import { useOrderItems } from "../../store/useOrderItems";
import { useOrderStore } from "../../store/useOrderStore";
import { useOrderVisbility } from "../../store/useOrderVisibility";
import AuthenticationForm from "../AuthenticationForm";
import Loading from "../Loading";

function OrdersTable({
  selectedOrders,
  setSelectedOrders,
  isFetching,
  isError,
}) {
  const onOrder = useOrderVisbility((state) => state.onOrderPage);
  const orders = onOrder
    ? useOrderStore((state) => state.orders)
    : useOrderHoldStore((state) => state.orders);
  const setOrderStore = useOrderItems((state) => state.setOrderStore);
  const authenticationFormVisible = useOrderVisbility(
    (state) => state.authenticationFormVisible
  );
  const action = useOrderVisbility((state) => state.action);
  const statusVisible = useOrderVisbility((state) => state.statusVisible);
  const setAction = useOrderVisbility((state) => state.setAction);
  const setStatusVisible = useOrderVisbility((state) => state.setStatusVisible);
  const setAuthenticationFormVisible = useOrderVisbility(
    (state) => state.setAuthenticationFormVisible
  );

  const isAllSelected =
    orders.length > 0 && selectedOrders.length === orders.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((item) => item));
    }
  };

  const handleCheckboxChange = (checkedOrder) => {
    setSelectedOrders((prevSelectedOrders) => {
      if (prevSelectedOrders.includes(checkedOrder)) {
        return prevSelectedOrders.filter(
          (order) => checkedOrder.id !== order.id
        );
      } else {
        return [...prevSelectedOrders, checkedOrder];
      }
    });
  };

  const body =
    orders.length > 0 ? (
      orders.map((order) => (
        <tr
          key={order.id}
          className={`${
            order.status === "void" && "line-through decoration-abbaRed"
          }`}
        >
          <td className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={selectedOrders.includes(order)}
              onChange={() => handleCheckboxChange(order)}
              id={`order-checkbox-${order.id}`}
            />
          </td>
          <td
            id={`order-date-${order.id}`}
            className={`${order.status === "void" && "text-abbaRed"}`}
          >
            {new Date(order.date).toLocaleDateString()}
          </td>
          <td
            id={`order-refNo-${order.id}`}
            className={`${order.status === "void" && "text-abbaRed"}`}
          >
            {order.reference_number}
          </td>
          <td
            id={`order-customer-${order.id}`}
            className={`${order.status === "void" && "text-abbaRed"}`}
          >
            {order.customer?.name}
          </td>
          <td
            id={`order-amount-${order.id}`}
            className={`${
              order.status == "paid" ? "text-abbaGreen" : "text-abbaRed"
            }`}
          >
            PHP {order.amount}
          </td>
          <td>
            <div className="flex justify-center gap-10">
              <button
                onClick={() => {
                  setOrderStore(order);
                  setAction("edit");
                  setAuthenticationFormVisible(true);
                }}
                id={`order-edit-button-${order.id}`}
              >
                <img src={pencil} className="w-4 h-4 fill-primary" alt="Edit" />
              </button>
              <button
                onClick={() => {
                  setOrderStore(order);
                  setStatusVisible("void");
                  setAuthenticationFormVisible(true);
                }}
                id={`order-delete-button-${order.id}`}
              >
                <img
                  src={XCircleBlue}
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
        <td colSpan="6" className="text-center">
          <p className="text-abbaGray flex items-center justify-center h-full">
            {`There's no order yet. ${
              onOrder
                ? "Please click the “Add” button to create an order."
                : "Please click the Order tab and click the “Add” button to create an order."
            } `}
          </p>
        </td>
      </tr>
    );
  return (
    <div id="orders-table">
      <table className="w-full h-full text-center">
        <thead>
          <tr>
            <th className="flex justify-center items-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                id="orders-select-all-checkbox"
              />
            </th>
            <th>Date</th>
            <th>Ref No.</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isError ? (
            <tr>
              <td colSpan="6">
                <h2 className="text-abbaRed">
                  Server is unreachable. Unable to fetch data
                </h2>
              </td>
            </tr>
          ) : !isFetching ? (
            body
          ) : (
            <tr>
              <td colSpan="6">
                <div className="flex justify-center w-full h-full">
                  <Loading />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {authenticationFormVisible && (
        <div className="overlay">
          {statusVisible == "void" && <AuthenticationForm />}
          {action == "edit" && <AuthenticationForm />}
        </div>
      )}
    </div>
  );
}

export default OrdersTable;
