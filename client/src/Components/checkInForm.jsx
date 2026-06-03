import { useState, useEffect } from "react";
import apiServerAxios from "../api/axios";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider,
  Container,
  CircularProgress,
  Fade,
  Grow,
  Divider,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import { formatISO, parseISO } from "date-fns";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SpaIcon from '@mui/icons-material/Spa';

function CheckInForm({ userId, update }) {
  const [checkInTime, setCheckInTime] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [notify, setNotify] = useState(false);
  const { checkInId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isSaveInProgress, setIsSaveInProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const token = localStorage.getItem("token");

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
      h1: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 800,
      },
      h2: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
      },
      h3: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
      },
      h4: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
      },
      h5: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
      },
      h6: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
      },
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

  useEffect(() => {
    if (update && checkInId) {
      setLoading(true);
      apiServerAxios
        .get(`/check-in/${checkInId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          const formattedCheckInTime = formatISO(parseISO(data.check_in_time), {
            representation: "date",
          });
          setCheckInTime(formattedCheckInTime.slice(0, 16));
          setFrequency(data.frequency);
          setNotify(data.notify);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch check-in details:", error);
          setLoading(false);
        });
    }
  }, [update, checkInId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaveInProgress(true);
    const selectedTime = new Date(checkInTime);
    const now = new Date();
    
    if (selectedTime <= now) {
      setSnackbar({
        open: true,
        message: "Cannot schedule check-in in the past. Please choose a future time.",
        severity: "error",
      });
      setIsSaveInProgress(false);
      return;
    }

    const url = update ? `/check-in/${checkInId}` : "/check-in/schedule";
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const method = update ? "patch" : "post";
    const data = {
      user_id: userId,
      check_in_time: checkInTime,
      frequency,
      notify,
    };
    
    try {
      const response = await apiServerAxios[method](url, data, config);
      setSnackbar({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      if (!update) {
        setCheckInTime("");
        setFrequency("daily");
        setNotify(false);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      const errorMessage = error.response?.data?.error || "An unexpected error occurred";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setIsSaveInProgress(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={60} sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(to bottom right, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
          py: 8,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            {/* Left Column - Form */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Paper
                  elevation={4}
                  sx={{
                    p: { xs: 3, sm: 4, md: 5 },
                    borderRadius: "20px",
                    background: theme.palette.background.paper,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header Section */}
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                      component="h1"
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <AccessAlarmIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />
                      {update ? "Update Your Check-In" : "Schedule a Check-In"}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: theme.palette.text.secondary,
                        mt: 1,
                      }}
                    >
                      {update ? "Modify your existing check-in" : "Set up regular emotional check-ins"}
                    </Typography>
                  </Box>

                  {/* Form Section */}
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      width: "100%",
                      mt: 2,
                    }}
                  >
                    {/* Time Selection */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <CalendarTodayIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Select Date & Time
                        </Typography>
                      </Box>
                      <TextField
                        id="datetime-local"
                        type="datetime-local"
                        fullWidth
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.palette.secondary.main,
                            },
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                        Choose when you'd like your first check-in reminder
                      </Typography>
                    </Box>

                    {/* Frequency Selection */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <AccessAlarmIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Frequency
                        </Typography>
                      </Box>
                      <FormControl fullWidth>
                        <Select
                          id="frequency"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          sx={{
                            borderRadius: "12px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.secondary.main,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.palette.secondary.main,
                            },
                          }}
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                        How often would you like to be checked in with?
                      </Typography>
                    </Box>

                    {/* Notification Toggle */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <NotificationsActiveIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Notification Preferences
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={notify}
                            onChange={(e) => setNotify(e.target.checked)}
                            sx={{
                              color: theme.palette.secondary.main,
                              "&.Mui-checked": {
                                color: theme.palette.secondary.main,
                              },
                            }}
                          />
                        }
                        label="Enable notifications"
                        sx={{ color: theme.palette.text.primary }}
                      />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                        Receive reminders for your check-ins
                      </Typography>
                    </Box>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2,
                        mb: 2,
                        py: 1.5,
                        borderRadius: "50px",
                        backgroundColor: theme.palette.secondary.main,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "1rem",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#FF8A65",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                        },
                        "&:disabled": {
                          backgroundColor: `${theme.palette.secondary.main}80`,
                        },
                      }}
                      disabled={isSaveInProgress}
                    >
                      {isSaveInProgress ? (
                        <CircularProgress size={24} sx={{ color: "#fff" }} />
                      ) : (
                        update ? "Update Check-In" : "Schedule Check-In"
                      )}
                    </Button>
                  </Box>
                </Paper>
              </Fade>
            </Grid>

            {/* Right Column - Benefits Information */}
            <Grid item xs={12} md={6}>
              <Grow in timeout={1200}>
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
                  {/* Main Benefits Card */}
                  <Paper
                    elevation={4}
                    sx={{
                      p: { xs: 3, sm: 4, md: 5 },
                      borderRadius: "20px",
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                      <PsychologyIcon sx={{ fontSize: 60, color: theme.palette.secondary.main, mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                        The Power of Regular Check-Ins
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                        Cultivating emotional awareness one step at a time
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                          <SelfImprovementIcon sx={{ color: theme.palette.secondary.main, mr: 2, fontSize: 40 }} />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              Self-Awareness
                            </Typography>
                            <Typography variant="body2">
                              Regular check-ins help you recognize patterns in your emotions and behaviors.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                          <SpaIcon sx={{ color: theme.palette.secondary.main, mr: 2, fontSize: 40 }} />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              Stress Reduction
                            </Typography>
                            <Typography variant="body2">
                              Taking time to reflect can lower stress levels and improve overall well-being.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                          <NotificationsActiveIcon sx={{ color: theme.palette.secondary.main, mr: 2, fontSize: 40 }} />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              Consistency
                            </Typography>
                            <Typography variant="body2">
                              Scheduled reminders help build healthy emotional habits over time.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                          <AccessAlarmIcon sx={{ color: theme.palette.secondary.main, mr: 2, fontSize: 40 }} />
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              Personal Growth
                            </Typography>
                            <Typography variant="body2">
                              Track your progress and celebrate small victories in your mental health journey.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Testimonial Card */}
                  <Paper
                    elevation={4}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      borderRadius: "20px",
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}>
                      What Our Users Say
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
                          "The regular check-ins have helped me become more aware of my emotional patterns. I can now recognize when I'm starting to feel overwhelmed."
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: "right" }}>
                          — Sarah J.
                        </Typography>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
                          "Setting up weekly check-ins was a game-changer for my mental health routine. The reminders keep me accountable."
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: "right" }}>
                          — Michael T.
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

CheckInForm.propTypes = {
  userId: PropTypes.string.isRequired,
  checkInId: PropTypes.string,
  update: PropTypes.bool.isRequired,
};

export default CheckInForm;