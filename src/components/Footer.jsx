import { AppBar, Toolbar, Typography,  Container } from "@mui/material";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import PinDropIcon from '@mui/icons-material/PinDrop';

function Footer() {
  return (
    <AppBar
      position="static"
      sx={{ top: "auto", bottom: 0, bgcolor: "#d47a33", pb: 3, pt: 3 }}
    >
      <Container maxWidth="lg">
    
        <Toolbar sx={{display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        
         
            <Typography variant="body2" color="inherit"  sx={{
        display: 'flex',          
        alignItems: 'center',     
        gap: 1                    
      }}>
           <PinDropIcon/>  Ehlibeyt Mah. 9845. Cadde 
            </Typography>
            <Typography variant="body2" color="inherit"   sx={{
        display: 'flex',          
        alignItems: 'center',     
        gap: 1                    
      }}>
            <LocalPhoneIcon   />  0314 895 78 98
            </Typography>
            <Typography variant="body2" color="inherit" sx={{
        display: 'flex',          
        alignItems: 'center',     
        gap: 1                    
      }}>
               <MarkunreadIcon /> drmdmf@gmail.com
            </Typography>
            <Typography variant="body2" color="inherit" align="center">
              © {new Date().getFullYear()} Your Library. All rights reserved.
            </Typography>
       
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Footer;
