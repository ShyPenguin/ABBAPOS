import { minusGreen, plusGreen } from "../../assets/icons";
import { useOrderItems } from "../../store/useOrderItems";

function PreviewTable() {
  const orderItems = useOrderItems((store) => store.order_items);
  const handleDecrement = useOrderItems((store) => store.decreaseQuantity);
  const handleIncrement = useOrderItems((store) => store.increaseQuantity);

  return (
    <div id="preview-table">
      <table className="w-full h-full text-center pb-[15px]">
        <thead className="border-none">
          <tr className="border-none">
            <th className="w-[96px]">Quantity</th>
            <th className="">Item</th>
            <th className="">Amount</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.length > 0 ? (
            orderItems.map((orderItem) => (
              <tr key={orderItem.id} className="last:border-none">
                <td className="flex justify-between items-center">
                  <img
                    src={minusGreen}
                    className="w-[12px] h-[12px] cursor-pointer"
                    onClick={() => handleDecrement(orderItem)}
                    id="previewTable-add-quantity"
                  />
                  <p className="bg-white text-primary text-[11px] text-center w-[30px] h-[21px]">
                    {orderItem.quantity}
                  </p>
                  <img
                    src={plusGreen}
                    className="w-[12px] h-[12px] cursor-pointer"
                    onClick={() => handleIncrement(orderItem)}
                    id="previewTable-decrease-quantity"
                  />
                </td>
                <td>{orderItem.item.name}</td>
                <td>PHP {orderItem.item.price * orderItem.quantity}</td>
              </tr>
            ))
          ) : (
            <tr className="border-none">
              <td colSpan="6" className="text-center">
                <p className="text-abbaGray">
                  Please select a specific item from the item list.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PreviewTable;
