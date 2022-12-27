import React, { Component, useState }  from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { useNavigate } from "react-router-dom";
import { ClassNames } from "@emotion/react";
import { Password } from "@mui/icons-material";
import Grid from '@mui/material/Grid';
import { Store } from 'react-notifications-component';
import '../Styles/SignUpForm.css';

function SignUp(){


     
    // konstante  za cuvanje inputa 
    const [userName , setUserName] = useState('')
    const [userError , setUserError] = useState(false)
    const [passWord , setPassWord] = useState('')
    const [passError , setPassError] = useState(false)
    const [email , setEmail] = useState('')
    const [emailError , setEmailError] = useState(false)
    const [firstName , setFirstName] = useState('')
    const [fnameError , setFnameError] = useState(false)
    const [lastName , setLastName] = useState('')
    const [lnameError , setLnameError] = useState(false)
    const [phoneNo , setPhoneNo] = useState('')

    // nije potrebno polje tako da ne mora error handle
    const [phoneError , setPhoneError] = useState(false)

    //const darkMode = (JSON.parse(window.localStorage.getItem('darkMode')));
    const darkMode = true 
    document.body.style.backgroundColor = darkMode ? "rgb(15, 6, 25)" :"azure";

    async function signUP(){

        const user = {
            korisnickoIme: userName,
            lozinka: passWord,
            ime: firstName,
            prezime: lastName,
            email: email,
            brTelefona: phoneNo
       }
       //console.log(JSON.stringify(user))
       try{
        let result = await fetch("https://localhost:5001/Korisnik/UnesiKorisnika/", {
            method : 'POST',
            headers : {
              'Content-Type': 'application/json; charset=utf-8',
              'Accept': 'application/json; charset=utf-8'
            },
            body : JSON.stringify(user)
          });
          let a = await result.json();
          //console.log(a);
          //console.log(JSON.stringify(a));

          //localStorage.setItem('user-info',JSON.stringify(a))
          //result  = await result.json();
          //console.log(result.status);
          if (a === 1){
            routeChange()
        
          }
          else if (a === 2){
             alert("Korisnik sa datim emailom vec postoji !")
          }
       }
       catch (error){
          //console.log(error)

       }
}
    
    // error check => pravljenjeNaloga( podaci [] )
    const handleSignUp = () =>{

        setEmailError(false);setFnameError(false);setUserError(false);setLnameError(false);setPassError(false);

        if ( firstName === ''){
            setFnameError(true)
        }
        if (lastName === ''){
            setLnameError(true)
        }
        if (userName === ''){
            setUserError(true)
        }
        if (passWord === ''){
            setPassError(true)
        }
        if (email === ''){
            setEmailError(true)           
        }
        if(passError || userError || lnameError || fnameError){
            Store.addNotification({
                title: "Warning!",
                message: "Not all fields are filled",
                type: "warning",
                insert: "top",
                container: "top-center",
                dismiss: {
                  duration: 2000,
                  onScreen: true
                }
              });
            //alert("Nisu popunjena sva potrebna polja")
        }
        // ako je sve ok pravi se nalog i prebacuje nas na main 
        if(!emailCheck()){
            alert("Nevalidan email")
        }
        if (firstName && lastName && userName && passWord  && emailCheck()){
            
            // pravljenjeNaloga( podaci[] )
            //console.log(firstName , lastName , userName ,passWord , email, phoneNo)

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

                    <div className="inputFirstLastName">
                        <div className="inputFirstName">                           
                                <TextField onChange={ (e) => setFirstName(e.target.value) } error={fnameError}
                                id="outlined-basic1" label="First Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" required sx= {{ width : "100%"}}/>                            
                        </div>
                        <div className="inputLastName">                            
                                <TextField onChange={ (e) => setLastName(e.target.value) } error={lnameError}
                                id="outlined-basic2" label="Last Name" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" required sx ={{ width : "100%"}}/>                          
                        </div>
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
                    <div className="inputPhoneSignUp">                         
                            <TextField onChange={ (e) => setPhoneNo(e.target.value) } 
                            id="outlined-basic6" label="Phone Number" inputProps={{ style: { fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="number" color="primary" sx ={{ width: "85%"  }}/>                             
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