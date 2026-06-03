import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Fade,
  Grow,
  Link
} from "@mui/material";
import TopBar from "./TopBar";
import { useState } from "react";

// Color palette - matching LandingPage
const colors = {
  lightBg: "#FFF8F0",
  lightSecondary: "#FFEEDD",
  lightAccent: "#FF9A76",
  darkPrimary: "#6D4C41",
  white: "#FFFFFF",
  black: "#3E3E3E",
};

const FAQPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Theme settings - matching LandingPage structure
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

  const faqData = [
    {
      q: "Is Mitra a replacement for therapy?",
      a: "No, Mitra is not a replacement for therapy. It's a tool that helps users explore available mental health resources and connect with professionals if necessary.",
    },
    {
      q: "Is my privacy protected when using Mitra?",
      a: "Yes, we prioritize your privacy. Mitra offers anonymous login options to protect your identity.",
    },
    // ... other FAQ items
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
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.secondaryText,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Here are some common questions we receive:
            </Typography>
          </Box>
        </Fade>

        {/* FAQ Items */}
        {faqData.map((faq, index) => (
          <Grow in timeout={(index + 1) * 200} key={index}>
            <Paper
              elevation={3}
              sx={{
                mb: 3,
                p: 3,
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
                variant="h6"
                sx={{
                  color: theme.accent,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  mb: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Q: {faq.q}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.secondaryText,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.6
                }}
              >
                A: {faq.a}
              </Typography>
            </Paper>
          </Grow>
        ))}

        {/* Contact Section */}
        <Fade in timeout={1000}>
          <Paper
            sx={{
              mt: 6,
              p: 4,
              textAlign: "center",
              bgcolor: theme.sectionBg,
              borderRadius: 2,
              border: `1px solid ${theme.accent}80`
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: theme.text,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Still have questions?
            </Typography>
            <Typography
              sx={{
                color: theme.secondaryText,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Contact us at{' '}
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

export default FAQPage;