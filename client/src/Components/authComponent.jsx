import { useState, useContext } from "react";
import apiServerAxios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  CssBaseline,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  Box,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Typography,
  Tooltip,
  Container,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Fade,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Exact color palette from landing page
const colors = {
  lightBg: "#FFF8F0",
  lightSecondary: "#FFEEDD",
  lightAccent: "#FF9A76",
  darkPrimary: "#6D4C41",
  white: "#FFFFFF",
  black: "#3E3E3E",
  sectionBg: "#FFE5D4",
  darkSecondary: "#8D6E63",
  darkAccent: "#FFAB91"
};

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: colors.lightAccent,
            contrastText: colors.white
          },
          secondary: {
            main: colors.darkPrimary
          },
          background: {
            default: colors.lightBg,
            paper: colors.lightSecondary
          },
          text: {
            primary: colors.black,
            secondary: "#5D5D5D"
          },
          accent: {
            main: colors.lightAccent
          }
        }
      : {
          // Dark mode palette
          primary: {
            main: colors.darkAccent,
            contrastText: colors.darkPrimary
          },
          secondary: {
            main: "#D7CCC8"
          },
          background: {
            default: colors.darkPrimary,
            paper: colors.darkSecondary
          },
          text: {
            primary: "#FFEEDD",
            secondary: "#D7CCC8"
          },
          accent: {
            main: colors.darkAccent
          }
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "1rem"
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? colors.lightBg : colors.darkPrimary,
          color: mode === 'light' ? colors.black : "#FFEEDD",
          boxShadow: "none",
          borderBottom: mode === 'light' 
            ? `1px solid ${colors.lightAccent}80`
            : `1px solid ${colors.darkAccent}80`,
          transition: "all 0.5s ease"
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          padding: "8px 24px",
          transition: "all 0.3s ease",
          boxShadow: "none",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
          }
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: mode === 'light' ? "#FF8A65" : "#FFCCBC"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: "all 0.5s ease"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: mode === 'light' ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.3)"
            },
            "&:hover fieldset": {
              borderColor: mode === 'light' ? colors.lightAccent : colors.darkAccent
            }
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: mode === 'light' ? colors.lightAccent : colors.darkAccent,
          height: "3px"
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: mode === 'light' ? colors.black : "#FFEEDD",
          "&.Mui-selected": {
            color: mode === 'light' ? colors.lightAccent : colors.darkAccent,
            fontWeight: 600
          }
        }
      }
    }
  }
});

function TopBar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            color: theme.palette.text.primary
          }}
          onClick={() => navigate("/landing_page")}
        >
          Mitra
        </Typography>
        <IconButton onClick={toggleDarkMode} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

