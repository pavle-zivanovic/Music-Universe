import React from 'react';
import '../Styles/Featured.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from "react";


function ForYou(){
    const [songs ,setSongs] = useState(null);

    useEffect(() => {
        fetch("/Song/GetSongsForYou/"+2,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }) 
        .then(res =>  res.json())
        .then(data => {
                setSongs(data);
            });
      },[])

      return(
        <div>
             {songs && songs != null && <ForYou1 songs={songs} />}
        </div>
       )
}

function ForYou1({songs}){

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
                                    >
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
                                {song.song.title}
                            </div>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
}

export default ForYou;