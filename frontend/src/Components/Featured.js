import React from 'react';
import '../Styles/Featured.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from "react";
import PlayBar from './PlayBar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';


function Featured(){
    const [songs ,setSongs] = useState(null);

    useEffect(() => {
        fetch("/Song/GetSongsFeatured/"+10,
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
    let songID = null;

    const handleClick = event => {
        setIsShown(true);
      };

    const LikeTheSong = (id) =>{
        songID = id;

        fetch("/Song/LikeTheSong/"+10+"/"+songID,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
        })
        window.location.reload(true)
    }

    const DeleteSong = (id) =>{
        songID = id;

        fetch("/Song/DeleteSong/"+songID+"/"+"payaz",
        {
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
        }).then((res) =>  res.json())
        .then((data) => {
                if(data == 0)
                {
                    alert("Niste u mogucnosti da obrisete pesmu!");
                }
            });
    }

    return(
        <div>
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
                                        style={{backgroundImage: 
                                            song.song.image!=null?'url('+ song.song.image + ')': null}}>
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
                                <div 
                                style={{position:"relative",
                                    left:"8%",
                                    top:"6%"}}>
                                    <IconButton sx={{color:song.rating == true ? "red" : "white"}}
                                    onClick={()=>LikeTheSong(song.song.id)}>
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton sx={{color:"white"}}
                                    onClick={()=>DeleteSong(song.song.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Box>
            <div>
                {isShown && <PlayBar />}
            </div>
        </div>
    );
}

export default Featured;