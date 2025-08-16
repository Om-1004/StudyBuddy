import SignUpTutor from "./pages/SignUpTutor";
import SignUpPage from "./pages/SignUpPage"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpFlow from "./pages/SignUpFlow";
import Message from "./components/Message";
import DMChat from "./components/DMChat";

export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/signup' element= {<SignUpPage />} />
    <Route path='/signupTutor' element= {<SignUpTutor />} />
    <Route path='/signupflow' element= {<SignUpFlow />} />
    <Route path='/' element= {<DMChat />} />


  </Routes>
  
  </BrowserRouter>

}