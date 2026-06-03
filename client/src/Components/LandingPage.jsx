import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Support from '@mui/icons-material/Support';
import Lock from '@mui/icons-material/Lock';
import Psychology from '@mui/icons-material/Psychology';
import AccessAlarm from '@mui/icons-material/AccessAlarm';
import {
  Typography,
  Button,
  Grid,
  Container,
  Box,
  Card,
  CardContent,
  Paper,
  Fade,
  Grow,
} from "@mui/material";
import TopBar from "./TopBar.jsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeChat, setActiveChat] = useState(0);

  // Auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChat((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Warm Color Palette
  const colors = {
    lightBg: "#FFF8F0",
    lightSecondary: "#FFEEDD",
    lightAccent: "#FF9A76",
    darkPrimary: "#6D4C41",
    white: "#FFFFFF",
    black: "#3E3E3E",
  };

  // Theme settings
  const theme = {
    bg: darkMode ? colors.darkPrimary : colors.lightBg,
    text: darkMode ? "#FFEEDD" : colors.black,
    secondaryText: darkMode ? "#D7CCC8" : "#5D5D5D",
    cardBg: darkMode ? "#8D6E63" : colors.lightSecondary,
    accent: darkMode ? "#FFAB91" : colors.lightAccent,
    sectionBg: darkMode ? "#4E342E" : "#FFE5D4",
  };

  return (
    <Box
      sx={{
        background: theme.bg,
        minHeight: "100vh",
        transition: "all 0.5s ease",
        overflowX: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <TopBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* HERO SECTION */}
      <Container maxWidth="md" sx={{ mt: { xs: 6, sm: 8 }, mb: 6 }}>
        <Fade in timeout={1000}>
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: theme.text,
                  textAlign: "center",
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.5px",
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif", // Modern, clean heading font
                }}
              >
                Mitra – Your Empathetic AI Companion
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: theme.secondaryText,
                  textAlign: "center",
                  mt: 2,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  maxWidth: "600px",
                  mx: "auto",
                  fontFamily: "'Inter', sans-serif", // Clean, readable body font
                  fontWeight: 400,
                }}
              >
                💛 Accessible • Compassionate • Always Here to Listen
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
              <Grow in timeout={1500}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    px: 6,
                    py: 1.5,
                    backgroundColor: theme.accent,
                    color: darkMode ? colors.darkPrimary : colors.white,
                    fontWeight: 600,
                    borderRadius: "50px",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    fontFamily: "'Inter', sans-serif",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                      backgroundColor: darkMode ? "#FFCCBC" : "#FF8A65",
                    },
                  }}
                >
                  🌟 Get Started
                </Button>
              </Grow>
            </Grid>
          </Grid>
        </Fade>
      </Container>

      {/* DEMO CHAT PREVIEW */}
<Box
  sx={{
    backgroundColor: theme.sectionBg,
    py: 8,
    transition: "all 0.5s ease",
    borderTop: `1px solid ${theme.accent}80`,
    borderBottom: `1px solid ${theme.accent}80`,
  }}
>
  <Container maxWidth="sm">
    <Fade in timeout={800}>
      <Box>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 5,
            fontWeight: 700,
            color: theme.text,
            fontFamily: "'Poppins', sans-serif",
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: theme.accent,
              margin: '12px auto 0',
              borderRadius: '2px'
            }
          }}
        >
          Try a Demo Chat
        </Typography>

        {/* Chat Slideshow Container */}
        <Box sx={{ 
          position: 'relative', 
          minHeight: '220px',
          mb: 4
        }}>
          {/* Chat bubbles with 3D effect */}
          {[
            {
              user: "I feel overwhelmed and alone...",
              mitra: "I'm here for you. Let's explore what's on your mind together. 💬",
              userColor: darkMode ? "#FF9A76" : "#E53935",
              mitraColor: darkMode ? "#A5D6A7" : "#43A047"
            },
            {
              user: "I can't sleep at night",
              mitra: "I understand. Would you like to try a guided relaxation exercise? 🌙",
              userColor: darkMode ? "#FFAB91" : "#D81B60",
              mitraColor: darkMode ? "#80CBC4" : "#00897B"
            },
            {
              user: "Work is so stressful right now",
              mitra: "Let's break this down together. What's most concerning you? 💼",
              userColor: darkMode ? "#CE93D8" : "#8E24AA",
              mitraColor: darkMode ? "#81D4FA" : "#039BE5"
            }
          ].map((chat, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: '100%',
                opacity: activeChat === index ? 1 : 0,
                zIndex: activeChat === index ? 1 : 0,
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transform: activeChat === index ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {/* User message bubble */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mb: 2
              }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    backgroundColor: darkMode ? '#424242' : '#FFF8F0',
                    border: `1px solid ${theme.accent}30`,
                    borderRadius: '18px 18px 4px 18px',
                    boxShadow: `0 3px 10px ${darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: chat.userColor,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {chat.user}
                  </Typography>
                </Paper>
              </Box>

              {/* Mitra response bubble */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    backgroundColor: darkMode ? '#57648C' : '#FFEEDD',
                    border: `1px solid ${theme.accent}30`,
                    borderRadius: '18px 18px 18px 4px',
                    boxShadow: `0 3px 10px ${darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: chat.mitraColor,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {chat.mitra}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Enhanced Navigation Dots */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1.5,
          mt: 4
        }}>
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              onClick={() => setActiveChat(index)}
              sx={{
                width: activeChat === index ? 24 : 12,
                height: 12,
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: activeChat === index ? 
                  theme.accent : 
                  (darkMode ? '#757575' : '#BDBDBD'),
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.accent,
                  transform: 'scale(1.1)'
                }
              }}
            />
          ))}
        </Box>

      
      </Box>
    </Fade>
  </Container>
