import React, { useState, useEffect } from "react";
import axios from "axios";
import apiServerAxios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  List,
  ListItemText,
  Typography,
  Card,
  Avatar,
  ListItemAvatar,
  Chip,
  Divider,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RepeatIcon from "@mui/icons-material/Repeat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import { ring2 } from "ldrs";

// Register the loading animation
ring2.register();

// Define the color palette from landing page
const colors = {
  lightBg: "#FFF8F0",
  lightSecondary: "#FFEEDD",
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
const StyledCard = styled(Card)({
  marginBottom: "16px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
  backgroundColor: theme.cardBg,
  border: `1px solid ${theme.divider}`,
  borderRadius: "12px",
});

const FrequencyChip = styled(Chip)({
  marginLeft: "8px",
  backgroundColor: theme.accent,
  color: colors.white,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CheckInsList() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCheckIns();
  }, [userId]);

  const fetchCheckIns = async () => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    if (!token) {
      setError("No token found, please log in again");
      return;
    }

    setLoading(true);
    try {
      const response = await apiServerAxios.get(
        `/check-in/all?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        Array.isArray(response.data) &&
        response.data.every(
          (item) =>
            item._id &&
            item._id.$oid &&
            item.check_in_time &&
            item.check_in_time.$date
        )
      ) {
        const formattedCheckIns = response.data.map((checkIn) => ({
          ...checkIn,
          _id: checkIn._id.$oid,
          check_in_time: new Date(checkIn.check_in_time.$date).toLocaleString(
            "en-US",
            {
              timeZone: "UTC",
              hour12: true,
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }
          ),
        }));

        setCheckIns(formattedCheckIns);
      } else {
        console.error(
          "Data received is not in expected array format:",
          response.data
        );
        setError("Unexpected data format");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error during fetch:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOpenDialog = (checkInId) => {
    const checkIn = checkIns.find((c) => c._id === checkInId);
    if (checkIn) {
      setSelectedCheckIn(checkIn);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteCheckIn = async () => {
    if (selectedCheckIn) {
      try {
        await apiServerAxios.delete(`/check-in/${selectedCheckIn._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnackbarMessage("Check-in deleted successfully");
        setSnackbarSeverity("success");
        fetchCheckIns();
        handleCloseDialog();
      } catch (err) {
        setSnackbarMessage("Failed to delete check-in");
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  };

  const handleUpdateRedirect = () => {
    navigate(`/user/check_in/${selectedCheckIn._id}`);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
  };

  if (!userId)
    return (
      <Typography 
        variant="h6" 
        mt="2" 
        sx={{ 
          color: theme.text,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Please log in to see your check-ins.
      </Typography>
    );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          backgroundColor: theme.bg,
        }}
      >
        <l-ring-2
          size="40"
          stroke="5"
          stroke-length="0.25"
          bg-opacity="0.1"
          speed="0.8"
          color={theme.accent}
        ></l-ring-2>
      </Box>
    );

  return (
    <Box
      sx={{
        margin: 3,
        width: { xs: "90%", md: "80%" },
        mx: "auto",
        maxHeight: "85vh",
        overflow: "auto",
        px: 2,
        py: 3,
        backgroundColor: theme.bg,
        borderRadius: "16px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{
          color: theme.text,
          fontWeight: 700,
          mb: 3,
          textAlign: "center",
          fontFamily: "'Poppins', sans-serif",
          background: `linear-gradient(45deg, ${theme.accent}, #FF7043)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Your Check-In History
      </Typography>
      
      <Divider 
        sx={{ 
          mb: 4, 
          borderColor: theme.divider,
          borderBottomWidth: 1,
        }} 
      />
      
      {checkIns.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {checkIns.map((checkIn) => (
            <StyledCard key={checkIn._id}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.accent,
                      color: colors.white,
                    }}
                  >
                    <AccessTimeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: theme.text,
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {checkIn.check_in_time}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: theme.secondaryText,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Frequency:
                      </Typography>
                      <FrequencyChip
                        label={checkIn.frequency}
                        icon={<RepeatIcon fontSize="small" />}
                        size="small"
                      />
                    </Box>
                  }
                />
              </Box>
              <Tooltip title="More options">
                <IconButton 
                  onClick={() => handleOpenDialog(checkIn._id)}
                  sx={{
                    color: theme.secondaryText,
                    "&:hover": {
                      color: theme.accent,
                      backgroundColor: "transparent",
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </StyledCard>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            p: 4,
            backgroundColor: theme.cardBg,
            borderRadius: "16px",
            border: `1px solid ${theme.divider}`,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: theme.text,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            No check-ins found
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.secondaryText,
              maxWidth: "400px",
              mb: 3,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Start tracking your commitments by creating your first check-in.
          </Typography>
          <Button
            variant="contained"
            sx={{ 
              mt: 2,
              borderRadius: "50px",
              padding: "8px 24px",
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: theme.accent,
              color: colors.white,
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#FF8A65",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-1px)",
              }
            }}
            onClick={() => navigate("/user/check_in/new")}
          >
            Create New Check-In
          </Button>
        </Box>
      )}

      {/* Check-In Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            minWidth: "400px",
            backgroundColor: theme.cardBg,
            borderRadius: "16px",
            border: `1px solid ${theme.divider}`,
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.accent,
            color: colors.white,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            borderRadius: "16px 16px 0 0",
          }}
        >
          Check-In Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.secondaryText,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Time
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.text,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {selectedCheckIn?.check_in_time}
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.secondaryText,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Frequency
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.text,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {selectedCheckIn?.frequency}
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.secondaryText,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Status
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.text,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {selectedCheckIn?.status || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.secondaryText,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Notification
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.text,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {selectedCheckIn?.notify ? "Enabled" : "Disabled"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: theme.secondaryText,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleUpdateRedirect}
            startIcon={<EditIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              color: theme.accent,
              borderColor: theme.accent,
              fontFamily: "'Inter', sans-serif",
              "&:hover": {
                borderColor: "#FF8A65",
              }
            }}
            variant="outlined"
          >
            Edit
          </Button>
          <Button
            onClick={handleOpenDeleteConfirm}
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#ff4444",
              color: colors.white,
              fontFamily: "'Inter', sans-serif",
              "&:hover": {
                backgroundColor: "#cc0000",
              }
            }}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmOpen} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: theme.cardBg,
            borderRadius: "16px",
            border: `1px solid ${theme.divider}`,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            color: "#ff4444",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <DialogContentText 
            sx={{
              color: theme.text,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Are you sure you want to delete this check-in? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: theme.secondaryText,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteCheckIn}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#ff4444",
              color: colors.white,
              fontFamily: "'Inter', sans-serif",
              "&:hover": {
                backgroundColor: "#cc0000",
              }
            }}
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
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
  );
}

export default CheckInsList;