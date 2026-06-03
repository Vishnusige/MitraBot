import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiServerAxios from "../api/axios";
import {
    Button,
    Container,
    Typography,
    CssBaseline,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tabs,
    Tab,
    Box,
    InputBase,
    useTheme,
} from "@mui/material";
import {
    createTheme,
    ThemeProvider,
    styled,
    alpha,
} from "@mui/material/styles";
import WcIcon from "@mui/icons-material/Wc";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

import PasswordUpdateTab from "./passwordUpdateTab";
import DialogBox from "./reusables/DialogBox";

// Define the color palette
const colors = {
    lightBg: "#FFF8F0",
    lightSecondary: "#FFEEDD",
    lightAccent: "#FF9A76",
    darkPrimary: "#6D4C41",
    darkSecondary: "#8D6E63",
    darkAccent: "#FFAB91",
    textDark: "#3E3E3E",
    textLight: "#FFEEDD",
    sectionLight: "#FFE5D4",
    sectionDark: "#4E342E",
};

// Create the theme
const theme = createTheme({
    palette: {
        mode: 'light', // default to light mode
        primary: {
            main: colors.lightAccent, // Coral accent color
        },
        secondary: {
            main: colors.lightSecondary, // Light peach
        },
        background: {
            default: colors.lightBg, // Cream background
            paper: colors.lightSecondary, // Light peach for cards
        },
        text: {
            primary: colors.textDark, // Dark gray text
            secondary: "#5D5D5D", // Gray text
        },
        section: {
            main: colors.sectionLight, // Peach section background
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
        },
        h2: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
        },
        h3: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
        },
        h4: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 'bold',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                },
                contained: {
                    background: `linear-gradient(135deg, ${colors.lightAccent} 0%, #FF7B54 100%)`,
                    color: 'white',
                    '&:hover': {
                        background: `linear-gradient(135deg, #FF7B54 0%, ${colors.lightAccent} 100%)`,
                    },
                },
                outlined: {
                    borderColor: colors.lightAccent,
                    color: colors.lightAccent,
                    '&:hover': {
                        backgroundColor: alpha(colors.lightAccent, 0.1),
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    background: colors.lightSecondary,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    },
                },
            },
        },
    },
});

// Dark mode overrides
const darkTheme = createTheme({
    ...theme,
    palette: {
        mode: 'dark',
        primary: {
            main: colors.darkAccent, // Light coral accent
        },
        secondary: {
            main: colors.darkSecondary, // Darker brown
        },
        background: {
            default: colors.darkPrimary, // Brown background
            paper: colors.darkSecondary, // Darker brown for cards
        },
        text: {
            primary: colors.textLight, // Cream text
            secondary: "#D7CCC8", // Light gray text
        },
        section: {
            main: colors.sectionDark, // Dark brown section background
        },
    },
});

const CustomTabs = styled(Tabs)(({ theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: "20px",
    boxShadow: theme.shadows[1],
    margin: "20px 0",
    maxWidth: "100%",
    overflow: "hidden",
}));

