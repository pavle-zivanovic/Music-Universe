import React, { useState }  from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import '../Styles/SignUpForm.css';

function SignUp(){


     
    // konstante  za cuvanje inputa 
    const [userName , setUserName] = useState('')
    const [userError , setUserError] = useState(false)
    const [passWord , setPassWord] = useState('')
    const [passError , setPassError] = useState(false)
    const [email , setEmail] = useState('')
    const [emailError , setEmailError] = useState(false)

    //const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
    const darkMode = true 
    document.body.style.backgroundColor = darkMode ? "rgb(15, 6, 25)" :"azure";

    async function signUP(){

        const user = {
            userName: userName,
            password: passWord,
            email: email,
           
       }
       try{
        let result = await fetch("User/SignUp/", {
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(user)
          });
          let a = await result.json();

          if (a === 1){
            navigate("/")
        
          }
          else if (a === 0){
             alert("Korisnik vec postoji !")
          }
       }
       catch (error){
          //console.log(error)
       }
}
    
    // error check => pravljenjeNaloga( podaci [] )
    const handleSignUp = () =>{

        setEmailError(false);;setUserError(false);;setPassError(false);


        if (userName === ''){
            setUserError(true)
        }
        if (passWord === ''){
            setPassError(true)
        }
        if (email === ''){
            setEmailError(true)           
        }
        if(passError || userError ){

            alert("Nisu popunjena sva potrebna polja")
        }
        // ako je sve ok pravi se nalog i prebacuje nas na main 
        if(!emailCheck()){
            alert("Nevalidan email")
        }
        if (userName && passWord  && emailCheck()){
            

            //navigate("/Main")
            signUP()

        }
    }


    let navigate = useNavigate();
    // promena strane
    const routeChange = () =>{ 
      let path = `/Main`; 
      navigate(path);
    }

    // validacija emaila 
    const emailCheck = () => {
        // fetch email 
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( re.test(email)){
            return true 
        }
        else {
            setEmailError(true);
            return false
        }
    }


    
    return (
        <div className={darkMode ? "divMainDM":"divMain"}>
            <Grid container>
            <Grid item  xs={0} sm={2} md={4}>
            </Grid>
            <Grid item xs={12} sm={8} md={4} >
            <div className={darkMode ? "divNaslovDm" : "divNaslov"}>
                 <img src="../Images/Logo.png"></img>
            </div> 
            <form className={darkMode ? "formaDM" : "forma"}>
                <div className={darkMode ? "GlavniDivDM" :"GlavniDiv"}>
                    <div className="divSignUpText"> 
                        <label className="naslov"> SIGN UP</label>
                    </div>
                    <div className="inputUserSignUp">                          
                                <TextField onChange={ (e) => setUserName(e.target.value) } error={userError}
                                id="outlined-basic3" label="Username" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="primary" required sx ={{ width: "85%"  }}/>                             
                    </div>
                    <div className="inputPassSignUp">                          
                                <TextField onChange={ (e) => setPassWord(e.target.value) } error={passError}
                                id="outlined-basic4" label="Password" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="password" color="primary" required sx ={{ width: "85%"  }}/>                             
                    </div>
                    <div className="inputEmailSignUp">
                                <TextField onChange={ (e) => setEmail(e.target.value) } error={emailError}
                                id="outlined-basic5" label="Email" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="email" color="primary" required sx ={{ width: "85%"  }}/>                            
                    </div>
                    <button onClick={(event) => { event.preventDefault() ; handleSignUp(); } } className="BtnSignUp">CREATE ACCOUNT</button>
                </div>
            </form>
            </Grid>
            <Grid item  xs={0} sm={2} md={4}>
            </Grid>
            </Grid>
        </div>
    )


}



export default SignUp ;