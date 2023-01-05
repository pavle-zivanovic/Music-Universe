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

function PlayBar(){

    const [curTrackTime, setCurTrackTime] = React.useState(0)
    const [firstRender, setFirstRender] = React.useState(true)
    const [curTrackTimeDisplay, setCurTrackTimeDisplay] = React.useState("00.00")
    const [curTrackDurationDisplay, setCurTrackDurationDisplay] = React.useState("00.00")
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [trackIndex, setTrackIndex] = React.useState(0)
    let updateTimer
    const [curr_track, setCurTrack] = React.useState(document.createElement('audio'))
    const [isSliding, setIsSliding] = React.useState(false)
    const [timerTrigger, setTimerTrigger] = React.useState(false)

    React.useEffect(() => {
      if(firstRender)
      {
        document.getElementsByClassName("seek_slider")[0].value = 0
        setFirstRender(false)
        return
      }
      console.log(trackIndex)
      loadTrack(trackIndex, true);
    }, [trackIndex]);


    React.useEffect(() => {
      if(timerTrigger===true)
      {
        if(!isSliding)
          seekUpdate()
        setTimerTrigger(false)
      }
    }, [timerTrigger]);
    
    let track_list = [
        {
            name: "Alkohol",
            artist: "Maya Berovic",
            image: 'url("../Images/maya.jpg")',
            path: "../Music/Hint.wav",
        },
        {
            name: "Neka stvar",
            artist: "Maya Berovic",
            image: 'url("../Images/maya.jpg")',
            path: "../Music/LevelSelect.wav",
        },
        {
          name: "Harem",
          artist: "Maya Berovic",
          image: 'url("../Images/maya.jpg")',
          path: "../Music/NextLevel.wav",
        },
        {
          name: "Hurem",
          artist: "Maya Berovic",
          image: 'url("../Images/maya.jpg")',
          path: "../Music/NextLevel.wav",
        },
      ];

      function loadTrack(track_index, toPlay=false) {
        clearInterval(updateTimer);
        resetValues();
       
        curr_track.src = track_list[track_index].path;
        curr_track.load();
       
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
        setCurTrackTime(0)
        setCurTrackTimeDisplay("00.00");
        setCurTrackDurationDisplay("00.00");
      }

      function nextTrack() {
        if(trackIndex===track_list.length-2)
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

    return (
        <AppBar 
        position="sticky" 
        sx={{bottom:'0',backgroundColor: "rgb(161, 34, 161)", width:"100%", display:'flex', flexDirection:'row'}}>
          <div style={{display:'flex',flexDirection: 'column'}}>
            <Icon
            className='Vinyl'
            style={{marginLeft:'10px', marginTop:'10px' ,backgroundImage:'url("../Images/vinyl.jpg")',maxWidth:'200px', maxHeight:'160px', width:'20vw', height:'16vw'}}>
              <div className="songCirclePlayBar"
              style={{animationName:isPlaying?'rotate':'',background: track_list[trackIndex].image, width:'60%',backgroundSize:'cover', height:'75%', margin:'10% 10% 10% 11%'}}>
                  <div className="innerSongCircleBlack"></div>
              </div>
            </Icon>
            {false?
            <div style={{display:'flex',flexDirection: 'column'}}>
            <Typography style={{margin:'10px 10px 0px 10px', textAlign:'right'}}>{track_list[trackIndex].name}</Typography>
            <Typography style={{margin:'0px 10px 10px 10px', fontWeight:'bold', textAlign:'right', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}>{track_list[trackIndex].artist}</Typography>
            </div>:null}
          </div>
          {true? <div style={{display:'flex',flexDirection: 'column', alignSelf:'end'}}>
            <Typography style={{margin:'10px 10px 0px 10px', textAlign:'left'}}>{track_list[trackIndex].name}</Typography>
            <Typography style={{margin:'0px 10px 10px 10px', fontWeight:'bold', textAlign:'left', display:'inline-block', whiteSpace:'nowrap', clear:'both', overflow:'hidden'}}>{track_list[trackIndex].artist}</Typography>
          </div> : null}
          <div style={{width:'80%', marginTop:'50px'}}>
            <Toolbar className='playbar'>
                <div
                style={{whiteSpace:'nowrap'}}>
                    <Button sx={{ mr: 2, 
                    color:"rgb(255, 255, 255)"}}
                    onClick={() => {prevTrack();}}>
                        <SkipPreviousIcon
                            fontSize="large"
                            />
                    </Button>
                    <Button sx={{ mr: 2, 
                    color:"rgb(255, 255, 255)"}}
                    onClick={() => {playpauseTrack();}}>
                      {isPlaying?<PauseCircleFilledIcon
                        fontSize="large"
                        />:<PlayCircleFilledIcon
                        fontSize="large"
                        />}
                    </Button>
                    <Button sx={{ mr: 2, 
                    color:"rgb(255, 255, 255)"}}
                    onClick={() => {nextTrack();}}>
                        <SkipNextIcon
                        fontSize="large"
                        />
                    </Button>
                    <Button sx={{ mr: 2, 
                    color:"rgb(255, 255, 255)"}}
                    onClick={() => {loadTrack(trackIndex); playTrack();}}>
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
                onChange={(e)=>seekUpdate(e.target.value)}
                onPointerUp={(e)=>SlideDroped()}/>
                </div>
                <Typography className="current-time"
                style={{marginLeft:'10px'}}>{curTrackDurationDisplay}</Typography>
            </Toolbar>
         </div>
       </AppBar>
    );
  }
  
  export default PlayBar;