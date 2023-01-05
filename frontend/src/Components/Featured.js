import React from 'react';
import '../Styles/Featured.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from "react";
import PlayBar from './PlayBar';


function Featured(){
    const [songs ,setSongs] = useState(null);

    useEffect(() => {
        fetch("/Song/GetSongsFeatured/",
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) =>  res.json())
        .then((data) => {
                setSongs(data);
            });
      },[])

      return(
        <div>
             {songs && songs != null && <Featured1 songs={songs} />}
        </div>
       )
}

function Featured1({songs}){

    const [isShown, setIsShown] = useState(false);

    const handleClick = event => {
        setIsShown(true);
      };
   
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
                            <IconButton onClick={handleClick}>
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
                                left:"15%",
                                top:"6%"}}>
                                {song.song.title}
                            </div>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
            {isShown && <PlayBar />}
        </Box>
    );
}

export default Featured;