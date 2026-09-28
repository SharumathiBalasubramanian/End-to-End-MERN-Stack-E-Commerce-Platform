import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser, registerUser } from "../redux/thunks/authThunks.js";
import { clearCart } from "../redux/slices/cartSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from checkout, default directly to the Register tab
  const [isRegister, setIsRegister] = useState(
    location.state?.defaultTab === "register"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const action = isRegister
      ? registerUser(formData)
      : loginUser({ email: formData.email, password: formData.password });

    const result = await dispatch(action);

    if (result.meta?.requestStatus === "fulfilled") {
      const loggedUser = result.payload;
      const pendingOrder = sessionStorage.getItem("pendingOrder");

      // Check if there was an order waiting from the Checkout step
      if (pendingOrder) {
        try {
          const parsedOrder = JSON.parse(pendingOrder);
          const token = loggedUser?.token;

          await axios.post("http://localhost:5000/api/orders", parsedOrder, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          sessionStorage.removeItem("pendingOrder");
          dispatch(clearCart());
          navigate("/orders", { replace: true });
          return;
        } catch (err) {
          console.error("Failed to place pending order:", err);
        }
      }

      // Default destination if no pending order
      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
          {isRegister ? "Create an Account" : "Sign In"}
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          {isRegister
            ? "Sign up to complete your craft order."
            : "Welcome back! Enter your details to continue."}
        </p>

        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-black text-white py-3 rounded-full font-medium text-sm transition-colors cursor-pointer mt-2 disabled:bg-neutral-400"
          >
            {loading
              ? "Processing..."
              : isRegister
              ? "Register & Place Order"
              : "Sign In & Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-black font-semibold underline cursor-pointer"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;