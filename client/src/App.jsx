import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./components/HomePage.jsx"
import Listings from "./pages/Listings.jsx"
import SignInPage from "./pages/LoginPage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";


export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/homepage' element={<HomePage /> } />
    <Route path='/signup' element= {<SignUpPage />} />
<<<<<<<<< Temporary merge branch 1
    <Route path='/listings' element={<Listings />} />
    <Route path='/signin' element={<SignInPage />} />
=========
    <Route path='/login' element= {<LoginPage />} />
    <Route path='/browse' element= {<BrowsePage />} />
>>>>>>>>> Temporary merge branch 2
  </Routes>
  
  </BrowserRouter>

}