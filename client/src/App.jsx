import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./components/HomePage.jsx"
import Listings from "./pages/Listings.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpFlow from "./pages/SignUpFlow";

export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/homepage' element={<HomePage /> } />
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/signupTutor' element= {<SignUpTutor />} />
    <Route path='/signupflow' element= {<SignUpFlow />} />
  </Routes>
  
  </BrowserRouter>

}