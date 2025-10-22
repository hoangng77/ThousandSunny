import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar";
import Home from "./pages/homePage";
import Login from "./pages/login";
import Register from "./pages/register";
import ProfileSettings from "./pages/profileSettings"
import PrivateRoute from "./route/privateRoute";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profileSettings" element={<ProfileSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
