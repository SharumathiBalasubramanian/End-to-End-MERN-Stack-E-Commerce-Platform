import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // Fallback to localStorage if Redux hasn't rehydrated yet
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const activeUser = user || storedUser;

  if (!activeUser || !activeUser.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;