
import SignUpPage from "./pages/SignUpPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/signup' element= {<SignUpPage />} />
  </Routes>
  
  </BrowserRouter>

}