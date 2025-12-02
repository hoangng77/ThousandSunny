import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homePage";
import Navbar from "./components/navBar";
import Profile from "./pages/profile";
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
import MediaEdit from "./pages/mediaEdit";
import PortfolioEdit from "./pages/portfolioEdit";
import ArtPage from "./pages/art"

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16 px-6 h-screen w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          { /* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          { /* General Routes */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/art/:id" element={<ArtPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
           { /* Consumer Routes */}
          <Route path="/library" element={<Library />} />
          <Route path="/following" element={<Following />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/edit-profile/:username" element={<ProfileEdit />} />
          { /* Artist Routes */}
          <Route path="/portfolio/:username" element={<Portfolio />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/edit-media/:id" element={<MediaEdit />} />
          <Route path="/edit-portfolio/:username" element={<PortfolioEdit />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
