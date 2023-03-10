import React from 'react';
import '../Styles/Featured.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import {useEffect, useState} from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { trackListContext, trackIndexContext } from './PlayBarContext';
import { singerIndexContext, songIDContext } from './ArtistContext';

const token = (JSON.parse(window.localStorage.getItem('user-info')));

function ForYou({search}){
    const [songs ,setSongs] = useState(null);

    useEffect(() => {
        fetch("/Song/GetSongsForYou/"+token,
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

      useEffect(() => {
        if(search != null)
        {
            fetch("/Song/SearchSongs/"+search,
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
        }
        else
        {
            fetch("/Song/GetSongsForYou/"+token,
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
        }
      
      },[search])

      return(
        <div>
             {songs && songs != null && <ForYou1 songs={songs} />}
        </div>
       )
}

function ForYou1({songs}){

    const [isShown, setIsShown] = useState(false);
    let songID = null;

    const handleClick = event => {
        setIsShown(true);
      };

      const {trackList, setTrackList} = React.useContext(trackListContext)  
      const {trackIndex, setTrackIndex} = React.useContext(trackIndexContext)  
  
      const {singerIndex, setSingerIndex} = React.useContext(singerIndexContext)    
      const {songId, setSongId} = React.useContext(songIDContext)  

    const SelectTheSong = (id) =>{
        setTrackList(songs);
        setTrackIndex(id);

        setSingerIndex(songs[id].singerName)
        setSongId(songs[id].song.id)
    }  

    const LikeTheSong = (id) =>{
        songID = id;

        fetch("/Song/LikeTheSong/"+token+"/"+songID,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
        })
        window.location.reload(true)
    }

    return(
        <div>
            <Box sx={{ flexGrow: 1,
                    width:"89%", 
                    position:"relative",
                    left:"7%",
                    marginBottom:"2%" }}>
                <Grid container spacing={2}>
                    {songs.map((song, index) => (
                        <React.Fragment key={song.song.id}>
                            <Grid xs={4} sm={3} md={2}>
                                <IconButton onClick={()=>{SelectTheSong(index)}}>
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
                                    left:"14%",
                                    top:"6%"}}>
                                    {song.song.title}
                                </div>
                                <div 
                                style={{position:"relative",
                                    left:"15%",
                                    top:"6%"}}>
                                    <IconButton sx={{color:song.rating == true ? "red" : "white"}}
                                    onClick={()=>LikeTheSong(song.song.id)}>
                                        <FavoriteIcon />
                                    </IconButton>
                                </div>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Box>
            <div>

            </div>
        </div>
    );
}

export default ForYou;