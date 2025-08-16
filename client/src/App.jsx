import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./components/HomePage.jsx";
import Listings from "./pages/ListingsPage.jsx";
import SignInPage from "./pages/LoginPage.jsx";
import DMChat from "./components/DMChat.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import Navbar from "./components/Navbar.jsx";


export default function App() {

  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/create-profile" element={<SignUpPage />} />
        <Route path="/chat" element={<DMChat />} />
      </Routes>
    </BrowserRouter>
  );
}
