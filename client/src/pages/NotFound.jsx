import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-6xl font-semibold text-ink/20 mb-4">404</h1>
      <p className="text-ink/60 mb-6">That page doesn't exist.</p>
      <button onClick={() => navigate("/")} className="text-clay underline">
        Back to shop
      </button>
    </div>
  );
};

export default NotFound;