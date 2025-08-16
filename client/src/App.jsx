import SignUpTutor from "./pages/SignUpTutor";
import SignUpPage from "./pages/SignUpPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpFlow from "./pages/SignUpFlow";

export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/signupTutor' element= {<SignUpTutor />} />
    <Route path='/signupflow' element= {<SignUpFlow />} />
  </Routes>
  
  </BrowserRouter>

}