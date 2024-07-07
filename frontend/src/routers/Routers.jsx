import React from "react";
import Login from "../pages/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../layouts/Home";
import WelcomePage from "../pages/WelcomePage";
import { useUserStore } from "../store/useUserStore";
import { Signup } from "../pages/Signup";
import { Business } from "../pages/Business";

function Routers() {
  const isAuth = useUserStore((state) => state.user.token);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/business" element={<Business />} />
        <Route
          path="/welcome"
          element={isAuth ? <WelcomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/*"
          element={isAuth ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Routers;
