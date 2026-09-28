import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { placeOrder } from "../redux/thunks/orderThunks";
import { clearCart } from "../redux/slices/cartSlice";

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setOrderError("");

    const orderPayload = {
      items: items.map((i) => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress,
      paymentMethod,
      totalAmount: subtotal,
    };

    const result = await dispatch(placeOrder(orderPayload));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(clearCart());
      navigate("/orders");
    } else {
      setOrderError(result.payload || "Failed to place order.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-3">No items to checkout</h2>
        <button onClick={() => navigate("/")} className="text-clay underline">
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-8">Checkout</h1>

      {orderError && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
          {orderError}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                name="street"
                placeholder="Street address"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                className="w-full border border-ink/15 rounded-xl px-4 py-3 md:col-span-2 focus:ring-1 focus:ring-ink outline-none"
              />
              <input
                required
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:ring-1 focus:ring-ink outline-none"
              />
              <input
                required
                name="state"
                placeholder="State"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:ring-1 focus:ring-ink outline-none"
              />
              <input
                required
                name="zip"
                placeholder="ZIP Code"
                value={shippingAddress.zip}
                onChange={handleAddressChange}
                className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:ring-1 focus:ring-ink outline-none"
              />
              <input
                required
                name="country"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                className="w-full border border-ink/15 rounded-xl px-4 py-3 focus:ring-1 focus:ring-ink outline-none"
              />
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-semibold">Payment Option</h2>
            <div className="space-y-2">
              {["Cash on Delivery", "UPI / Card Online"].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 border border-ink/10 rounded-xl cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-sm font-medium">{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="divide-y divide-ink/10 mb-4 max-h-48 overflow-y-auto">
            {items.map((i) => (
              <div key={i.productId} className="py-2 text-sm flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-ink/10 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Delivery</span>
              <span className="text-moss font-medium">Free</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-ink/10">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-ink text-paper rounded-full py-3 hover:bg-plum transition-colors font-medium disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Confirm & Pay"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;