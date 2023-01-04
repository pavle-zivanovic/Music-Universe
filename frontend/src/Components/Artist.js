import * as React from 'react';
import '../Styles/Artist.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Button, Icon } from '@mui/material';
import Typography from '@mui/material/Typography';

const songs = ['harem', 'Viktorijina tajnaaaa', 'Bebo', 'Nirvana', 'Haljina', 'Plava'];
const songImages = ['url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")'];
const songsStreams = [123111, 512333, 142322, 144457, 88651, 353451, 1766611, 765441, 4321331];
const about = "Maya Berović is a Bosnian Serb singer. Born in Ilijaš, she debuted in 2007 with the album Život uživo"

const artistCover = 'url("../Images/maya.jpg")' 
const artistName = 'Maya Berovic'
const birthday = '8 July 1987'
const birthplace = 'Ilijas'
//margin:'10% 10% 10% 10%'
function Artist(){

    return(
        <div>
            <div
            style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'rgb(51,0,51)'}}>
                <Icon
                style={{background: artistCover, width:'200px', height:'200px',backgroundSize:'cover'}}>
                </Icon>
                <Typography style={{fontSize:'calc(15px + 2.5vw)',color:'white',margin:'0px 0px 0px calc(15px + 2.5vw)', fontWeight:'bold', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}>{artistName}</Typography>
            </div> 
            <Typography style={{fontSize:'calc(15px + 1vw)',color:'white',margin:'0px 0px 0px calc(15px + 1vw)', fontWeight:'bold', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> Popular tracks</Typography>
            <div>
            {songs.map((song, index) => (

                <div
                key={index}
                style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor: index%2==0? 'rgb(91,0,91)': 'rgb(51,0,51)'}}>
                    <Typography style={{fontSize:'calc(10px + 0.5vw)',color:'white',margin:'0px 0px 0px 15px', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> {index} </Typography>
                    <Icon
                    style={{background: songImages[index], width:'50px', height:'50px',backgroundSize:'cover', marginLeft:'15px'}}>
                    </Icon>
                    <Typography style={{fontSize:'calc(10px + 0.5vw)',color:'white',margin:'0px 0px 0px 15px', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> {songs[index]} </Typography>
                    <Typography style={{position:'absolute', marginLeft:'80vw',fontSize:'calc(10px + 0.5vw)',color:'white', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> {songsStreams[index].toLocaleString()} streams </Typography>
                </div>
            ))}
            </div>
            <div>

            </div>      
            <Box sx={{ flexGrow: 1,
                    width:"89%", 
                    position:"relative",
                    left:"7%",
                    marginBottom:"2%" }}> 
                <Grid container spacing={2}>
                    {songs.map((song) => (
                        <Grid key={song} 
                        xs={4} sm={3} md={2}>
                            <IconButton onClick={() => {alert("Klikić");}}>
                                <Tooltip title="Maya Berovic"
                                        placement="top">
                                    <div className="songCircle"
                                    style={{backgroundImage:'url("../Images/maya.jpg")'}}>
                                        <div className="innerSongCircle">
                                        <div className="secondInnerSongCircle"></div>
                                        </div>
                                    </div>
                                </Tooltip>
                            </IconButton>
                            <div 
                            style={{color:"white",
                                position:"relative",
                                left:"14%",
                                top:"6%"}}>
                                {song}
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <div
            style={{backgroundColor:'rgb(51,0,51)'}}>
                <div>
                    <Typography style={{fontSize:'calc(15px + 1vw)',color:'white',margin:'calc(10px + 0.7vw) 0px 0px calc(15px + 1vw)', fontWeight:'bold', textAlign:'right', display:'inline-block'}}> About</Typography>
                </div>
                <div>
                     <Typography style={{fontSize:'calc(10px + 0.5vw)',color:'white',margin:'calc(5px + 0.33vw) calc(5px + 0.33vw) calc(5px + 0.33vw) calc(15px + 1vw)', textAlign:'right', display:'inline-block'}}> Born in {birthplace} at {birthday} </Typography>    
                </div>
                <div>
                    <Typography style={{fontSize:'calc(8px + 0.4vw)',color:'white',margin:'calc(5px + 0.33vw) calc(5px + 0.33vw) calc(30px + 2vw) calc(15px + 1vw)', textAlign:'left', display:'inline-block'}}> {about}{about}{about}{about} </Typography>
                </div>
            </div>
        </div>
    );
}

export default Artist;