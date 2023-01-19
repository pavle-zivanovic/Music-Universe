import * as React from 'react';
import '../Styles/PlayBar.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import ReplayIcon from '@mui/icons-material/Replay';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Typography from '@mui/material/Typography';
import { Button, Icon } from '@mui/material';
import { trackListContext, trackIndexContext } from './PlayBarContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { singerIndexContext, songIDContext } from './ArtistContext';

function PlayBar(){

    const [firstRender, setFirstRender] = React.useState(true)
    const [curTrackTimeDisplay, setCurTrackTimeDisplay] = React.useState("00.00")
    const [curTrackDurationDisplay, setCurTrackDurationDisplay] = React.useState("00.00")
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)
    let updateTimer
    const [curr_song, setCurSong] = React.useState()
    const [curr_track, setCurTrack] = React.useState(document.createElement('audio'))
    const [isSliding, setIsSliding] = React.useState(false)
    const [timerTrigger, setTimerTrigger] = React.useState(false)
    const navigate = useNavigate();



    React.useEffect(() => {
      if(timerTrigger===true)
      {
        if(!isSliding)
          seekUpdate()
        setTimerTrigger(false)
      }
    }, [timerTrigger]);

    const IncreasePlaysNumber = (id) =>{
      var songID = id;

      fetch("/Song/IncreasePlaysNumber/"+songID,
      {
          method:"PUT",
          headers:{
              "Content-Type":"application/json"
          },
      })
  }
    

      function loadTrack(trackIndex, toPlay=false) {
        clearInterval(updateTimer);
        resetValues();
       
        setCurSong(trackList[trackIndex]);
        curr_track.src = trackList[trackIndex].song.song;
        curr_track.load();
        IncreasePlaysNumber(trackList[trackIndex].song.id)
       
        updateTimer = setInterval(timerUpdate, 1000);
        curr_track.addEventListener("ended", nextTrack);

        setIsLoaded(true)
        setIsPlaying(false)

        if(toPlay)
          playTrack()
      }

      function timerUpdate(){
        setTimerTrigger(true)
      }

      function seekUpdate(seekPoint=-1) {
        let currTime = seekPoint/100*curr_track.duration

        if(seekPoint===-1)
        {
          currTime=curr_track.currentTime
          document.getElementsByClassName("seek_slider")[0].value = curr_track.currentTime/curr_track.duration*100
        }
        else
        {
          if(!isSliding)
          {
            setIsSliding(true)  
          }
        }

        let currentMinutes = Math.floor(currTime / 60);
        let currentSeconds = Math.floor(currTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        setCurTrackTimeDisplay(currentMinutes + ":" + currentSeconds);
        setCurTrackDurationDisplay(durationMinutes + ":" + durationSeconds);  
      }

      
      function playpauseTrack() {
        if (!isPlaying) 
        {
          if(!isLoaded)
            loadTrack(trackIndex)
          playTrack()
        }
        else
        {
          pauseTrack()
        }
      }

      function playTrack() {
        setIsPlaying(true)

        const playPromise = curr_track.play();

        if (playPromise !== undefined) {
          playPromise
            .then(_ => {
              // Automatic playback started!
              // Show playing UI.
              console.log("audio played auto");
            })
            .catch(error => {
              // Auto-play was prevented
              // Show paused UI.
              console.log(error);
            });
        }
      }

      function pauseTrack() {
        setIsPlaying(false)
        
        
        const pausePromise = curr_track.pause();

        if (pausePromise !== undefined) {
          pausePromise
            .then(_ => {
              // Automatic pauseback started!
              // Show pauseing UI.
              console.log("audio paused auto");
            })
            .catch(error => {
              // Auto-pause was prevented
              // Show paused UI.
              console.log(error);
            });
        }
      }

      function resetValues() {
        setCurTrackTimeDisplay("00.00");
        setCurTrackDurationDisplay("00.00");
      }

      function nextTrack() {
        if(trackIndex===trackList.length-1)
        {
          pauseTrack()
          return;
        }
        setTrackIndex(trackIndex+1)
      }

      function prevTrack() {
        if(trackIndex===0)
          return;

        if (trackIndex > 0)
          setTrackIndex(trackIndex - 1);
        else
          setTrackIndex(trackIndex.length - 1);
      }


  
    const SlideDroped = () => {
        setIsSliding(false)
        if(curr_track!=null)
          curr_track.currentTime = document.getElementsByClassName("seek_slider")[0].value/100*curr_track.duration;
      };

      const {trackList, setTrackList} = React.useContext(trackListContext)  
      const {trackIndex, setTrackIndex} = React.useContext(trackIndexContext)  
      const {singerIndex, setSingerIndex} = React.useContext(singerIndexContext)    
      const {songId, setSongId} = React.useContext(songIDContext)  

      React.useEffect(() =>{
        if(trackList==null || trackList.length==0)
        {
          fetch("/Singer/GetCacheSongList/"+ "SongList:11",
          {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            },
          }).then((res) =>  res.json())
            .then((data) => {
              fetch("/Song/GetSongListFromIDs/"+ 10,
              {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
                
              }).then((res) =>  res.json())
                .then((data2) => {
                    setTrackList(data2)
                    fetch("/Singer/GetCacheSong/"+"Song:11",
                    {
                        method:"GET",
                        headers:{
                            "Content-Type":"application/json"
                        },
                    }).then((res) =>  res.json())
                    .then((data3) => {
                            setTrackIndex(data3)
                        });
                });
                
            });
        }
      })

      React.useEffect(() => {
        console.log(trackList)
        console.log(trackIndex)
        if(trackList!=null && trackIndex>=0){
          setCurSong(trackList[trackIndex]);
          console.log(trackList[trackIndex]);

          let songIDs = trackList.map(song => 
            {return song.song.id});

          console.log(songIDs);
          
            
          fetch("/Singer/SetCacheSongList/"+ "SongList:11",
          {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(songIDs)
            
          })

          fetch("/Singer/SetCacheSong/"+ "Song:11" +"/" + trackIndex,
          {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            
          })

          setSingerIndex(trackList[trackIndex].singerName)
          setSongId(trackList[trackIndex].song.id)

          if(firstRender)
          {
            document.getElementsByClassName("seek_slider")[0].value = 0
            setFirstRender(false)
            return
          }
          loadTrack(trackIndex, true);
        }
      },[trackList, trackIndex])


    return (
        <AppBar 
        position="sticky" 
        sx={{bottom:'0',backgroundColor: "rgb(161, 34, 161)", width:"100%", display:'flex', flexDirection:'row'}}>
          <div style={{display:'flex',flexDirection: 'column'}}>
            <Icon
            className='Vinyl'
            style={{marginLeft:'10px', marginTop:'10px' ,backgroundImage:'url("../Images/vinyl.jpg")',maxWidth:'200px', maxHeight:'160px', width:'20vw', height:'16vw'}}>
              {curr_song!=null? <div className="songCirclePlayBar"
              style={{animationName:isPlaying?'rotate':'',background: 'url('+ curr_song.song.image + ')', width:'60%', height:'75%', margin:'10% 10% 10% 11%'}}>
                  <div className="innerSongCircleBlack"></div>
              </div>:null}
            </Icon>
            {false?
            <div style={{display:'flex',flexDirection: 'column'}}>
            <Typography onClick={() => navigate("song")} style={{margin:'10px 10px 0px 10px', textAlign:'right'}}>{curr_song!=null? curr_song.song.title:""}</Typography>
            <Typography onClick={() => navigate("artist")} style={{margin:'0px 10px 10px 10px', fontWeight:'bold', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}>{curr_song!=null? curr_song.singerName:""}</Typography>
            </div>:null}
          </div>
          <div style={{display:'flex',flexDirection: 'column', alignSelf:'end'}}>
            <Typography style={{margin:'10px 10px 0px 10px', textAlign:'left'}}>{trackIndex}</Typography>
          </div>

          {true? <div style={{display:'flex',flexDirection: 'column', alignSelf:'end'}}>
            <Typography onClick={() => navigate("song")} style={{margin:'10px 10px 0px 10px', textAlign:'left'}}>{curr_song!=null? curr_song.song.title: ""}</Typography>
            <Typography onClick={() => navigate("artist")} style={{margin:'0px 10px 10px 10px', fontWeight:'bold', textAlign:'left', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}>{curr_song!=null? curr_song.singerName:""}</Typography>
          </div> : null}
          <div style={{width:'80%', marginTop:'50px'}}>
            <Toolbar className='playbar'>
                <div
                style={{whiteSpace:'nowrap'}}>
                    <Button sx={{ mr: 2, 
                    color: curr_song!=null? "rgb(255, 255, 255)" : "rgb(180, 120, 180)"}}
                    onClick={() => {if(curr_song!=null)prevTrack();}}>
                        <SkipPreviousIcon
                            fontSize="large"
                            />
                    </Button>
                    <Button sx={{ mr: 2, 
                    color: curr_song!=null? "rgb(255, 255, 255)" : "rgb(180, 120, 180)"}}
                    onClick={() => {if(curr_song!=null)playpauseTrack();}}>
                      {isPlaying?<PauseCircleFilledIcon
                        fontSize="large"
                        />:<PlayCircleFilledIcon
                        fontSize="large"
                        />}
                    </Button>
                    <Button sx={{ mr: 2, 
                    color: curr_song!=null? "rgb(255, 255, 255)" : "rgb(180, 120, 180)"}}
                    onClick={() => {if(curr_song!=null)nextTrack();}}>
                        <SkipNextIcon
                        fontSize="large"
                        />
                    </Button>
                    <Button sx={{ mr: 2, 
                    color: curr_song!=null? "rgb(255, 255, 255)" : "rgb(180, 120, 180)"}}
                    onClick={() => {if(curr_song!=null){loadTrack(trackIndex); playTrack();}}}>
                        <ReplayIcon
                        fontSize="large"
                        />
                    </Button>
              </div> 
            </Toolbar>
            <Toolbar className='playbar'>
                <Typography className="current-time"
                style={{marginRight:'10px'}}>{curTrackTimeDisplay}</Typography>
                <div>
                <input type="range" min="1" max="100"
                 className="seek_slider" 
                onChange={(e)=>{if(curr_song!=null)seekUpdate(e.target.value)}}
                onPointerUp={(e)=>{if(curr_song!=null)SlideDroped()}}/>
                </div>
                <Typography className="current-time"
                style={{marginLeft:'10px'}}>{curTrackDurationDisplay}</Typography>
            </Toolbar>
         </div>
       </AppBar>
    );
  }
  
  export default PlayBar;