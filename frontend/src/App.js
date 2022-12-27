import * as React from 'react';
// Routing 
import { BrowserRouter ,Route ,Routes, Navigate} from "react-router-dom";

// Components 
import Main from './Components/Main';
import LoginForm from './Components/LoginForm';
import SignUpForm from './Components/SignUpForm';



function App() {
  return (
    <div className='App'>
      <Routes>
        <Route  path= "/Main/*" element={<Main />}/>
        <Route  path= "/SignUp" element={<SignUpForm />}/>
        <Route  path= "/" element={<LoginForm/>}/>      
        <Route path="*" element={<Navigate to = "/" />}></Route>
      </Routes>
    </div>
  );
}

export default App;
