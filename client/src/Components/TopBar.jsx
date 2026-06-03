import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const TopBar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{ 
        backgroundColor: "transparent", 
        boxShadow: "none",
        color: darkMode ? "#FFEEDD" : "#3E3E3E",
      }}
    >
      <Toolbar sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 0, sm: 2 },
        py: 2
      }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate("/landing_page")}
        >
          Mitra
        </Typography>

        {/* Navigation and Theme Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, mr: 2 }}>
            <Button
              sx={{ 
                color: 'inherit',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: darkMode ? "#FFAB91" : "#FF9A76",
                  backgroundColor: 'transparent'
                }
              }}
              onClick={() => navigate("/about")}
            >
              About
            </Button>
            <Button
              sx={{ 
                color: 'inherit',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  color: darkMode ? "#FFAB91" : "#FF9A76",
                  backgroundColor: 'transparent'
                }
              }}
              onClick={() => navigate("/faq")}
            >
              FAQ
            </Button>
          </Box>

          {/* Theme Toggle */}
          <IconButton 
            onClick={toggleDarkMode} 
            color="inherit"
            sx={{ 
              '&:hover': {
                color: darkMode ? "#FFAB91" : "#FF9A76",
                backgroundColor: 'transparent'
              }
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;