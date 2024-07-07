import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashBoard from "../pages/DashBoard";
import MasterList from "../pages/MasterList";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import User from "../pages/User";

function HomeRouters() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/master" />} />
      <Route path="/master" element={<MasterList />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/user" element={<User />} />
      <Route path="/dashboard/*" element={<DashBoard />} />
    </Routes>
  );
}

export default HomeRouters;
