import { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import DeckIcon from "@mui/icons-material/Deck";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import PropTypes from "prop-types";
import { UserContext } from "./userContext";
import { NavLink, useLocation } from "react-router-dom";
import SelfImprovementOutlinedIcon from "@mui/icons-material/SelfImprovementOutlined";

function Sidebar({ setSidebarOpen }) {
  const { logout, user } = useContext(UserContext);
  const location = useLocation();

  // Theme with your landing page colors
  const theme = createTheme({
    palette: {
      primary: {
        main: "#6D4C41", // Warm brown
      },
      secondary: {
        main: "#FF9A76", // Coral accent
      },
      background: {
        default: "#FFF8F0", // Creamy off-white
        paper: "#FFEEDD", // Lighter cream
      },
      text: {
        primary: "#3E3E3E", // Dark gray
        secondary: "#5D5D5D", // Medium gray
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      button: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  const isActive = (path) => location.pathname === path;

  const items = [
    { text: "Mind Chat", icon: <DeckIcon />, path: "/" },
    ...(!user?.isAnon
      ? [
          {
            text: "Mood Tracking",
            icon: <ListAltIcon />,
            path: "/user/mood_tracking",
          },
          {
            text: "Schedule Check-In",
            icon: <ScheduleIcon />,
            path: "/user/check_in",
          },
          {
            text: "Check-In Reporting",
            icon: <EventAvailableIcon />,
            path: `/user/check_ins/${user?.userId}`,
          },
          {
            text: "Routines",
            icon: <SelfImprovementOutlinedIcon />,
            path: "/user/routines",
          },
          {
            text: "Chat Log Manager",
            icon: <ManageHistoryIcon />,
            path: "/user/chat_log_Manager",
          },
        ]
      : []),
  ];

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        sx={{
          width: { xl: "20%", md: "25%" },
          maxWidth: "270px",
          flexShrink: 0,
          mt: 8,
          "& .MuiDrawer-paper": {
            width: { md: "100%", sm: "50%" },
            maxWidth: "270px",
            position: "fixed",
            left: 0,
            top: { md: 55, xs: 50 },
            zIndex: 100,
            boxSizing: "border-box",
            height: "88vh",
            overflowX: "hidden",
            borderRadius: "0 16px 16px 0",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            ml: 0,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            minHeight: "100vh",
            borderRight: `1px solid ${theme.palette.secondary.main}30`,
            transition: "all 0.3s ease",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            width: "100%",
          }}
        >
          {items.map((item) => (
            <NavLink
              to={item.path}
              key={item.text}
              onClick={() => {
                if (window.innerWidth < 900) {
                  setSidebarOpen(false);
                }
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                sx={{
                  backgroundColor: isActive(item.path)
                    ? `${theme.palette.secondary.main}20`
                    : "inherit",
                  "&:hover": {
                    backgroundColor: `${theme.palette.secondary.main}20`,
                    transform: "translateX(4px)",
                  },
                  borderRadius: 3,
                  display: "flex",
                  transition: "all 0.3s ease",
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: isActive(item.path)
                      ? theme.palette.secondary.main
                      : theme.palette.text.primary,
                  }}
                />
              </ListItem>
            </NavLink>
          ))}
          <ListItem
            onClick={logout}
            sx={{
              backgroundColor: "inherit",
              "&:hover": {
                backgroundColor: `${theme.palette.secondary.main}20`,
                transform: "translateX(4px)",
              },
              cursor: "pointer",
              borderRadius: 3,
              transition: "all 0.3s ease",
              py: 1.5,
              mt: 1,
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
}

Sidebar.propTypes = {
  setSidebarOpen: PropTypes.func,
};

export default Sidebar;