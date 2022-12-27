import * as React from 'react';
import '../Styles/Main.css';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Featured from './Featured';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrowserRouter ,Route ,Routes, Navigate} from "react-router-dom";
import LoginForm from './LoginForm';
import ForYou from './ForYou';
import Charts from './Charts';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

const pages = [
  {
    id: 0,
    text: "Featured",
    path: ""
  },
  {
    id: 1,
    text: "For you",
    path: "foryou"
  },
  {
    id: 2,
    text: "Charts",
    path: "charts"
  }
]

function Main(){
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpenRight, setMobileOpenRight] = React.useState(null);
  const isMobileMenuOpenRight = Boolean(mobileOpenRight);

  const handleMobileMenuOpenRight = (event) => {
    setMobileOpenRight(event.currentTarget);
  };
  
  const handleMobileMenuCloseRight = () => {
    setMobileOpenRight(null);
  };

  const renderMobileMenuRight = (
    <Menu
        anchorEl={mobileOpenRight}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        keepMounted
        open={isMobileMenuOpenRight}
        onClose={handleMobileMenuCloseRight}
        >
        <MenuItem> 
            <IconButton
            size="large"
            >
            <Badge badgeContent={17} color="error">
                <NotificationsIcon/>
            </Badge>
            </IconButton>
            <p>Notifications</p>
        </MenuItem>
        <MenuItem>
            <IconButton
            size="large"
            >
            <AccountCircle />
            </IconButton>
            <p>Profile</p>
        </MenuItem>
      </Menu>
  );


  const [mobileOpenLeft, setMobileOpenLeft] = React.useState(null);
  const isMobileMenuOpenLeft = Boolean(mobileOpenLeft);

  const handleMobileMenuOpenLeft = (event) => {
    setMobileOpenLeft(event.currentTarget);
  };
  
  const handleMobileMenuCloseLeft = () => {
    setMobileOpenLeft(null);
  };

  const renderMobileMenuLeft = (
    <Menu
        anchorEl={mobileOpenLeft}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        keepMounted
        open={isMobileMenuOpenLeft}
        onClose={handleMobileMenuCloseLeft}
        >
          {pages.map((page) => (
                <MenuItem 
                  key={page.id}
                  onClick={() => navigate(page.path)}
                  className={location.pathname == "/Main" + page.path ? "active" 
                  :location.pathname == "/Main/" + page.path ? "active" : null}
                  >
                  <p>{page.text}</p>
                </MenuItem>
          ))}
      </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, width:"100%" }}>
      <AppBar 
       position="sticky" 
       sx={{backgroundColor: "rgb(161, 34, 161)", width:"100%"}}>
        <Toolbar>
          <Box sx={{ display: { sm: 'none', md: 'none' } }}>
              <IconButton
                size="large"
                edge="start"
                aria-label="open drawer"
                sx={{ mr: 2, 
                color:"rgb(15, 6, 26)"}}
                onClick={handleMobileMenuOpenLeft}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' },  
            fontWeight:"bold",
            fontFamily: "MV Boli" }}
          >
            Music
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, 
            color:"rgb(15, 6, 26)", 
            fontWeight:"bold",
            fontFamily: "MV Boli",
            marginRight:"1%" }}
          >
            Universe
          </Typography>
          {pages.map((page) => (
                <MenuItem 
                  key={page.id}
                  size="large"
                  onClick={() => navigate(page.path)}
                  className={location.pathname == "/Main" + page.path ? "active" 
                  :location.pathname == "/Main/" + page.path ? "active" : null}
                  sx={{ mr: 2, 
                  display: { xs: 'none', sm: 'block' }}}
                  >
                    <Typography 
                    textAlign="center"
                    variant="h6"
                    noWrap
                    sx={{ fontFamily: "MingLiU-ExtB",
                    fontWeight:"bold"
                  }}>{page.text}</Typography>
                </MenuItem>
          ))}
          <Search 
           sx={{color:"rgb(15, 6, 26)" }}>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              onClick={handleMobileMenuOpenRight}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenuLeft}
      {renderMobileMenuRight}
      <div className="divRoutes">
            <Routes>
                <Route path="" element={<Featured />} />
                <Route path="foryou" element={<ForYou />} />
                <Route path="charts" element={<Charts />} />
                <Route path="/*" element={<LoginForm />} />
            </Routes>
      </div>
    </Box>
  );
}

export default Main;