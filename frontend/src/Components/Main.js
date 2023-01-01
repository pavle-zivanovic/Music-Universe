import * as React from 'react';
import { useState } from 'react';
import '../Styles/Main.css';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import {Button} from '@mui/material'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Featured from './Featured';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrowserRouter ,Route ,Routes, Navigate} from "react-router-dom";
import LoginForm from './LoginForm';
import ForYou from './ForYou';
import Charts from './Charts';
import { SettingsPowerRounded } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControlLabel, TextField } from "@mui/material";
import FileUpload from "react-mui-fileuploader"


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'white',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

const pages = [
  {
    id: 0,
    text: "Featured",
    path: ""
  },
  {
    id: 1,
    text: "For you",
    path: "foryou"
  },
  {
    id: 2,
    text: "Charts",
    path: "charts"
  }
]

function Main(){
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpenRight, setMobileOpenRight] = React.useState(null);
  const isMobileMenuOpenRight = Boolean(mobileOpenRight);
  const [open, setOpen] = React.useState(false)
  const [songID, setSongID] = React.useState(null);
  const [songName , setSongName] = React.useState('');
  const [singerName , setSingerName] = React.useState('');
  const [albumName , setAlbumName] = React.useState('');
  const [songWritter ,setSongWritter] = React.useState('');
  const [songGenre , setSongGenre] = React.useState('');
  const [releaseDate , setReleaseDate] = React.useState('');
  const [songLyrics ,setSongLyrics] = React.useState('');
  const [songFile ,setSongFile] = React.useState('');
  const [coverImage ,setCoverImage] = React.useState('');
  const [nameError , setNameError] = useState(false)
  const [singerError , setSingerError] = useState(false)
  const [genreError , setGenreError] = useState(false)
  const [lyricsError , setLyricsError] = useState(false)
  const [albumError , setAlbumError] = useState(false)
  const [writterError , setWritterError] = useState(false)
  const [dateError , setDateError] = useState(false)
  const [songFileError , setSongFileError] = useState(false)
  const [coverImageError , setCoverImageError] = useState(false)


  const handleMobileMenuOpenRight = (event) => {
    setMobileOpenRight(event.currentTarget);
  };
  
  const handleMobileMenuCloseRight = () => {
    setMobileOpenRight(null);
  };

  const handleClose = () => {
    setOpen(false)
  }
  const handleClick = () => {
    setOpen(true)
  }
  const handleSubmit = () => {

    setNameError(false);;setSingerError(false);setGenreError(false);setLyricsError(false);setAlbumError(false);setWritterError(false);
    setDateError(false);setSongFileError(false);setCoverImageError(false);


    if (songName === ''){
        setNameError(true)
    }
    if (singerName === ''){
        setSingerError(true)
    }
    if (songGenre === ''){
        setGenreError(true)           
    }
    if (songLyrics === ''){
      setLyricsError(true)           
    }
    if (songWritter === ''){
      setWritterError(true)           
    }
    if (releaseDate === ''){
      setDateError(true)           
    }
    if (songFile === ''){
      setSongFileError(true)           
    }
    if(nameError ||  singerError || genreError || lyricsError || writterError || dateError || songFileError){

        alert("Nisu popunjena sva potrebna polja")
    }
    if (songName && singerName  && songGenre && songLyrics && songWritter && releaseDate && songFile){
        
        addSong()

    }
    alert("Song : "  + songName + "\n" +
          "Singer :" + singerName + "\n" +
          "Album :" + albumName + "\n" +
          "Release Date :" + releaseDate.toString() + "\n" +
          "Song Writter :" + songWritter + "\n" +
          "Genre : " + songGenre + "\n" +
          "Lyrics  :" + songLyrics[0] + "\n" 
    )
    setOpen(false)
  }

  async function addSong(){


    const token = (JSON.parse(window.localStorage.getItem('user-info')));


    let rezPevac = await fetch("https://localhost:5001/Singer/GetSinger/" + singerName,{
      method : 'GET',
      headers : {
        'Content-Type' : 'aplication/json; charset=utf-8',
        'Accept' : 'aplication/json; charset=utf-8',
      }
    });
    let pevac = await rezPevac.json();

    let rezAlbum = await fetch("https://localhost:5001/Song/GetAlbum/" + albumName,{
      method : 'GET',
      headers : {
        'Content-Type' : 'aplication/json; charset=utf-8',
        'Accept' : 'aplication/json; charset=utf-8',
      }
    });
    let album = await rezAlbum.json();
    if (album == null){album = -1;}

    let rezTekstopisac = await fetch("https://localhost:5001/Singer/GetSongwriter/" + songWritter,{
      method : 'GET',
      headers : {
        'Content-Type' : 'aplication/json; charset=utf-8',
        'Accept' : 'aplication/json; charset=utf-8',
      }
    });
    let tekstopisac = await rezTekstopisac.json();    

    const song = {
      title : songName,
      lyrics : songLyrics,
      year : releaseDate,
      genre : songGenre,
      song : songFile,
      image : coverImage,
      streams : 0 ,
    };
    console.log(user);
    let result = await fetch("https://localhost:5001/Song/AddSong/" + token + "/" + pevac + "/" + album +"/" + tekstopisac, {
      method : 'POST',
      headers : {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
      },
      body : JSON.stringify(song)
    });

    let a = await result.json(); 
  }

  const renderMobileMenuRight = (
    <Menu
        anchorEl={mobileOpenRight}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        keepMounted
        open={isMobileMenuOpenRight}
        onClose={handleMobileMenuCloseRight}
        >
        <MenuItem> 
            <IconButton
            size="large"
            >
            <Badge badgeContent={17} color="error">
                <NotificationsIcon/>
            </Badge>
            </IconButton>
            <p>Notifications</p>
        </MenuItem>
        <MenuItem>
            <IconButton
            size="large"
            >
            <AccountCircle />
            </IconButton>
            <p>Profile</p>
        </MenuItem>

      </Menu>
  );


  const [mobileOpenLeft, setMobileOpenLeft] = React.useState(null);
  const isMobileMenuOpenLeft = Boolean(mobileOpenLeft);

  const handleMobileMenuOpenLeft = (event) => {
    setMobileOpenLeft(event.currentTarget);
  };
  
  const handleMobileMenuCloseLeft = () => {
    setMobileOpenLeft(null);
  };

  const renderMobileMenuLeft = (
    <Menu
        anchorEl={mobileOpenLeft}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        keepMounted
        open={isMobileMenuOpenLeft}
        onClose={handleMobileMenuCloseLeft}
        >
          {pages.map((page) => (
                <MenuItem 
                  key={page.id}
                  onClick={() => navigate(page.path)}
                  className={location.pathname == "/Main" + page.path ? "active" 
                  :location.pathname == "/Main/" + page.path ? "active" : null}
                  >
                  <p>{page.text}</p>
                </MenuItem>
          ))}
      </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, width:"100%" }}>
      <AppBar 
       position="sticky" 
       sx={{backgroundColor: "rgb(161, 34, 161)", width:"100%"}}>
        <Toolbar>
          <Box sx={{ display: { sm: 'none', md: 'none' } }}>
              <IconButton
                size="large"
                edge="start"
                aria-label="open drawer"
                sx={{ mr: 2, 
                color:"rgb(15, 6, 26)"}}
                
              >
                <MenuIcon />
              </IconButton>
            </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' },  
            fontWeight:"bold",
            fontFamily: "MV Boli" }}
          >
            Music
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, 
            color:"rgb(15, 6, 26)", 
            fontWeight:"bold",
            fontFamily: "MV Boli",
            marginRight:"1%" }}
          >
            Universe
          </Typography>
          {pages.map((page) => (
                <MenuItem 
                  key={page.id}
                  size="large"
                  onClick={() => navigate(page.path)}
                  className={location.pathname == "/Main" + page.path ? "active" 
                  :location.pathname == "/Main/" + page.path ? "active" : null}
                  sx={{ mr: 2, 
                  display: { xs: 'none', sm: 'block' }}}
                  >
                    <Typography 
                    textAlign="center"
                    variant="h6"
                    noWrap
                    sx={{ fontFamily: "MingLiU-ExtB",
                    fontWeight:"bold"
                  }}>{page.text}</Typography>
                </MenuItem>
          ))}
          <Search 
           sx={{color:"rgb(15, 6, 26)" }}>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              onClick={handleClick}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
            >
              <AddIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleMobileMenuOpenRight}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenuLeft}
      {renderMobileMenuRight}
      <div className="divRoutes">
      <Dialog open={open} onClose={handleClose}>
             <DialogTitle style={{
                backgroundColor : "rgb(46, 45, 45)" ,
                color : "white" ,
             }}>
               Add your song
             </DialogTitle>
              <DialogContent style={{
                 backgroundColor : "rgb(46, 45, 45)" ,
              }}>
                  <TextField id="outlined-basic" label="Song Title" inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                    error={nameError}  onChange={(e) => setSongName(e.target.value)}
                        sx={{
                          width :"45%",
                          marginRight: "5%",
                          marginTop : "2.5%",
                          marginBottom : "5%",
                          }}/>   
                  <TextField id="outlined-basic" label="Singer" inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                    error={singerError}  onChange={(e) => setSingerName(e.target.value)}
                        sx={{
                          width :"45%",
                          marginLeft : "5%",
                          marginTop : "2.5%",
                          marginBottom : "5%",
                          }}/>                             
                  <TextField id="outlined-basic" label="Album" inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'}  
                    error={albumError}  onChange={(e) => setAlbumName(e.target.value)}
                        sx={{
                          width :"45%",
                          marginRight : "5%",
                          marginTop : "2.5%",
                          marginBottom : "5%",
                          }}/>   
                  <TextField id="outlined-basic" label="Song Writter" inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'}  required
                    error={writterError}  onChange={(e) => setSongWritter(e.target.value)}
                        sx={{
                          width :"45%",
                          marginLeft : "5%",
                          marginTop : "2.5%",
                          marginBottom : "5%",
                          }}/>                                           
                  <TextField id="outlined-basic" label="Song Genre"  inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" maxRows ={'1'} required 
                      error={genreError}  onChange={(e) => setSongGenre(e.target.value)}
                          sx={{
                           width :"45%",
                           marginRight : "5%",
                           marginTop : "2.5%",
                           marginBottom : "5%",
                           }}/> 
                  <TextField id="outlined-basic" label="Release Date"  inputProps={{   style: { fontFamily: 'Arial', color: 'white'}}}  InputLabelProps={{ shrink : true , style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="date" color="primary" maxRows ={'1'} required 
                      error={dateError}  onChange={(e) => setReleaseDate(e.target.value)}
                          sx={{
                           width :"45%",
                           marginLeft : "5%",
                           marginTop : "2.5%",
                           marginBottom : "5%",
                           }}/>                                  
                  <TextField onChange={ (e) => setSongLyrics(e.target.value) } //error={projDescError}
                      error={lyricsError} id="outlined-basic" label="Lyrics"  inputProps={{ style: { fontFamily: 'Arial', color: 'white'}}} InputLabelProps={{ style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="text" color="primary" 
                          multiline 
                          required
                          rows={'5'}
                          //maxRows={'5'}  
                          sx={{ width : "100%", height: "40%"}}/>
                  <TextField id="outlined-basic" label="Song File"  inputProps={{   style: { fontFamily: 'Arial', color: 'white'}}}  InputLabelProps={{ shrink : true , style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="file" color="primary" maxRows ={'1'} required 
                      error={songFileError}  onChange={(e) => setSongFile(e.target.value)}
                          sx={{
                           width :"45%",
                           marginRight : "5%",
                           marginTop : "2.5%",
                           marginBottom : "5%",
                           }}/>
                  <TextField id="outlined-basic" label="Cover Image"  inputProps={{   style: { fontFamily: 'Arial', color: 'white'}}}  InputLabelProps={{ shrink : true , style : { color : "rgb(0, 100, 100)"}}} variant="outlined"  type="file" color="primary" maxRows ={'1'} required 
                      error={coverImageError}  onChange={(e) => setCoverImage(e.target.value)}
                          sx={{
                           width :"45%",
                           marginLeft : "5%",
                           marginTop : "2.5%",
                           marginBottom : "5%",
                           }}/>                                                 
              </DialogContent>
              <DialogActions style={{
                 backgroundColor :"rgb(46, 45, 45)",
              }}>
              <Button onClick={handleClose} color="secondary" sx={{fontWeight:"bold"}}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" color="secondary" sx={{fontWeight:"bold"}}>Sumbit</Button>
             </DialogActions>
        </Dialog> 
            <Routes>
                <Route path="" element={<Featured />} />
                <Route path="foryou" element={<ForYou />} />
                <Route path="charts" element={<Charts />} />
                <Route path="/*" element={<LoginForm />} />
            </Routes>
      </div>
    </Box>
  );
}

export default Main;