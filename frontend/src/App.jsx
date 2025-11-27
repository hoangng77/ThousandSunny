import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import Navbar from "./components/navBar";
import ProfilePage from "./pages/profilePage";
import Portfolio from "./pages/portfolio";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import Library from "./pages/library";
import Login from "./pages/login";
import Register from "./pages/register";
import Progress from "./pages/progress";
import Following from "./pages/following";
import Discover from "./pages/discover";
import ProfileEdit from "./pages/profileEdit";
import ForYou from "./pages/forYou";
import EditMedia from "./pages/mediaEdit";
import EditPortfolio from "./pages/portfolioEdit";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 px-6 h-screen w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/foryou" element={<ForYou />} />

          {/* Consumer-only pages */}
          <Route path="/library" element={<Library />} />
          <Route path="/following" element={<Following />} />
          <Route path="/edit-profile/:username" element={<ProfileEdit />} />

          {/* Artist-only pages */}
          <Route path="/portfolio/:username" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/edit-media/:id" element={<EditMedia />} />
          <Route path="/edit-portfolio/:username" element={<EditPortfolio />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
