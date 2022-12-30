import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import '../Styles/SongView.css';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const song = 
{
    singerName: "Maya Berovic",
    album: "Viktorijina tajna",
    singerImage: "../Images/maya.jpg",
    lyrics:
    `Plešem sa tobom a. 
    Preko tvoga ramena ga gledam.
    Andjeo ili vrag.
    Ko sam više i ne znam.
    A to ludilo me ubilo.
    A ta magija me napila.
    U meni sve si ubio.
    A toliko sam srca ranila.
    A toliko sam srca ranila.
    A toliko sam srca ranila.
    A toliko sam srca ranila.
    A toliko sam srca ranila.
    U okove me stave.
    Svaki put kad mi jave.
    Da lomiš klubove.
    Oko tebe harem bacaš pare.
    Grliš stare drugove.
    U okove me stave.
    Svaki put kad mi jave.
    Da lomiš klubove.
    Oko tebe harem bacaš pare.
    Grliš stare drugove.
    I grešim opet al znam.
    Da ćeš glave mi doći.
    Crna duša crn si sav.
    Oči crne kao noći.
    Od takvih glava me zaboli.
    Takve ljubiti je zločin.
    A takvi ljube najbolje.
    Oni glave će mi doći.
    U okove me stave.
    Svaki put kad mi jave.
    Da lomiš klubove.
    Oko tebe harem bacaš pare.
    Grliš stare drugove.
    U okove me stave.
    Svaki put kad mi jave.
    Da lomiš klubove.
    Oko tebe harem bacaš pare.
    Grliš stare drugove.
    U okove me stave.
    Svaki put kad mi jave.
    Da lomiš klubove.
    Oko tebe harem bacaš pare.
    Grliš stare drugove.
    U okove me stave.
    Svaki put kad mi jave.
    Da lomiš klubove.
    Oko tebe harem bacaš pare.
    Grliš stare drugove`
}

const lyrics = song.lyrics.split(".");

function SongView(){

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
                             style={{backgroundImage:'url('+song.singerImage+')'}}>

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
                                            {song.album}
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
                                {lyrics.map(item => (
                                    <ListItem
                                     sx={{height:"30px"}}
                                     key={item}
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