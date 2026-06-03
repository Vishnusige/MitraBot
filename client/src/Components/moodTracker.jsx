import { useState, useEffect } from "react";
import apiServerAxios from "../api/axios";
import {
  Box,
  Button,
  Container,
  createTheme,
  TextField,
  ThemeProvider,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Grow,
} from "@mui/material";
import MoodIcon from "@mui/icons-material/Mood";
import ListAltIcon from "@mui/icons-material/ListAlt";

function MoodTracker() {
  // Mood Logging State
  const [mood, setMood] = useState("");
  const [activities, setActivities] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Mood Logs State
  const [moodLogs, setMoodLogs] = useState([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

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

  const handleLogMood = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!mood || !activities) {
      setMessage("Both mood and activities are required.");
      return;
    }
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    setLoading(true);
    try {
      await apiServerAxios.post(
        "/user/log_mood",
        { mood, activities },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Mood logged successfully!");
      setMood("");
      setActivities("");
      fetchMoodLogs();
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoodLogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    setFetching(true);
    try {
      const response = await apiServerAxios.get("/user/get_mood_logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMoodLogs(response.data.mood_logs || []);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMoodLogs();
  }, []);

  const formatDateTime = (dateObject) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    try {
      const dateString = dateObject["$date"];
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          background: theme.palette.background.default,
          borderRadius: "20px",
          py: 4,
          px: { xs: 2, sm: 4 },
          my: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${theme.palette.secondary.main}30`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Header Section */}
          <Fade in timeout={800}>
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
                <MoodIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />
                Track Your Mood
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  mt: 1,
                }}
              >
                Record how you're feeling and what you're doing
              </Typography>
            </Box>
          </Fade>

          {/* Mood Logging Form */}
          <Fade in timeout={1000}>
            <Box
              component="form"
              onSubmit={handleLogMood}
              sx={{
                width: "100%",
                maxWidth: "600px",
                mt: 2,
                p: { xs: 2, sm: 4 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="mood-input"
                label="How are you feeling?"
                name="currentMood"
                autoComplete="off"
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={loading}
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
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="activities-input"
                label="What are you doing?"
                name="activities"
                autoComplete="off"
                type="text"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                disabled={loading}
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
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
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Log My Mood"
                )}
              </Button>
              {message && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    color: message.includes("success") 
                      ? "#43A047" // Success green
                      : "#E53935", // Error red
                  }}
                >
                  {message}
                </Typography>
              )}
            </Box>
          </Fade>

          {/* Mood Logs Section */}
          <Box sx={{ width: "100%", mt: 6 }}>
            <Typography
              variant="h4"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 4,
                color: theme.palette.text.primary,
                fontWeight: 600,
              }}
            >
              <ListAltIcon 
                sx={{ 
                  fontSize: 40, 
                  mr: 2, 
                  color: theme.palette.secondary.main 
                }} 
              />
              Your Mood History
            </Typography>

            {fetching ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "200px",
                }}
              >
                <CircularProgress size={60} sx={{ color: theme.palette.secondary.main }} />
              </Box>
            ) : error ? (
              <Typography
                color="error"
                variant="h6"
                sx={{ 
                  textAlign: "center", 
                  mt: 4,
                }}
              >
                {error}
              </Typography>
            ) : moodLogs.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 3,
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                }}
              >
                {moodLogs.map((log, index) => (
                  <Grow in timeout={800 + index * 100} key={index}>
                    <Card
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <MoodIcon
                            sx={{
                              color: theme.palette.secondary.main,
                              mr: 2,
                              fontSize: "2rem",
                            }}
                          />
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {log.mood}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 2,
                          }}
                        >
                          <strong>Activities:</strong> {log.activities}
                        </Typography>
                        <Divider 
                          sx={{ 
                            my: 2, 
                            borderColor: theme.palette.divider 
                          }} 
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {formatDateTime(log.timestamp)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                >
                  No mood logs found. Start tracking your mood!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default MoodTracker;