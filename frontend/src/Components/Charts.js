import * as React from 'react';
import { Typography } from '@mui/material';
import {useEffect, useState} from "react";

  function Charts(){
    const [songs ,setSongs] = useState(null);

    useEffect(() => {
        fetch("/Song/GetSongsTopCharts/",
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) =>  res.json())
        .then((data) => {
                setSongs(data);
                console.log(data)
            });
      },[])

      return(
        <div>
             {songs && songs != null && <Charts1 songs={songs} />}
        </div>
       )
  }

  function Charts1({songs}){

    return(
        <div style={{ 
            display:'flex' ,
            flexDirection:'column', 
            //alignItems:'center', 
            margin:'0px 0px 500px 0px',
            //backgroundColor:'darkviolet'
            }}>
            <div >
            <Typography 
            style={{
                fontSize:'calc(25px + 1vw)',
                color:'white',
                margin:'0px 0px 0px 0px',
                fontWeight:'bold', 
                textAlign:'right', 
                //display:'inline-block', 
                whiteSpace:'nowrap', 
                clear:'both', 
                overflow:'hidden',
                alignItems:'center', 
                //margin:'50px 250px 500px 200px',
                backgroundColor:'darkviolet',
                display:'flex '  
                }}> 
             Top charts
            </Typography> 
            </div>
            
            <div>
            {songs.map((song, index) => (

                <div
                key={index}
                style={{
                    display:'flex', 
                    flexDirection:'row', 
                    alignItems:'center', 
                    backgroundColor: index%2==0? 'purple': 'darkviolet'
                    }}>
                    <Typography 
                        style={{
                            fontSize:'calc(10px + 0.5vw)',
                            color:'white',margin:'0px 0px 0px 15px', 
                            textAlign:'right', display:'inline-block', 
                            whiteSpace:'nowrap', 
                            clear:'both', 
                            overflow:'hidden'
                            }}> # {index+1} 
                    </Typography>
                    <div
                        style={{
                            backgroundImage:song.song.image!=null?'url('+ song.song.image + ')': null, 
                            width:'50px', 
                            height:'50px',
                            backgroundSize:'cover', 
                            marginLeft:'15px'}}>
                    </div>
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography variant='body2' gutterBottom
                            style={{
                                fontSize:'calc(10px + 0.5vw)',
                                color:'white',
                                margin:'0px 0px 0px 15px', 
                                textAlign:'left', 
                                display:'inline-block', 
                                whiteSpace:'nowrap', 
                                clear:'both', 
                                overflow:'hidden'
                                }}> 
                                {song.song.title}
                        </Typography>
                        <Typography color="text.secondary" variant='h6'
                            style={{
                                fontWeight:'lighter',
                                fontSize:'calc(7px + 0.5vw)',
                                color:'lightgray',
                                margin:'0px 0px 0px 15px', 
                                textAlign:'right', 
                                display:'inline-block', 
                                whiteSpace:'nowrap', 
                                clear:'both', 
                                overflow:'hidden'
                                }}> 
                                {song.singerName}
                        </Typography>
                    </div>
                    
                    <Typography
                         style={{
                            position:'absolute', 
                            //left:'70px',
                            marginLeft:'85vw',
                            fontSize:'calc(8px + 0.5vw)',
                            color:'white', 
                            textAlign:'right',
                            display:'inline-block', 
                            whiteSpace:'nowrap', 
                            clear:'both', 
                            overflow:'hidden'
                            }}> 
                            {song.song.streams.toLocaleString()} streams 
                    </Typography>
                    
                </div>
            ))}
            </div>
        </div>    

       
    );
}

export default Charts;