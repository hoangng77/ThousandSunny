import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar";
import Home from "./pages/homePage";
import Login from "./pages/login";
import Register from "./pages/register";
import PrivateRoute from "./route/privateRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


// profileSettings
// profilePage/:username