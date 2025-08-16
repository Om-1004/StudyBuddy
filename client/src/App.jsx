import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./components/HomePage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BrowsePage from "./pages/BrowsePage.jsx";


export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/homepage' element={<HomePage /> } />
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/login' element= {<LoginPage />} />
    <Route path='/browse' element= {<BrowsePage />} />
  </Routes>
  
  </BrowserRouter>

}