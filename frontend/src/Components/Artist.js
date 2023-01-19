import * as React from 'react';
import '../Styles/Artist.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Button, Icon } from '@mui/material';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayBar from './PlayBar';
import { trackListContext, trackIndexContext } from './PlayBarContext';
import { singerIndexContext } from './ArtistContext';


const artistCover = 'url("../Images/avatar.jpg")' 
//margin:'10% 10% 10% 10%'
function Artist(){

    const [singerStats ,setSingerStats] = React.useState(null);
    const [allSongs ,setAllSongs] = React.useState(null);
    const [popularSongs ,setPopularSongs] = React.useState(null);
    const [subStatus ,setSubStatus] = React.useState(false);

    const {singerIndex, setSingerIndex} = React.useContext(singerIndexContext)  

    React.useEffect(() => {
        fetch("/Singer/GetSingerStats/"+singerIndex,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) =>  res.json())
        .then((data) => {
                setSingerStats(data[0]);
            });

        fetch("/Singer/GetSingerSongs/"+singerIndex,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) =>  res.json())
        .then((data) => {
                setAllSongs(data);
            });  
            
        fetch("/Singer/GetSingerPopularSongs/"+singerIndex,
        {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) =>  res.json())
        .then((data) => {
                setPopularSongs(data);
            });

        console.log(singerIndex);
      },[singerIndex])
      

      async function Subscribe() {
        if(subStatus==false)
        {
            let result = await fetch("/User/Subscribe/" + singerStats.id + "/" + 11, {
                method : 'POST',
                headers : {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8',
                },
                })
            if(result.status==200){
                setSubStatus(true);
            }
        }
        else
        {
            let result = await fetch("/User/UnSubscribe/" + singerStats.id + "/" + 11, {
                method : 'DELETE',
                headers : {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Accept': 'application/json; charset=utf-8',
                },
                })
            if(result.status==200){
                setSubStatus(false);
            }
        }
      };

    return(
        <div>
            <div
            style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor:'rgb(51,0,51)'}}>
                <Icon
                style={{background: artistCover, width:'200px', height:'200px',backgroundSize:'cover'}}>
                </Icon>
                <Typography style={{fontSize:'calc(15px + 2.5vw)',color:'white',margin:'0px 0px 0px calc(15px + 2.5vw)', fontWeight:'bold', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}>{singerStats!=null? singerStats.singerName:""}</Typography>
                <Button style={{marginLeft:'10vw',backgroundColor:'rgb(51,153,255)', color:'white'}}
                onClick={() => {Subscribe()}}>{subStatus==false? "Subscirbe" : "Unsubscribe"}</Button>
            </div> 
            {popularSongs && popularSongs != null && <PopularSongs songs={popularSongs} />}
            <div>
            {allSongs && allSongs != null && <AllSongs songs={allSongs} />}
            </div>      
        

            <div
            style={{backgroundColor:'rgb(51,0,51)'}}>
                <div>
                    <Typography style={{fontSize:'calc(15px + 1vw)',color:'white',margin:'calc(10px + 0.7vw) 0px 0px calc(15px + 1vw)', fontWeight:'bold', textAlign:'right', display:'inline-block'}}> About</Typography>
                </div>
                <div>
                     <Typography style={{fontSize:'calc(10px + 0.5vw)',color:'white',margin:'calc(5px + 0.33vw) calc(5px + 0.33vw) calc(5px + 0.33vw) calc(15px + 1vw)', textAlign:'right', display:'inline-block'}}> Born in {singerStats!=null? singerStats.birthplace:""} at {singerStats!=null? singerStats.birthday:""} </Typography>    
                </div>
                <div>
                    <Typography style={{fontSize:'calc(8px + 0.4vw)',color:'white',margin:'calc(5px + 0.33vw) calc(5px + 0.33vw) calc(30px + 2vw) calc(15px + 1vw)', textAlign:'left', display:'inline-block'}}> {singerStats!=null? singerStats.biography:""} </Typography>
                </div>
            </div>
        </div>
    );
}

function AllSongs({songs}){
    const [isShown, setIsShown] = React.useState(false);
    let songID = null;

    const handleClick = event => {
        setIsShown(true);
      };

    const {trackList, setTrackList} = React.useContext(trackListContext)   
    const {trackIndex, setTrackIndex} = React.useContext(trackIndexContext)  

    const SelectTheSong = (id) =>{
        setTrackIndex(id);
        setTrackList(songs);
    }  

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
                    {songs.map((song, index) => (
                        <React.Fragment key={song.song.id}>
                            <Grid xs={4} sm={3} md={2}>
                                <IconButton onClick={()=>SelectTheSong(index)}>
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

            </div>
        </div>
    )
}

function PopularSongs({songs}){
    const [isShown, setIsShown] = React.useState(false);
    let songID = null;

    const handleClick = event => {
        setIsShown(true);
      };

    const {trackList, setTrackList} = React.useContext(trackListContext) 
    const {trackIndex, setTrackIndex} = React.useContext(trackIndexContext)  

    const SelectTheSong = (id) =>{
        setTrackIndex(id);
        setTrackList(songs);
    }    

    return(
        <div>
             <Typography style={{fontSize:'calc(15px + 1vw)',color:'white',margin:'0px 0px 0px calc(15px + 1vw)', fontWeight:'bold', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> Popular tracks</Typography>
            <div>
            {songs.map((song, index) => (
                <div
                key={index}
                onClick={()=>SelectTheSong(index)}
                style={{display:'flex', flexDirection:'row', alignItems:'center', backgroundColor: index%2==0? 'rgb(91,0,91)': 'rgb(51,0,51)'}}>
                    <Typography style={{fontSize:'calc(10px + 0.5vw)',color:'white',margin:'0px 0px 0px 15px', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> {index+1} </Typography>
                    <Icon
                    style={{background: song.song.image, width:'50px', height:'50px',backgroundSize:'cover', marginLeft:'15px'}}>
                    </Icon>
                    <Typography style={{fontSize:'calc(10px + 0.5vw)',color:'white',margin:'0px 0px 0px 15px', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> {song.song.title} </Typography>
                    <Typography style={{position:'absolute', marginLeft:'80vw',fontSize:'calc(10px + 0.5vw)',color:'white', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}> {song.song.streams.toLocaleString()} streams </Typography>
                </div>
            ))}
            </div>
            <div>

            </div>
        </div>
    )
}

export default Artist;