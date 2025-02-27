import  Products  from './Products';
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import './dashboard.css'
import React,{ useState,useEffect, useContext } from "react";
import { Axios } from "../../api/axios";
import { user } from "../../api/api";
import './dashboardcomp/dashboardcomp.css'
import { extendTheme, styled } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Avatar, Button, Card, CardContent, Typography,CardActions, Drawer, List, ListSubheader, ListItemButton, ListItemAvatar, ListItemText, Badge, TextField, BottomNavigation, BottomNavigationAction, IconButton, Box, CardMedia, CircularProgress, Alert } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import Cookie from 'cookie-universal'
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import { Padding } from "@mui/icons-material";
import Loading from "../loading/loading";
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfiniteScroll from 'react-infinite-scroll-component';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// ...other imports...
import MenuIcon from '@mui/icons-material/Menu';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import { Account } from '@toolpad/core/Account';
import LazyLoad from 'react-lazyload';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fab from '@mui/material/Fab';
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";
import drawerlist from "./drawerlist";
export default function Dashboard(){
    const [u,setu]=useState("");
    const cookie = Cookie()
    const navigate = useNavigate();
    const [loading,setloading]=useState(true);
      const [products, setProducts] = useState([]);
      const [submitted,setsubmitted]=useState(false);
      const [error,seterror]=useState(false);
      const drawerWidth = 200;
      const [query, setQuery] = useState("");
      const [filtredProducts, setFilteredProducts] = useState([]);
      const [mobileOpen, setMobileOpen] = React.useState(false);
      const [isClosing, setIsClosing] = React.useState(false);
      const [value, setValue] = useState(0);
      const [session, setSession] = React.useState({  user: {
        name: "",
        email: '',
        image: '',
      },})
    const handleSearch = (e) => {
      const value = e.target.value.toLowerCase();
      setQuery(value);
      if(value==''){
        setFilteredProducts(products)
      }else{
   
        setFilteredProducts(
        products.filter((p) => p.name.toLowerCase().includes(value))
      );}
    };
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };
useEffect(()=>{

  authentication.signIn();
},[]);
  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
    
        
          try {
            Axios.get('/auth/'+user).then(d=>{
              setu(d.data);
              console.log(d.data)
              setSession({
                user: {
                  name: d.data.name,
                  email:d.data.principal.user.email,
                  image: '',
                },
              })
              setloading(false)
  
              
           })}catch(e){}
  
        
      },
      signOut: () => {
        try {
          Axios.get('/auth/logout').then(d=>{
            cookie.remove('token');
           navigate('/')
            setloading(false)

            
         })}catch(e){}
       
      },
    };
  }, [u]);
 

    const scrollToTop = () => {
      const scrollDiv = document.getElementById('scrollableDiv');
      if (scrollDiv) {
        scrollDiv.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

  
    return(<div style={{display:'flex'
                       ,flexFlow:'row'
                       ,height:'100%',
                       padding:"10px",
                       justifyContent:"space-between", }}>
      <div className="brands">
        <IconButton   sx={{
                        display: { xs: '', sm: 'none' },}} 
                      onClick={()=>setMobileOpen(true)}>
                      <MenuIcon />
        </IconButton>
           {/* phone drawer */}
      <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 230,paddingRight:1 },
          }}
        >
   <div style={{display:'flex',flexFlow:'column',gap:'0px',alignItems:'center',justifyContent:'center'}}>
       
     {drawerlist}

     </div>
   {/* desktop drawer */}
          
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 230,position:'relative' },height:'110%',paddingRight:1
          }}
          open
        >

 
          <div style={{display:'flex',flexFlow:'column',gap:'0px',alignItems:'center',justifyContent:'center'}}>
      {drawerlist}

          </div>

        </Drawer>

      </div>
<div className="content"
     style={{display:'flex'
            ,flexFlow:'column'
            ,gap:'20px',
             width:'100%'
            ,alignItems:'center',
             overflow:"hidden"}}>
<Alert style={{position:"absolute",top:15,display:!submitted?"none":"block",zIndex:5,width:150}} severity="success">Saved</Alert>
<Alert style={{position:"absolute",top:15,display:!error?"none":"block",zIndex:5,width:150}} severity="error">  Already Liked</Alert>
<TextField
            variant="outlined"
            placeholder="Search..."
            value={query}
            size="small"
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            
          />
          <Outlet />
{/* Floating button to scroll to top */}
<Fab size="small" onClick={scrollToTop} sx={{ position: 'fixed', bottom: 80, right: 20 }}>
  <KeyboardArrowUpIcon />
</Fab>
      
<BottomNavigation
  showLabels
  value={value}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
  sx={{position:"fixed",
  bottom:10,
  borderRadius:'20px'
  ,width:'60%'
  ,justifySelf:"end" ,
backgroundColor:"#2c2c2c"}}
  style={{boxShadow:"0px 0px 10px 0px #0000001a"}}
>
 <Link to="/products" ><BottomNavigationAction sx={{borderRadius:"20px 0 0 20px"}}  label="Saved"  icon={<RestoreIcon />} /></Link>
 <Link to="/saved" >  <BottomNavigationAction label="Saved" icon={<FavoriteIcon />} /></Link>
 <Link to="/profile" >   <BottomNavigationAction  sx={{borderRadius:"0px 20px 20px 0px"}} label="Settings" icon={<LocationOnIcon />} /></Link>
</BottomNavigation>

</div>
<Box className="settings" style={{display:"flex",justifyContent:"end",flexGrow:1}} >

     
        <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>
        {/* preview-start */}
        <Account />
        {/* preview-end */}
      </SessionContext.Provider>
    </AuthenticationContext.Provider>
  

  
</Box>


       
       
      
 
         </div>)
}
