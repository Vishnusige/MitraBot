import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Fade,
  Grow,
  Link,
  Grid
} from "@mui/material";
import TopBar from "./TopBar";
import { useState } from "react";

// Color palette - matching FAQPage
const colors = {
  lightBg: "#FFF8F0",
  lightSecondary: "#FFEEDD",
  lightAccent: "#FF9A76",
  darkPrimary: "#6D4C41",
  white: "#FFFFFF",
  black: "#3E3E3E",
};

const AboutPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Theme settings - matching FAQPage structure
  const theme = {
    bg: darkMode ? colors.darkPrimary : colors.lightBg,
    text: darkMode ? "#FFEEDD" : colors.black,
    secondaryText: darkMode ? "#D7CCC8" : "#5D5D5D",
    cardBg: darkMode ? "#8D6E63" : colors.lightSecondary,
    accent: darkMode ? "#FFAB91" : colors.lightAccent,
    sectionBg: darkMode ? "#4E342E" : "#FFE5D4",
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const features = [
    {
      title: "Empathy First",
      emoji: "💛",
      description: "Built to understand your emotions like a true friend."
    },
    {
      title: "Privacy by Design", 
      emoji: "🔐",
      description: "Anonymous login and full control over your data."
    },
    {
      title: "Always Available",
      emoji: "🌙",
      description: "24/7 support, whenever you need to talk."
    },
    {
      title: "Personalized Guidance",
      emoji: "🎯",
      description: "Mindful routines and suggestions tailored to you."
    }
  ];

  return (
    <Box
      sx={{
        background: theme.bg,
        minHeight: "100vh",
        transition: "all 0.5s ease",
        overflowX: "hidden",
        fontFamily: "'Inter', sans-serif",
        pb: 6
      }}
    >
      <TopBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <Container maxWidth="md" sx={{ pt: 10, px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Fade in timeout={500}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography 
              variant="h3"
              sx={{
                fontWeight: 800,
                color: theme.text,
                fontFamily: "'Poppins', sans-serif",
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: 80,
                  height: 4,
                  bgcolor: theme.accent,
                  mx: 'auto',
                  mt: 2,
                  borderRadius: 2
                }
              }}
            >
              About Mitra
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.secondaryText,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Your compassionate AI mental health companion
            </Typography>
          </Box>
        </Fade>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Grow in timeout={700}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.accent}`,
                  bgcolor: theme.cardBg,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.accent,
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    mb: 1.5
                  }}
                >
                  🌟 Our Vision
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.secondaryText,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.6
                  }}
                >
                  To make mental well-being support accessible, empathetic, and stigma-free for everyone, everywhere.
                </Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grow in timeout={700} style={{ transitionDelay: '100ms' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  borderLeft: `4px solid ${theme.accent}`,
                  bgcolor: theme.cardBg,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.accent,
                    fontWeight: 600,
                    fontFamily: "'Poppins', sans-serif",
                    mb: 1.5
                  }}
                >
                  🎯 Our Mission
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.secondaryText,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.6
                  }}
                >
                  To empower individuals with tools for emotional support, encourage self-reflection, and promote mindful living using AI.
                </Typography>
              </Paper>
            </Grow>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <Fade in timeout={900}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: theme.text,
                fontFamily: "'Poppins', sans-serif",
                mb: 6,
                textAlign: "center",
                position: 'relative',
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: 80,
                  height: 4,
                  bgcolor: theme.accent,
                  mx: 'auto',
                  mt: 2,
                  borderRadius: 2
                }
              }}
            >
              Why Choose Mitra?
            </Typography>
          </Fade>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Grow in timeout={900 + index * 200}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 2,
                      borderLeft: `4px solid ${theme.accent}`,
                      bgcolor: theme.cardBg,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: theme.accent,
                        fontWeight: 600,
                        fontFamily: "'Poppins', sans-serif",
                        mb: 1.5
                      }}
                    >
                      {feature.emoji} {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.secondaryText,
                        fontFamily: "'Inter', sans-serif",
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Fade in timeout={1500}>
          <Paper
            sx={{
              mt: 8,
              p: 4,
              textAlign: "center",
              bgcolor: theme.sectionBg,
              borderRadius: 2,
              border: `1px solid ${theme.accent}80`
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.text,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              We're Here For You
            </Typography>
            <Typography
              sx={{
                color: theme.secondaryText,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Have questions or feedback? Reach us at{' '}
              <Link 
                href="mailto:support@mitraai.com" 
                sx={{
                  color: theme.accent,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                support@mitraai.com
              </Link>
            </Typography>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default AboutPage;