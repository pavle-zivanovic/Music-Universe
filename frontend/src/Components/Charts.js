import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { /*CardMedia,*/ Typography } from '@mui/material';
//import Card from '@mui/material/Card';
//import { CardContent, CardMedia, CssBaseline } from '@material-ui/core';
//import Typography from '@mui/material/Typography';
//import '../Styles/Charts.css';
//import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  function Charts(){

    return(
        <main>
            <div >
           <Container maxWidth="md" 
                      style={{color:"black",
                            position:"static",
                            justify:"center"
                            }}>
                <div>
                    <Grid   container 
                            spacing={4}
                            marginTop="13%"
                            marginBottom="13%"
                            alignItems="stretch"
                            justify="center"
                            direction="column" 
                            style={{ backgroundColor:"whitesmoke" }}>
                        <Grid item style={{ backgroundColor:"darkorchid" }}>
                            <Typography variant="h3" color="textPrimary" gutterBottom>
                                Top charts
                            </Typography>
                        </Grid>
                        <Grid item style={{ backgroundColor:"purple" }} >
                            <Stack direction="row" spacing={4}  alignItems="center">
                                <Typography variant="h5" > #01 </Typography>
                                <Img alt="maya" src="../Images/maya.jpg" />
                                <Typography gutterBottom variant="subtitle1" component="div">
                                Honey
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Maya Berović
                                </Typography>
                            </Stack>
                            
                            
                            
                        </Grid>
                        <Grid item style={{ backgroundColor:"darkorchid" }}>
                        <Stack direction="row" spacing={4}  alignItems="center">
                                <Typography variant="h5" > #02 </Typography>
                                <Img alt="maya" src="../Images/maya.jpg" />
                                <Typography gutterBottom variant="subtitle1" component="div">
                                Breme
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Maya Berović
                                </Typography>
                            </Stack>
                        
                        </Grid>
                        <Grid item style={{ backgroundColor:"purple" }}>
                        <Stack direction="row" spacing={4}  alignItems="center">
                                <Typography variant="h5" > #03 </Typography>
                                <Img alt="maya" src="../Images/maya.jpg" />
                                <Typography gutterBottom variant="subtitle1" component="div">
                                Harem
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Maya Berović
                                </Typography>
                            </Stack>
                            
                        </Grid>
                        <Grid item style={{ backgroundColor:"darkorchid" }}>
                        <Stack direction="row" spacing={4}  alignItems="center">
                                <Typography variant="h5" > #04 </Typography>
                                <Img alt="maya" src="../Images/maya.jpg" />
                                <Typography gutterBottom variant="subtitle1" component="div">
                                Dilajla
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Maya Berović
                                </Typography>
                            </Stack>
                            
                        </Grid>
                        <Grid item style={{ backgroundColor:"purple" }}>
                        <Stack direction="row" spacing={4}  alignItems="center">
                                <Typography variant="h5" > #05 </Typography>
                                <Img alt="maya" src="../Images/maya.jpg" />
                                <Typography gutterBottom variant="subtitle1" component="div">
                                La la la 
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                Maya Berović
                                </Typography>
                            </Stack>
                            
                        </Grid>
                    </Grid>
                </div>
           </Container>
           </div>
        </main>
       
    );
}

export default Charts;