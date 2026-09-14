import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import JobsPage from "./pages/JobsPage/JobsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:park" element={<JobsPage />} />
    </Routes>
  );
}

export default AppRoutes;
