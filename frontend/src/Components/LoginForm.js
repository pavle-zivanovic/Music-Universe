import React, { Component, useState , useEffect}   from "react";
import Checkbox from '@mui/material/Checkbox';
import { pink , orange } from "@mui/material/colors";
import { CssBaseline, FormControlLabel, TextField } from "@mui/material";
import {ThemeProvider} from "@mui/system";
import { createTheme , experimental_sx as sx} from "@mui/material/styles"
import { json, useNavigate} from "react-router-dom";
import Grid from '@mui/material/Grid';
import { Switch } from "@mui/material";
import { Paper } from "@mui/material";
import { Store } from 'react-notifications-component';
import '../Styles/LoginForm.css';


function LoginForm()  {


    // konstante  za cuvanje inputa 
    const [userName , setUserName] = useState('')
    const [userError , setUserError] = useState(false)
    const [password , setPassWord] = useState('')
    const [passError , setPassError] = useState(false)
    //const [darkMode ,setDarkMode] = useState((JSON.parse(window.localStorage.getItem('darkMode'))));
    const darkMode = true
    document.body.style.backgroundColor = darkMode ? "rgb(15, 6, 25)" :"azure";

    const history = useNavigate();
    useEffect(() => {
      if(localStorage.getItem('user-info')){
        navigate("/Main")
      }
    },[])


    async function login(){

      const user = {
        userName : userName,
        password : password,
      };
      console.log(user);
      let result = await fetch("User/Login/", {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json; charset=utf-8',
        },
        body : JSON.stringify(user)
      });

      let a = await result.json(); 
      console.log(a);        
      localStorage.setItem('user-info',JSON.stringify(a));
      const token = (JSON.parse(window.localStorage.getItem('user-info')));
    }


    // error check => logovanje(user,pass)
    const handleLogin = () =>{

      // error ako je neki input prazan
      if ( userName === ''){
        setUserError(true)
      }
      if ( password === ''){
        setPassError(true)
      } // oba imaju vrednost => logovanje 
      if (userName && password){

        // logovanje(user , pass)
        //console.log(userName ,password)
        login();
        alert(userName , password);
      }
    }

    // promena strane 
    let navigate = useNavigate();
    const routeChange = () =>{ 
      let path = `/Main`; 
      navigate(path);
    }



return (
  <CssBaseline>
    <div className = { darkMode ?  "divMainDM" : "divMain" } >

        <Grid container>
        <Grid item md={4.5} xs={0} sm={2}>

        </Grid>
        <Grid item xs={12} sm={8} md={3} justifyContent={"center"} >
        <div>
        <div className={darkMode ? "divNaslovDm" : "divNaslov"}>
          <img src="../Images/Logo.png"></img>
        </div>
       
        <form className={ darkMode ?  "FormaDM" : "Forma" }>
            <label className={darkMode? "labelLoginDM" :"labelLogin"}></label>

            <div className="divUser">
    
                    <TextField  onChange={ (e) => setUserName(e.target.value) }
                    error={userError} id="outlined-basic" label="Username" inputProps={{ style: { backgroundColor : "rgb(24, 23, 23)" ,fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="text" color="secondary"/>
                   
            </div>

            <div className="divPass">
               
                    <TextField  onChange={ (e) => setPassWord(e.target.value) }
                    error={passError} id="outlined-basic" label="Password" inputProps={{ style: { backgroundColor : "rgb(24, 23, 23)",fontFamily: 'Arial', color: darkMode ? 'white':'black'}}} InputLabelProps={{ style : { color : darkMode ? "white":"rgb(0, 100, 100)"}}} variant="outlined" type="password" color="primary"/>
           
            </div>
            <button className="BtnLogin" onClick={(event) => { event.preventDefault() ; handleLogin();  } }>LOGIN</button>

            <label className={darkMode ?"OrSignUpDM" : "OrSignUp"}>Need an account ? <a className={darkMode ? "linkDM" : "link"} href ="http://localhost:3000/SignUp" >SignUp</a></label>   
        </form>
        </div>
        </Grid>
        <Grid item md={4.5} xs={0} sm={2}>

        </Grid>
        </Grid>
    </div>
</CssBaseline>

)
}

export default LoginForm ;