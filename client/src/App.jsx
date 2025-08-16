import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./components/HomePage.jsx"
import Listings from "./pages/Listings.jsx"
import SignInPage from "./pages/LoginPage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/homepage' element={<HomePage /> } />
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/listings' element={<Listings />} />
    <Route path='/signin' element={<SignInPage />} />
  </Routes>
  
  </BrowserRouter>

}