import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./components/HomePage.jsx"
import Listings from "./pages/ListingsPage.jsx"
import SignInPage from "./pages/LoginPage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/' element={<HomePage /> } />
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/listings' element={<Listings />} />
    <Route path='/signin' element={<SignInPage />} />
    <Route path="/create-profile" element={<SignUpPage />} />
  </Routes>
  
  </BrowserRouter>

}