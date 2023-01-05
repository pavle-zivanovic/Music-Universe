import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { /*CardMedia,*/ Typography } from '@mui/material';
//import Card from '@mui/material/Card';
//import { CardContent, CardMedia, CssBaseline } from '@material-ui/core';
//import Typography from '@mui/material/Typography';
//import '../Styles/Charts.css';
//import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import { styled } from '@mui/material/styles';
const songImages = ['url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")', 'url("../Images/maya.jpg")'];
const songs = ['Harem', 'La la la', 'Bebo', 'Nirvana', 'Haljina'];
const songsStreams = [623111, 512333, 142322, 141457, 88651, 3451];
const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });
  //const artistCover = 'url("../Images/maya.jpg")' 
  const artistNames = ['Maya Berovic', 'Maya Berovic','Maya Berovic','Maya Berovic','Maya Berovic']
  function Charts(){

    return(
        <div style={{ 
            display:'flex' ,
            flexDirection:'column', 
            //alignItems:'center', 
            margin:'20px 250px 500px 200px',
            //backgroundColor:'darkviolet'
            }}>
            <div >
            <Typography 
            style={{
                fontSize:'calc(25px + 1vw)',
                color:'white',
                margin:'100px 0px 0px 0px',
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
                    <Icon
                        style={{
                            background: songImages[index], 
                            width:'50px', 
                            height:'50px',
                            backgroundSize:'cover', 
                            marginLeft:'15px'}}>
                    </Icon>
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
                                {songs[index]}
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
                                {artistNames[index]}
                        </Typography>
                    </div>
                    <div style={{display:'flex'}}>
                    <Typography
                         style={{
                            position:'absolute', 
                            marginLeft:'50vw',
                            fontSize:'calc(10px + 0.5vw)',
                            color:'white', 
                            textAlign:'right',
                            display:'inline-block', 
                            whiteSpace:'nowrap', 
                            clear:'both', 
                            overflow:'hidden'
                            }}> 
                            {songsStreams[index].toLocaleString()} streams 
                    </Typography>
                    </div>
                </div>
            ))}
            </div>
        </div>    

       
    );
}

export default Charts;