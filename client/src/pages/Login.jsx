import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../redux/thunks/authThunks.js";
import { clearAuthError } from "../redux/slices/authSlice.js";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const destination = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const action = isRegister
      ? registerUser({ name: form.name, email: form.email, password: form.password })
      : loginUser({ email: form.email, password: form.password });

    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold text-center mb-2">{isRegister ? "Join Market & Co." : "Welcome Back"}</h1>
      <p className="text-center text-sm text-ink/50 mb-8">{isRegister ? "Create an account to start purchasing." : "Sign in to access your orders."}</p>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 space-y-4 shadow-sm">
        {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-semibold text-center">{error}</div>}

        {isRegister && (
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none"
          />
        )}

        <input
          required
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none"
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-white py-3 rounded-full hover:bg-plum transition-colors font-semibold disabled:opacity-50"
        >
          {loading ? "Verifying..." : isRegister ? "Register" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/50 mt-6">
        {isRegister ? "Already registered?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            dispatch(clearAuthError());
            setIsRegister(!isRegister);
          }}
          className="text-clay underline font-bold"
        >
          {isRegister ? "Sign In" : "Register"}
        </button>
      </p>
    </div>
  );
};

export default Login;