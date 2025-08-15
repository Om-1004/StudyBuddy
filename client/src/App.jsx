import SignUpTutor from "./pages/SignUpTutor";
import SignUpPage from "./pages/SignUpPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/signupTutor' element= {<SignUpTutor />} />
  </Routes>
  
  </BrowserRouter>
}