function AuthComponent() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme(getDesignTokens(darkMode ? 'dark' : 'light'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [placeOfResidence, setPlaceOfResidence] = useState("");
  const [fieldOfWork, setFieldOfWork] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  
  const mentalStressors = [
    { id: "job_search", name: "Stress from job search" },
    { id: "classwork", name: "Stress from classwork" },
    { id: "social_anxiety", name: "Social anxiety" },
    { id: "impostor_syndrome", name: "Impostor Syndrome" },
    { id: "career_drift", name: "Career Drift" }
  ];

  const [selectedStressors, setSelectedStressors] = useState([]);

  const handleStressorChange = (event) => {
    const value = event.target.value;
    setSelectedStressors(
      selectedStressors.includes(value)
        ? selectedStressors.filter((item) => item !== value)
        : [...selectedStressors, value]
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiServerAxios.post("/user/login", {
        username,
        password
      });
      if (response?.data) {
        localStorage.setItem("token", response.data.access_token);
        setMessage("Login successful!");
        setSeverity("success");
        setUser({ userId: response.data.userId });
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response?.data?.msg || "Login failed");
      setSeverity("error");
      setShowForgotPassword(true);
    }
    setOpen(true);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiServerAxios.post("/user/signup", {
        username,
        email,
        password,
        name,
        age,
        gender,
        placeOfResidence,
        fieldOfWork,
        mental_health_concerns: selectedStressors
      });
      if (response?.data) {
        localStorage.setItem("token", response.data.access_token);
        setMessage("Registration successful!");
        setSeverity("success");
        setUser({ userId: response.data.userId });
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed");
      setSeverity("error");
    }
    setLoading(false);
    setOpen(true);
  };

  const handleAnonymousSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiServerAxios.post("/user/anonymous_signin");
      if (response?.data) {
        localStorage.setItem("token", response.data.access_token);
        setMessage("Anonymous session started!");
        setSeverity("success");
        setUser({ userId: "0", isAnon: true });
        navigate("/");
      }
    } catch (error) {
      setMessage("Failed to start anonymous session");
      setSeverity("error");
    }
    setLoading(false);
    setOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const commonTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.mode === 'light' ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.3)"
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px"
      }
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
      "&.Mui-focused": {
        color: theme.palette.primary.main
      }
    },
    "& .MuiInputBase-input": {
      color: theme.palette.text.primary
    },
    marginBottom: "16px"
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 8,
          pb: 4,
          px: 2,
          transition: "all 0.5s ease"
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 6 },
                borderRadius: "16px",
                background: theme.palette.mode === 'light'
                  ? `rgba(255, 253, 250, 0.9)`
                  : `rgba(77, 60, 65, 0.9)`,
                backdropFilter: "blur(10px)",
                border: theme.palette.mode === 'light'
                  ? "1px solid rgba(255, 154, 118, 0.3)"
                  : "1px solid rgba(255, 171, 145, 0.3)",
                boxShadow: theme.palette.mode === 'light'
                  ? "0 8px 32px rgba(255, 154, 118, 0.2)"
                  : "0 8px 32px rgba(0, 0, 0, 0.3)"
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  mb: 3,
                  textAlign: "center",
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {activeTab === 0 ? "Welcome Back" : 
                 activeTab === 1 ? "Join Our Community" : "Anonymous Access"}
              </Typography>
              
              <Typography
                variant="subtitle1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  textAlign: "center",
                  maxWidth: "600px",
                  mx: "auto"
                }}
              >
                {activeTab === 0 ? "Sign in to continue your journey with Mitra" : 
                 activeTab === 1 ? "Create an account to get personalized support" : 
                 "Start chatting anonymously with no account needed"}
              </Typography>

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{
                  mb: 4,
                  "& .MuiTabs-flexContainer": {
                    justifyContent: "space-around"
                  }
                }}
              >
                <Tab
                  icon={<LockOutlinedIcon />}
                  label="Login"
                  sx={{ minHeight: "64px" }}
                />
                <Tab
                  icon={<PersonAddIcon />}
                  label="Sign Up"
                  sx={{ minHeight: "64px" }}
                />
                <Tab
                  icon={<VisibilityOffIcon />}
                  label="Anonymous"
                  sx={{ minHeight: "64px" }}
                />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <form onSubmit={handleLogin}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      sx={commonTextFieldStyles}
                    />
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            sx={{
                              color: theme.palette.text.secondary
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        )
                      }}
                      sx={commonTextFieldStyles}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{
                        mt: 2,
                        py: 1.5,
                        fontWeight: 600
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                    {showForgotPassword && (
                      <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ 
                          mt: 2, 
                          color: theme.palette.text.secondary 
                        }}
                      >
                        Forgot your password?{" "}
                        <Link
                          to="/request_reset"
                          style={{
                            textDecoration: "none",
                            color: theme.palette.primary.main,
                            fontWeight: 500
                          }}
                        >
                          Reset it here
                        </Link>
                      </Typography>
                    )}
                  </form>
                )}

                {activeTab === 1 && (
                  <form onSubmit={handleSignUp}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Username"
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email"
                          type="email"
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <IconButton
                                onClick={togglePasswordVisibility}
                                edge="end"
                                sx={{
                                  color: theme.palette.text.secondary
                                }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            )
                          }}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Full Name"
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Age"
                          type="number"
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          margin="normal"
                          required
                          sx={commonTextFieldStyles}
                        >
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={gender}
                            label="Gender"
                            onChange={(e) => setGender(e.target.value)}
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Place of Residence"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          value={placeOfResidence}
                          onChange={(e) => setPlaceOfResidence(e.target.value)}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Field of Work"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          value={fieldOfWork}
                          onChange={(e) => setFieldOfWork(e.target.value)}
                          sx={commonTextFieldStyles}
                        />
                      </Grid>
                    </Grid>

                    <Typography
                      variant="subtitle2"
                      sx={{
                        mt: 2,
                        mb: 1,
                        color: theme.palette.text.secondary
                      }}
                    >
                      Select any mental stressors you experience (optional):
                    </Typography>
                    
                    <FormGroup
                      sx={{
                        mb: 3,
                        "& .MuiFormControlLabel-root": {
                          alignItems: "flex-start",
                          mb: 1
                        }
                      }}
                    >
                      {mentalStressors.map((stressor) => (
                        <FormControlLabel
                          key={stressor.id}
                          control={
                            <Checkbox
                              checked={selectedStressors.includes(stressor.id)}
                              onChange={handleStressorChange}
                              value={stressor.id}
                              color="primary"
                            />
                          }
                          label={
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2">
                                {stressor.name}
                              </Typography>
                              <Tooltip
                                title={
                                  <Typography variant="body2">
                                    {getStressorDescription(stressor.id)}
                                  </Typography>
                                }
                                arrow
                              >
                                <InfoIcon
                                  sx={{
                                    ml: 1,
                                    fontSize: "1rem",
                                    color: theme.palette.text.secondary
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      sx={{
                        mt: 1,
                        py: 1.5,
                        fontWeight: 600
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: theme.palette.text.secondary,
                        textAlign: "center"
                      }}
                    >
                      Continue without creating an account. Your conversations will be private but not saved.
                    </Typography>
                    <form onSubmit={handleAnonymousSignIn}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{
                          py: 1.5,
                          fontWeight: 600
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Continue Anonymously"
                        )}
                      </Button>
                    </form>
                  </Box>
                )}
              </Box>
            </Paper>
          </Fade>
        </Container>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={severity}
            sx={{ width: "100%" }}
            elevation={6}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

function getStressorDescription(stressorId) {
  switch (stressorId) {
    case "job_search":
      return "Feelings of stress stemming from the job search process.";
    case "classwork":
      return "Stress related to managing coursework and academic responsibilities.";
    case "social_anxiety":
      return "Anxiety experienced during social interactions or in anticipation of social interactions.";
    case "impostor_syndrome":
      return "Persistent doubt concerning one's abilities or accomplishments coupled with a fear of being exposed as a fraud.";
    case "career_drift":
      return "Stress from uncertainty or dissatisfaction with one's career path or progress.";
    default:
      return "No description available.";
  }
}

export default AuthComponent;