import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx"
import Listings from "./pages/Listings.jsx"
import SignInPage from "./pages/LoginPage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  return <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/homepage' element={<HomePage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/browse' element={<BrowsePage />} />

      <Route path='/listings' element={<Listings />} />
      <Route path='/signin' element={<SignInPage />} />

    </Routes>

  </BrowserRouter>

}