const CustomTab = styled(Tab)(({ theme }) => ({
    fontSize: "1rem",
    fontWeight: "bold",
    color: theme.palette.text.primary,
    margin: "0 4px",
    flex: 1,
    maxWidth: "none",
    "&.Mui-selected": {
        color: theme.palette.primary.main,
        background: alpha(theme.palette.primary.main, 0.1),
    },
    "&:hover": {
        background: alpha(theme.palette.primary.main, 0.05),
        transition: "background-color 0.3s",
    },
    "@media (max-width: 720px)": {
        padding: "6px 12px",
        fontSize: "0.8rem",
    },
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
        borderRadius: 20,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "2px solid",
        borderColor: alpha(theme.palette.primary.main, 0.2),
        fontSize: 16,
        width: "100%",
        padding: "10px 12px",
        transition: theme.transitions.create([
            "border-color",
            "background-color",
            "box-shadow",
        ]),
        fontFamily: theme.typography.fontFamily,
        "&:focus": {
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

function UserProfile() {
    const { userId } = useParams();
    const token = localStorage.getItem("token");
    const [darkMode, setDarkMode] = useState(false);
    const [user, setUser] = useState({
        username: "",
        name: "",
        email: "",
        age: "",
        gender: "",
        placeOfResidence: "",
        fieldOfWork: "",
        mental_health_concerns: [],
    });
    const [tabValue, setTabValue] = useState(0);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("info");
    const [isDeleteRequested, setIsDeleteRequested] = useState(false);
    const [isDeleteInProgress, setIsDeleteInProgress] = useState(false);
    const [usernameCheck, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const currentTheme = darkMode ? darkTheme : theme;

    useEffect(() => {
        if (!userId) {
            console.error("User ID is undefined");
            return;
        }
        const fetchData = async () => {
            try {
                const response = await apiServerAxios.get(
                    `/user/profile/${userId}`
                );
                const formattedData = {
                    username: response.data.username || "",
                    name: response.data.name || "",
                    email: response.data.email || "",
                    age: response.data.age || "",
                    gender: response.data.gender || "",
                    placeOfResidence:
                        response.data.placeOfResidence || "Not specified",
                    fieldOfWork: response.data.fieldOfWork || "Not specified",
                    mental_health_concerns:
                        response.data.mental_health_concerns || [],
                };
                setUser(formattedData);
            } catch (error) {
                setMessage("Failed to fetch user data");
                setSeverity("error");
                setOpen(true);
            }
        };
        fetchData();
    }, [userId]);

    const mentalStressors = [
        { label: "Stress from Job Search", value: "job_search" },
        { label: "Stress from Classwork", value: "classwork" },
        { label: "Social Anxiety", value: "social_anxiety" },
        { label: "Impostor Syndrome", value: "impostor_syndrome" },
        { label: "Career Drift", value: "career_drift" },
    ];

    const handleMentalHealthChange = (event) => {
        const { name, checked } = event.target;
        setUser((prevState) => {
            const newConcerns = checked
                ? [...prevState.mental_health_concerns, name]
                : prevState.mental_health_concerns.filter(
                      (concern) => concern !== name
                  );
            return { ...prevState, mental_health_concerns: newConcerns };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiServerAxios.patch(`/user/profile/${userId}`, user);
            setMessage("Profile updated successfully!");
            setSeverity("success");
        } catch (error) {
            setMessage("Failed to update profile");
            setSeverity("error");
        }
        setOpen(true);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const openDeleteModal = () => {
        setUsername("");
        setIsDeleteRequested(true);
    };

    function closeDeleteModal() {
        setIsDeleteRequested(false);
    }

    async function deleteProfile() {
        setIsDeleteInProgress(true);
        try {
            if (
                usernameCheck.toLowerCase().split(" ").join("") !==
                user.username.toLowerCase().split(" ").join("")
            ) {
                setIsDeleteInProgress(false);
                setErrorMessage("Incorrect username");
                return;
            }
            await apiServerAxios.delete(`/user/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            closeDeleteModal();
            navigate("/auth");
            setMessage("Profile successfully deleted");
            setSeverity("success");
        } catch (error) {
            setMessage("Failed to delete profile");
            setSeverity("error");
        } finally {
            setIsDeleteInProgress(false);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <Box
                sx={{
                    paddingTop: 3,
                    paddingBottom: 3,
                    maxHeight: "88vh",
                    overflowY: "auto",
                    paddingRight: 2,
                    background: currentTheme.palette.background.default,
                }}
            >
                <Container maxWidth="lg">
                    <CustomTabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                    >
                        <CustomTab label="Profile" />
                        <CustomTab label="Update Password" />
                        <CustomTab label="Delete Account" />
                    </CustomTabs>

                    {tabValue === 0 && (
                        <Box>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{ pb: 5 }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{ fontWeight: 600, mb: 3, color: currentTheme.palette.text.primary }}
                                >
                                    Profile
                                </Typography>
                                <Box
                                    sx={{
                                        display: {
                                            xl: "flex",
                                            flexDirection: "row",
                                            gap: 4,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            p: 4,
                                            border: 3,
                                            mb: 4,
                                            borderColor: alpha(currentTheme.palette.primary.main, 0.2),
                                            borderRadius: "40px",
                                            boxShadow: 1,
                                            background: currentTheme.palette.background.paper,
                                            ":hover": {
                                                bgcolor: alpha(currentTheme.palette.primary.main, 0.05),
                                            },
                                            flex: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                color: currentTheme.palette.text.primary,
                                            }}
                                        >
                                            Personal Information
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xl: "column",
                                                    sm: "row",
                                                    xs: "column",
                                                },
                                                gap: { xs: 0, sm: 3 },
                                            }}
                                        >
                                            <FormControl
                                                variant="standard"
                                                sx={{
                                                    mt: 3,
                                                    width: { xs: "100%", lg: "100%" },
                                                }}
                                            >
                                                <InputLabel
                                                    shrink
                                                    htmlFor="name"
                                                    sx={{
                                                        fontSize: 20,
                                                        color: currentTheme.palette.text.primary,
                                                    }}
                                                >
                                                    Name
                                                </InputLabel>
                                                <BootstrapInput
                                                    value={user.name || ""}
                                                    id="name"
                                                    name="name"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                            <FormControl
                                                variant="standard"
                                                sx={{
                                                    mt: 3,
                                                    width: { xs: "100%", lg: "100%" },
                                                }}
                                            >
                                                <InputLabel
                                                    shrink
                                                    htmlFor="email"
                                                    sx={{
                                                        fontSize: 20,
                                                        color: currentTheme.palette.text.primary,
                                                    }}
                                                >
                                                    Email
                                                </InputLabel>
                                                <BootstrapInput
                                                    value={user.email || ""}
                                                    name="email"
                                                    id="email"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: {
                                                    xs: "start",
                                                    sm: "center",
                                                },
                                                flexDirection: {
                                                    xs: "column",
                                                    sm: "row",
                                                },
                                                gap: { xs: 0, sm: 3 },
                                            }}
                                        >
                                            <FormControl
                                                variant="standard"
                                                sx={{ mt: 3, width: "100%" }}
                                            >
                                                <InputLabel
                                                    shrink
                                                    htmlFor="age"
                                                    sx={{
                                                        fontSize: 20,
                                                        color: currentTheme.palette.text.primary,
                                                    }}
                                                >
                                                    Age
                                                </InputLabel>
                                                <BootstrapInput
                                                    value={user.age || ""}
                                                    name="age"
                                                    id="age"
                                                    style={{ width: "100%" }}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                            <FormControl
                                                variant="standard"
                                                sx={{ mt: 3, width: "100%" }}
                                            >
                                                <InputLabel
                                                    shrink
                                                    htmlFor="gender"
                                                    sx={{
                                                        fontSize: 20,
                                                        color: currentTheme.palette.text.primary,
                                                    }}
                                                >
                                                    Gender
                                                </InputLabel>
                                                <Select
                                                    name="gender"
                                                    style={{ width: "100%" }}
                                                    value={user.gender || ""}
                                                    label="Gender"
                                                    onChange={handleChange}
                                                    startAdornment={
                                                        <IconButton>
                                                            <WcIcon />
                                                        </IconButton>
                                                    }
                                                    sx={{
                                                        borderRadius: "20px",
                                                        "& .MuiSelect-select": {
                                                            paddingLeft: "12px",
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 4,
                                            border: 3,
                                            mb: 4,
                                            borderColor: alpha(currentTheme.palette.primary.main, 0.2),
                                            borderRadius: "40px",
                                            boxShadow: 1,
                                            background: currentTheme.palette.background.paper,
                                            ":hover": {
                                                bgcolor: alpha(currentTheme.palette.primary.main, 0.05),
                                            },
                                            flex: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                color: currentTheme.palette.text.primary,
                                            }}
                                        >
                                            Personal Address
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: {
                                                    xl: "column",
                                                    sm: "row",
                                                    xs: "column",
                                                },
                                                gap: { xs: 0, sm: 3 },
                                            }}
                                        >
                                            <FormControl
                                                variant="standard"
                                                sx={{
                                                    mt: 3,
                                                    width: { xs: "100%", lg: "100%" },
                                                }}
                                            >
                                                <InputLabel
                                                    shrink
                                                    htmlFor="place-of-residence"
                                                    sx={{
                                                        fontSize: 20,
                                                        color: currentTheme.palette.text.primary,
                                                    }}
                                                >
                                                    Place of Residence
                                                </InputLabel>
                                                <BootstrapInput
                                                    value={user.placeOfResidence || ""}
                                                    name="placeOfResidence"
                                                    id="place-of-residence"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                            <FormControl
                                                variant="standard"
                                                sx={{
                                                    mt: 3,
                                                    width: { xs: "100%", lg: "100%" },
                                                }}
                                            >
                                                <InputLabel
                                                    shrink
                                                    htmlFor="field-of-work"
                                                    sx={{
                                                        fontSize: 20,
                                                        color: currentTheme.palette.text.primary,
                                                    }}
                                                >
                                                    Field of Work
                                                </InputLabel>
                                                <BootstrapInput
                                                    value={user.fieldOfWork || ""}
                                                    name="fieldOfWork"
                                                    id="field-of-work"
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        p: 4,
                                        border: 3,
                                        mb: 4,
                                        borderColor: alpha(currentTheme.palette.primary.main, 0.2),
                                        borderRadius: "40px",
                                        boxShadow: 1,
                                        background: currentTheme.palette.background.paper,
                                        ":hover": {
                                            bgcolor: alpha(currentTheme.palette.primary.main, 0.05),
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: 20,
                                            mb: 3,
                                            color: currentTheme.palette.text.primary,
                                        }}
                                    >
                                        Check all that Apply
                                    </Typography>
                                    <FormGroup>
                                        {mentalStressors.map((stressor, index) => {
                                            return (
                                                <FormControlLabel
                                                    key={index}
                                                    sx={{
                                                        borderRadius: "20px",
                                                        width: "fit-content",
                                                        px: 1,
                                                        mb: 2,
                                                        bgcolor: alpha(currentTheme.palette.primary.main, 0.1),
                                                    }}
                                                    control={
                                                        <Checkbox
                                                            checked={user.mental_health_concerns.includes(
                                                                stressor.value
                                                            )}
                                                            onChange={
                                                                handleMentalHealthChange
                                                            }
                                                            name={stressor.value}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                        >
                                                            <Typography sx={{ color: currentTheme.palette.text.primary }}>
                                                                {stressor.label}
                                                            </Typography>
                                                            <Tooltip
                                                                title={
                                                                    <Typography variant="body2">
                                                                        {getStressorDescription(
                                                                            stressor.value
                                                                        )}
                                                                    </Typography>
                                                                }
                                                                arrow
                                                                placement="right"
                                                            >
                                                                <InfoIcon
                                                                    color="action"
                                                                    style={{
                                                                        marginLeft: 4,
                                                                        fontSize: 20,
                                                                        color: currentTheme.palette.text.secondary,
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </Box>
                                                    }
                                                />
                                            );
                                        })}
                                    </FormGroup>
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ 
                                        borderRadius: "20px",
                                        float: "right",
                                        mt: 2,
                                    }}
                                >
                                    Update Profile
                                </Button>
                            </Box>
                        </Box>
                    )}
                    {tabValue === 1 && <PasswordUpdateTab userId={userId} />}
                    {tabValue === 2 && (
                        <Box sx={{ width: "100%" }}>
                            <Box
                                sx={{
                                    p: 4,
                                    border: 3,
                                    my: 4,
                                    borderColor: alpha(currentTheme.palette.primary.main, 0.2),
                                    borderRadius: "40px",
                                    boxShadow: 1,
                                    background: currentTheme.palette.background.paper,
                                    ":hover": {
                                        bgcolor: alpha(currentTheme.palette.primary.main, 0.05),
                                    },
                                }}
                            >
                                <Typography variant="h4" sx={{ color: "error.main" }}>
                                    Delete Account
                                </Typography>
                                <Typography sx={{ my: 2, color: currentTheme.palette.text.primary }}>
                                    Once you delete your account, there is no going
                                    back. Please be certain.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={openDeleteModal}
                                    sx={{
                                        background: "linear-gradient(135deg, #FF5A5F 0%, #C81E1E 100%)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #C81E1E 0%, #FF5A5F 100%)",
                                        },
                                    }}
                                >
                                    Delete your profile
                                </Button>
                            </Box>
                            <DialogBox
                                isDeleteRequested={isDeleteRequested}
                                isDeleteInProgress={isDeleteInProgress}
                                closeDeleteModal={closeDeleteModal}
                                user={user}
                                title="Are you sure you want to do this?"
                                message="We will immediately delete all of your information. To confirm this action, kindly input your username below."
                                okText="Delete"
                                cancelText="Cancel"
                                errorMessage={errorMessage}
                                usernameCheck={usernameCheck}
                                setUsername={setUsername}
                                deleteProfile={deleteProfile}
                                setErrorMessage={setErrorMessage}
                            />
                        </Box>
                    )}
                    <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                    >
                        <Alert
                            onClose={handleClose}
                            severity={severity}
                            sx={{ width: "100%" }}
                        >
                            {message}
                        </Alert>
                    </Snackbar>
                </Container>
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

export default UserProfile;