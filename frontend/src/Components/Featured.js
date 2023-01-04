import React from 'react';
import '../Styles/Featured.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from "react";

/*const songs = ['harem', 'pesma2', 'pesma3', 'pesma4', 'pesma5', 
'pesma6', 'pesma7', 'pesma8', 'pesma9', 'pesma10',
'pesma11', 'pesma12', 'pesma13', 'pesma14', 'pesma15',
'pesma16', 'pesma17', 'pesma18', 'pesma19', 'pesma20',
'pesma21', 'pesma22', 'pesma23', 'pesma24', 'pesma25',
'pesma26', 'pesma27', 'pesma28', 'pesma29', 'pesma30'];*/

function Featured(){
    const [songs ,setSongs] = useState(null);

    useEffect(() => {
        fetch("Song/GetSongsFeatured/",
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => { res.json()
            .then(data => {
                console.log(data);
                setSongs(data);
            });
        })
      },[])

      return(
        <div>
             {songs && songs != null && <Featured1 songs={songs} />}
        </div>
       )
}

function Featured1({songs}){
   
    return(
        <Box sx={{ flexGrow: 1,
                width:"89%", 
                position:"relative",
                left:"7%",
                marginBottom:"2%" }}>
            <Grid container spacing={2}>
                {songs.map((song) => (
                    <React.Fragment key={song.song.id}>
                        <Grid xs={4} sm={3} md={2}>
                            <IconButton onClick={() => {alert("Klikić");}}>
                                <Tooltip title={song.singerName}
                                        placement="top">
                                    <div className="songCircle"
                                    style={{backgroundImage:'url(' + song.song.image + ')'}}>
                                        <div className="innerSongCircle">
                                            <div className="secondInnerSongCircle"></div>
                                        </div>
                                    </div>
                                </Tooltip>
                            </IconButton>
                            <div 
                            style={{color:"white",
                                position:"relative",
                                left:"15%",
                                top:"6%"}}>
                                {song.song.title}
                            </div>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
}

export default Featured;