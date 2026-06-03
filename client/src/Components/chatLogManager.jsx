import React, { useState } from "react";
import apiServerAxios from "../api/axios";
import {
  Button,
  Snackbar,
  Alert,
  Tooltip,
  Typography,
  CircularProgress,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  Box,
  styled,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import DateRangeIcon from "@mui/icons-material/DateRange";

// Define the color palette from landing page
const colors = {
  lightBg: "#FFF8F0",
  lightSecondary: "#FFF8F0",
  lightAccent: "#FF9A76",
  darkPrimary: "#6D4C41",
  white: "#FFFFFF",
  black: "#3E3E3E",
};

// Theme settings (light mode by default)
const theme = {
  bg: colors.lightBg,
  text: colors.black,
  secondaryText: "#5D5D5D",
  cardBg: colors.lightSecondary,
  accent: colors.lightAccent,
  sectionBg: "#FFE5D4",
  divider: "rgba(0, 0, 0, 0.12)",
};

// Styled components with our custom theme
const ActionButton = styled(Button)({
  margin: "8px 0",
  padding: "8px 24px",
  borderRadius: "50px",
  fontWeight: 600,
  textTransform: "none",
  fontFamily: "'Inter', sans-serif",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
});

const StyledDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    borderRadius: "16px",
    backgroundColor: theme.cardBg,
    border: `1px solid ${theme.divider}`,
  },
});

function ChatLogManager() {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("info");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dialogRange, setDialogRange] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = (range) => {
    setDialogRange(range);
    setDialogOpen(true);
  };

  const downloadChatLogs = async (range = false) => {
    setLoading(true);
    try {
      const endpoint = range
        ? "/user/download_chat_logs/range"
        : "/user/download_chat_logs";
      const params = range
        ? { params: { start_date: startDate, end_date: endDate } }
        : {};

      const response = await apiServerAxios.get(endpoint, {
        ...params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        range ? "chat_logs_range.csv" : "chat_logs.csv"
      );
      document.body.appendChild(link);
      link.click();

      setMessage("Chat logs downloaded successfully.");
      setSeverity("success");
    } catch (error) {
      setMessage(
        `Failed to download chat logs: ${
          error.response?.data?.error || error.message
        }`
      );
      setSeverity("error");
    } finally {
      setLoading(false);
    }
    setSnackbarOpen(true);
  };

  const deleteChatLogs = async () => {
    setDialogOpen(false);
    setLoading(true);
    try {
      const endpoint = dialogRange
        ? "/user/delete_chat_logs/range"
        : "/user/delete_chat_logs";
      const params = dialogRange
        ? { params: { start_date: startDate, end_date: endDate } }
        : {};

      const response = await apiServerAxios.delete(endpoint, {
        ...params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage(response.data.message);
      setSeverity("success");
    } catch (error) {
      setMessage(
        `Failed to delete chat logs: ${
          error.response?.data?.error || error.message
        }`
      );
      setSeverity("error");
    } finally {
      setLoading(false);
    }
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.bg,
        padding: 3,
      }}
    >
      <Container
        maxWidth="md"
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
            Chat Log Management
          </Typography>

          <Box
            component="form"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: theme.bg,
                  }
                }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: theme.bg,
                  }
                }}
              />
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: theme.secondaryText,
                textAlign: "center",
                mb: 2,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Download your chat logs as CSV files for record keeping or analysis.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <Tooltip title="Download chat logs for selected date range">
                <ActionButton
                  startIcon={<DateRangeIcon />}
                  onClick={() => downloadChatLogs(true)}
                  disabled={loading || !startDate || !endDate}
                  sx={{
                    backgroundColor: theme.bg,
                    color: theme.text,
                    border: `1px solid ${theme.accent}`,
                    "&:hover": {
                      backgroundColor: theme.sectionBg,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Download Range"
                  )}
                </ActionButton>
              </Tooltip>
              <Tooltip title="Download all your chat logs">
                <ActionButton
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => downloadChatLogs(false)}
                  disabled={loading}
                  sx={{
                    backgroundColor: theme.accent,
                    color: colors.white,
                    "&:hover": {
                      backgroundColor: "#FF8A65",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Download All"
                  )}
                </ActionButton>
              </Tooltip>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: theme.secondaryText,
                textAlign: "center",
                mb: 2,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Permanently delete chat logs when you need to clear your history.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Tooltip title="Delete chat logs for selected date range">
                <ActionButton
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteConfirmation(true)}
                  disabled={loading || !startDate || !endDate}
                  sx={{
                    backgroundColor: theme.bg,
                    color: "#ff4444",
                    border: `1px solid #ff4444`,
                    "&:hover": {
                      backgroundColor: "rgba(255, 68, 68, 0.1)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Delete Range"
                  )}
                </ActionButton>
              </Tooltip>
              <Tooltip title="Permanently delete all chat logs">
                <ActionButton
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteConfirmation(false)}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#ff4444",
                    color: colors.white,
                    "&:hover": {
                      backgroundColor: "#cc0000",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Delete All"
                  )}
                </ActionButton>
              </Tooltip>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: theme.secondaryText,
                textAlign: "center",
                fontStyle: "italic",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Note: Deleted chat logs cannot be recovered.
            </Typography>
          </Box>
        </Box>

        <StyledDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: theme.text,
              backgroundColor: theme.cardBg,
              borderBottom: `1px solid ${theme.divider}`,
            }}
          >
            Confirm Deletion
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: theme.cardBg }}>
            <DialogContentText
              id="alert-dialog-description"
              sx={{
                color: theme.text,
                fontFamily: "'Inter', sans-serif",
                mt: 2,
              }}
            >
              Are you sure you want to delete these chat logs? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: theme.cardBg }}>
            <Button
              onClick={handleDialogClose}
              sx={{
                color: theme.secondaryText,
                fontFamily: "'Inter', sans-serif",
                "&:hover": {
                  color: theme.accent,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={deleteChatLogs}
              sx={{
                color: "#ff4444",
                fontFamily: "'Inter', sans-serif",
                "&:hover": {
                  backgroundColor: "rgba(255, 68, 68, 0.1)",
                },
              }}
              autoFocus
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </StyledDialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={severity}
            sx={{
              width: "100%",
              borderRadius: "12px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default ChatLogManager;