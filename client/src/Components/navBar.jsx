import { useContext, useState, useEffect } from "react";
import apiServerAxios from "../api/axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { alpha } from "@mui/material/styles";

import { UserContext } from "./userContext";

function Navbar({ toggleSidebar, toggleColorMode }) {
  const {
    incrementNotificationCount,
    notifications,
    addNotification,
    removeNotification,
    darkMode,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const token = localStorage.getItem("token");
  const userId = user?.userId;
  const theme = useTheme();

  // All existing useEffect hooks remain the same
  useEffect(() => {
    if (userId) {
      fetchMissedCheckIns();
    } else {
      console.error("No user ID available from URL parameters.");
    }
  }, [userId]);

  const fetchMissedCheckIns = async () => {
    if (!userId) {
      console.error("User ID is missing in context");
      return;
    }
    try {
      const response = await apiServerAxios.get(
        `/check-in/missed?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const missedCheckIns = response.data;
      if (missedCheckIns.length > 0) {
        missedCheckIns.forEach((checkIn) => {
          addNotification({
            title: `Missed Check-in on ${new Date(
              checkIn.check_in_time
            ).toLocaleString()}`,
            message: "Please complete your check-in.",
          });
        });
      } else {
        addNotification({
          title: "You have no missed check-ins.",
          message: "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch missed check-ins:", error);
      addNotification({
        title:
          "Failed to fetch missed check-ins. Please check the console for more details.",
        message: "",
      });
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (index) => {
    setAnchorEl(null);
    if (index !== null) {
      removeNotification(index);
    }
  };

  const handleProfileClick = () => {
    if (user && user.userId) {
      navigate(`/user/profile/${user.userId}`);
    } else {
      console.error("User ID not found");
    }
  };

  useEffect(() => {
    const handleServiceWorkerMessage = (event) => {
      if (event.data && event.data.msg === "updateCount") {
        console.log("Received message from service worker:", event.data);
        addNotification({
          title: event.data.title,
          message: event.data.body,
        });
        incrementNotificationCount();
      }
    };

    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#6D4C41' : '#FFF8F0',
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={toggleSidebar}
          color="inherit"
          edge="start"
          sx={{ marginRight: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
          }}
        >
          Dashboard
        </Typography>

        {/* Theme Toggle Button */}
        <IconButton 
          onClick={toggleColorMode} 
          color="inherit"
          sx={{ mr: 1 }}
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {!user?.isAnon && (
          <IconButton 
            color="inherit" 
            onClick={handleNotificationClick}
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <Badge 
              badgeContent={notifications.length} 
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.primary.main,
                }
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose(null)}
          PaperProps={{
            elevation: 3,
            sx: {
              maxHeight: 400,
              width: { xs: 250, sm: 400 },
              padding: 1,
              backgroundColor: theme.palette.mode === 'dark' ? '#8D6E63' : '#FFEEDD',
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem
                key={index}
                onClick={() => handleClose(index)}
                sx={{
                  whiteSpace: "normal",
                  padding: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                    padding: "8px 12px",
                    backgroundColor: theme.palette.mode === 'dark' ? '#6D4C41' : '#FFF8F0',
                    borderRadius: '8px',
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <CancelIcon 
                    sx={{ 
                      marginRight: 2,
                      color: theme.palette.error.main 
                    }} 
                  />
                  <CardContent sx={{ padding: "0 !important" }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                        marginBottom: 0.5,
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {notification.message}
                    </Typography>
                  </CardContent>
                </Card>
              </MenuItem>
            ))
          ) : (
            <Typography
              variant="h6"
              onClick={() => handleClose(0)}
              sx={{
                whiteSpace: "normal",
                padding: 2,
                textAlign: "center",
                fontSize: { xs: "14px", sm: "18px" },
                fontWeight: 600,
                color: theme.palette.text.secondary,
              }}
            >
              You have no notifications
            </Typography>
          )}
        </Menu>

        {!user?.isAnon && (
          <IconButton 
            color="inherit" 
            onClick={handleProfileClick}
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <AccountCircle />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  toggleSidebar: PropTypes.func,
  toggleColorMode: PropTypes.func,
};

export default Navbar;