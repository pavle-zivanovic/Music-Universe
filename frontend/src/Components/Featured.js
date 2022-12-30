import * as React from 'react';
import '../Styles/Featured.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const songs = ['harem', 'pesma2', 'pesma3', 'pesma4', 'pesma5', 
'pesma6', 'pesma7', 'pesma8', 'pesma9', 'pesma10',
'pesma11', 'pesma12', 'pesma13', 'pesma14', 'pesma15',
'pesma16', 'pesma17', 'pesma18', 'pesma19', 'pesma20',
'pesma21', 'pesma22', 'pesma23', 'pesma24', 'pesma25',
'pesma26', 'pesma27', 'pesma28', 'pesma29', 'pesma30'];

function Featured(){

    return(
        <Box sx={{ flexGrow: 1,
                width:"89%", 
                position:"relative",
                left:"7%",
                marginBottom:"2%" }}>
            <Grid container spacing={2}>
                {songs.map((song) => (
                    <Grid key={song} 
                    xs={4} sm={3} md={2}>
                        <IconButton onClick={() => {alert("Klikić");}}>
                            <Tooltip title="Maya Berovic"
                                    placement="top">
                                <div className="songCircle"
                                style={{backgroundImage:'url("../Images/maya.jpg")'}}>
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
                            {song}
                        </div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Featured;