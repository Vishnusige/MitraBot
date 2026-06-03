import { useContext, useState } from "react";
import { UserContext } from "./userContext";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Define the color palette from landing page
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
  bg: colors.lightBg,
  text: colors.black,
  secondaryText: "#5D5D5D",
  cardBg: colors.lightSecondary,
  accent: colors.lightAccent,
  sectionBg: "#FFE5D4",
  divider: "rgba(0, 0, 0, 0.12)",
};

const PasswordUpdateTab = () => {
  const { changePassword } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { userId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await changePassword(userId, currentPassword, newPassword);
    setSnackbarMessage(result.message);
    setSnackbarType(result.success ? "success" : "error");
    setSnackbarOpen(true);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
       
        backgroundColor: theme.bg,
        padding: 3,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: theme.cardBg,
          borderRadius: "16px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          padding: 4,
          border: `1px solid ${theme.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 700,
              textAlign: "center",
              fontFamily: "'Poppins', sans-serif",
              background: `linear-gradient(45deg, ${theme.accent}, #FF7043)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Update Your Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="current-password"
              label="Current Password"
              name="currentPassword"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: theme.bg,
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: theme.accent }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Visibility sx={{ color: theme.accent }} />
                      ) : (
                        <VisibilityOff sx={{ color: theme.secondaryText }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="new-password"
              label="New Password"
              name="newPassword"
              autoComplete="new-password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: theme.bg,
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon sx={{ color: theme.accent }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? (
                        <Visibility sx={{ color: theme.accent }} />
                      ) : (
                        <VisibilityOff sx={{ color: theme.secondaryText }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: "50px",
                padding: "12px",
                fontWeight: 600,
                backgroundColor: theme.accent,
                color: colors.white,
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "#FF8A65",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Update Password
            </Button>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarType}
              sx={{
                width: "100%",
                borderRadius: "12px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </Box>
  );
};

export default PasswordUpdateTab;