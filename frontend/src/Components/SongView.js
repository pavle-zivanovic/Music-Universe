import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import '../Styles/SongView.css';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {useEffect, useState} from "react";
import { FormControlUnstyled } from '@mui/base';
import { songIDContext } from './ArtistContext';


function SongView(){
    const [song ,setSong] = useState(null);
    const [lyrics, setLyrics] = useState(null);

    const {songId, setSongId} = React.useContext(songIDContext)  

    useEffect(() => {
        fetch("/Song/GetSongView/"+songId,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) =>  res.json())
        .then((data) => {
                setSong(data);
                setLyrics(data.song.lyrics.split("."));
            });
      },[songId])

      return(
        <div>
            {song != null && lyrics != null && song && lyrics &&<SongView1 song={song} lyrics={lyrics}/>}
        </div>
       )
}

function SongView1({song, lyrics}){

    return(
        <Box sx={{ flexGrow: 1, 
                 width:"60%",
                 position:"relative", 
                 left:"30%",
                 marginTop:"5%"
                  }}>
             <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12}>
                    <div style={{display:"flex"}}>
                        <div className="divSongViewSongCircle"
                             style={{backgroundImage:'url('+song.song.image+')'}}>

                        </div>
                        <div style={{marginLeft:"2%", marginTop:"3%"}}>
                            <div>
                                <Typography sx={{color:"white"}}
                                            variant="h5"
                                            fontFamily="Lucida Console">
                                            {song.singerName}
                                </Typography>
                            </div>
                            <div>
                                <Typography sx={{color:"white"}}
                                            variant="h5"
                                            fontFamily="Lucida Console">
                                            {song.albumName!=null ? song.albumName : null}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid xs={12} sm={12} md={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                            m: 1,
                            width: 540,
                            height: 400,
                            },
                        }}
                        >
                        <Paper sx={{overflow: "auto",
                                    backgroundColor:"#CF9FFF",
                                    borderRadius:"20px", 
                                    borderColor:"rgb(161, 34, 161)",
                                    borderStyle:"dotted", 
                                    borderWidth:"thick"}}>
                            <List>
                                {lyrics.map((item, index) => (
                                    <ListItem
                                     sx={{height:"30px"}}
                                     key={index}
                                    >
                                       <ListItemText sx={{wordWrap:"break-word", 
                                                         fontFamily:"Brush Script MT",
                                                         marginLeft:"28%"}}
                                       primary={
                                        <React.Fragment>
                                          <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body"
                                            color="text.primary"
                                            fontFamily="Bahnschrift SemiBold"
                                          >
                                            {item}
                                          </Typography>
                                        </React.Fragment>
                                      }/>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Box>
                </Grid>
             </Grid>
        </Box>
    );
}


export default SongView;