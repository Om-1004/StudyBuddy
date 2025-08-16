import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/homepage' element={<HomePage /> } />
    <Route path='/signup' element= {<SignUpPage />} />
  </Routes>
  
  </BrowserRouter>

}