</Box>
{/* WHY CHOOSE MITRA */}
<Container maxWidth="lg" sx={{ my: 8 }}>
  <Fade in timeout={1400}>
    <Box>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: theme.text,
          mb: 6,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Why Choose Mitra?
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {[
          {
            title: "Empathetic Conversations",
            description: "Like talking to a caring friend who never judges.",
            icon: <Support sx={{ fontSize: 48, color: theme.accent }} />,
          },
          {
            title: "100% Anonymous",
            description: "Your secrets are safe with us.",
            icon: <Lock sx={{ fontSize: 48, color: theme.accent }} />,
          },
          {
            title: "Emotion-Aware AI",
            description: "Adapts to your mood in real-time.",
            icon: <Psychology sx={{ fontSize: 48, color: theme.accent }} />,
          },
          {
            title: "Routine Check-ins",
            description: "Gentle nudges to keep you grounded.",
            icon: <AccessAlarm sx={{ fontSize: 48, color: theme.accent }} />,
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Grow in timeout={1000 + index * 200}>
              <Card
                sx={{
                  backgroundColor: theme.cardBg,
                  borderRadius: "20px",
                  height: "100%",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: theme.accent,
                      mb: 2,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.secondaryText,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Fade>
</Container>

      {/* CTA SECTION */}
<Container maxWidth="md" sx={{ my: 12 }}>
  <Fade in timeout={1000}>
    <Box
      sx={{
        background: darkMode 
          ? `linear-gradient(135deg, ${theme.accent}, #6D4C41)`
          : `linear-gradient(135deg, ${theme.accent}, #FF7043)`,
        p: { xs: 3, sm: 5 },
        borderRadius: "24px",
        textAlign: "center",
        boxShadow: darkMode 
          ? "0 8px 32px rgba(255, 154, 118, 0.2)"
          : "0 8px 32px rgba(255, 112, 67, 0.3)",
        border: `1px solid ${theme.accent}40`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          animation: 'rotate 20s linear infinite',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }
      }}
    >
      <Box position="relative" zIndex={1}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            color: colors.white,
            fontFamily: "'Poppins', sans-serif",
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: { xs: '1.8rem', sm: '2.2rem' }
          }}
        >
          You're Not Alone – We're Here 🌻
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: darkMode ? "#FFEEDD" : "#FFF8F0",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            maxWidth: '600px',
            mx: 'auto',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Start your journey toward emotional well-being today.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            px: 6,
            py: 1.5,
            backgroundColor: colors.white,
            color: darkMode ? colors.darkPrimary : "#E64A19",
            fontWeight: 600,
            borderRadius: "50px",
            textTransform: "none",
            fontSize: "1.1rem",
            boxShadow: darkMode 
              ? "0 4px 14px rgba(0, 0, 0, 0.3)"
              : "0 4px 14px rgba(0, 0, 0, 0.2)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: darkMode 
                ? 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)'
                : 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.6s'
            },
            "&:hover": {
              backgroundColor: darkMode ? "#FFEEDD" : "#FFF8F0",
              transform: "translateY(-3px)",
              boxShadow: darkMode 
                ? "0 8px 24px rgba(255, 154, 118, 0.4)"
                : "0 8px 24px rgba(255, 112, 67, 0.4)",
              '&::before': {
                transform: 'translateX(100%)'
              }
            },
            "&:active": {
              transform: "translateY(1px)"
            }
          }}
        >
          Begin Talking Now
        </Button>
      </Box>
      
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '4rem',
        opacity: 0.1,
        zIndex: 0,
        animation: 'float 6s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }}>
        🌟
      </Box>
      <Box sx={{
        position: 'absolute',
        bottom: '-30px',
        left: '-30px',
        fontSize: '5rem',
        opacity: 0.1,
        zIndex: 0,
        animation: 'float 7s ease-in-out infinite 0.5s',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }}>
        ❤️
      </Box>
    </Box>
  </Fade>
</Container>

      {/* FOOTER */}
      <Box
        sx={{
          backgroundColor: darkMode ? "#5D4037" : "#FFAB91",
          color: colors.white,
          py: 4,
          mt: 8,
          borderTop: `2px solid ${theme.accent}`,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Mitra
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                }}
              >
                Your compassionate mental health companion
              </Typography>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {['About', 'Features', 'Contact'].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      justifyContent: 'flex-start',
                      color: colors.white,
                      textTransform: 'none',
                      px: 0,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      '&:hover': { opacity: 0.8 }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={6} sm={4}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      justifyContent: 'flex-start',
                      color: colors.white,
                      textTransform: 'none',
                      px: 0,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      '&:hover': { opacity: 0.8 }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              pt: 2,
              borderTop: `1px solid ${colors.white}20`,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
              }}
            >
              &copy; {new Date().getFullYear()} Mitra. Made with ❤️ for your mental well-being.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;