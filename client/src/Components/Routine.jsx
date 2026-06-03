import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Link,
    styled,
    Tabs,
    Tab,
    Snackbar,
    Alert,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ring2 } from "ldrs";
import apiServerAxios from "../api/axios";
import { RiDeleteBin6Line } from "react-icons/ri";

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
const CustomTabs = styled(Tabs)({
    background: theme.cardBg,
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    margin: "20px 0",
    maxWidth: "100%",
    overflow: "hidden",
    border: `1px solid ${theme.divider}`,
});

const CustomTab = styled(Tab)({
    fontSize: "1rem",
    fontWeight: "bold",
    color: theme.text,
    fontFamily: "'Poppins', sans-serif",
    flex: 1,
    maxWidth: "none",
    "&.Mui-selected": {
        color: theme.accent,
        background: theme.cardBg,
    },
    "&:hover": {
        background: theme.sectionBg,
        transition: "background-color 0.3s",
    },
    "@media (max-width: 720px)": {
        padding: "6px 12px",
        fontSize: "0.8rem",
    },
});

const StyledButton = styled(Button)({
    backgroundColor: theme.accent,
    color: colors.white,
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    borderRadius: "50px",
    padding: "10px 24px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
    "&:hover": {
        backgroundColor: "#FF8A65",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
        transform: "translateY(-1px)",
    },
});

function Routine() {
    const [youTubeSearchQuery, setYouTubeSearchQuery] = useState({});
    const [googleSearchQuery, setGoogleSearchQuery] = useState({});
    const [isSearchInProgress, setIsSearchInProgress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [youtubeSearchData, setYoutubeSearchData] = useState([]);
    const [googleSearchData, setGoogleSearchData] = useState([]);
    const [initialYouTubeData, setInitialYouTubeData] = useState([]);
    const [initialGoogleData, setInitialGoogleData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [itemsToDisplay, setItemsToDisplay] = useState(3);
    ring2.register();
    const token = localStorage.getItem("token");
    const [tabValue, setTabValue] = useState(0);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("info");

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1536) {
                setItemsToDisplay(4);
            } else {
                setItemsToDisplay(3);
            }
        }

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const initialLoad = useCallback(async () => {
        setIsLoading(true);
        const cachedYoutubeData = sessionStorage.getItem("initial-youtube-data");
        const cachedGoogleData = sessionStorage.getItem("initial-google-data");
        const cachedHistoryData = sessionStorage.getItem("initial-history-data");

        if (cachedYoutubeData && cachedGoogleData && cachedHistoryData) {
            setInitialYouTubeData(JSON.parse(cachedYoutubeData));
            setInitialGoogleData(JSON.parse(cachedGoogleData));
            setHistoryData(JSON.parse(cachedHistoryData));
            setIsLoading(false);
            return;
        }

        try {
            const youtubeSearchResponse = await apiServerAxios.get(
                "/youtube_search",
                {
                    params: { query: "Breathing", type: "Medication" },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const googleSearchResponse = await apiServerAxios.get("/search", {
                params: { query: "Breathing", type: "Medication" },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setInitialYouTubeData(youtubeSearchResponse.data);
            setInitialGoogleData(googleSearchResponse.data);

            sessionStorage.setItem(
                "initial-youtube-data",
                JSON.stringify(youtubeSearchResponse.data)
            );
            sessionStorage.setItem(
                "initial-google-data",
                JSON.stringify(googleSearchResponse.data)
            );
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        initialLoad();
    }, [initialLoad]);

    async function youTubeSearch(e) {
        e.preventDefault();
        setIsSearchInProgress(true);
        try {
            const youtubeSearchResponse = await apiServerAxios.get(
                "/youtube_search",
                {
                    params: youTubeSearchQuery,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await getSearchHistory();
            setYoutubeSearchData(youtubeSearchResponse.data);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsSearchInProgress(false);
        }
    }

    async function googleSearch(e) {
        e.preventDefault();
        setIsSearchInProgress(true);
        try {
            const googleSearchResponse = await apiServerAxios.get("/search", {
                params: googleSearchQuery,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await getSearchHistory();
            setGoogleSearchData(googleSearchResponse.data);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsSearchInProgress(false);
        }
    }

    async function getSearchHistory() {
        const googleSearchHistory = await apiServerAxios.get("/search_history", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const youtubeSearchHistory = await apiServerAxios.get("/search_history", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setHistoryData(googleSearchHistory.data);
        setHistoryData(youtubeSearchHistory.data);

        sessionStorage.setItem(
            "initial-history-data",
            JSON.stringify(googleSearchHistory.data)
        );
        sessionStorage.setItem(
            "initial-history-data",
            JSON.stringify(youtubeSearchHistory.data)
        );
    }

    function handleYouTubeInputsChange(e) {
        const { name, value } = e.target;
        setYouTubeSearchQuery((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
    }

    function handleGoogleInputsChange(e) {
        const { name, value } = e.target;
        setGoogleSearchQuery((prevValue) => ({
            ...prevValue,
            [name]: value,
        }));
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    async function deleteYouTubeSearchHistory() {
        try {
            await apiServerAxios.delete(`/youtube_search_history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedYouTubeHistoryData = await apiServerAxios.get(
                "/search_history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHistoryData(updatedYouTubeHistoryData.data);
            sessionStorage.setItem(
                "initial-history-data",
                JSON.stringify(updatedYouTubeHistoryData.data)
            );
            setMessage("YouTube search history deleted successfully!");
            setSeverity("success");
        } catch (error) {
            setMessage("Failed to delete YouTube search history.");
            setSeverity("error");
            console.error(error);
            throw error;
        }
        setOpen(true);
    }

    async function deleteGoogleSearchHistory() {
        try {
            await apiServerAxios.delete("/google_search_history", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedHistoryData = await apiServerAxios.get(
                "/search_history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHistoryData(updatedHistoryData.data);
            sessionStorage.setItem(
                "initial-history-data",
                JSON.stringify(updatedHistoryData.data)
            );
            setMessage("Google search history deleted successfully!");
            setSeverity("success");
        } catch (error) {
            setMessage("Failed to delete google search history.");
            setSeverity("error");
            console.error(error);
            throw error;
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    if (isLoading)
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
                padding: 3,
                backgroundColor: theme.bg,
                minHeight: "100vh",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <Box
                component="section"
                sx={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    backgroundColor: theme.bg,
                    borderRadius: "16px",
                    padding: 3,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
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
                    Mindfulness Resources
                </Typography>

                <CustomTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                >
                    <CustomTab label="YouTube Videos" />
                    <CustomTab label="Google Articles" />
                </CustomTabs>

                {tabValue === 0 && (
                    <Box>
                        <Box
                            component="form"
                            onSubmit={youTubeSearch}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: { xs: 3, sm: 7 },
                                mb: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: { xs: 2, sm: 5 },
                                    width: { xs: "100%", sm: "50%" },
                                }}
                            >
                                <TextField
                                    id="YouTube Search"
                                    label="Search YouTube"
                                    type="search"
                                    name="query"
                                    value={youTubeSearchQuery.query}
                                    variant="outlined"
                                    onChange={handleYouTubeInputsChange}
                                    sx={{ 
                                        width: "50%",
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: theme.bg,
                                        }
                                    }}
                                />
                                <FormControl sx={{ width: "50%" }}>
                                    <InputLabel id="routine-exercise">
                                        Exercise Type
                                    </InputLabel>
                                    <Select
                                        labelId="routine-exercise"
                                        id="demo-simple-select"
                                        name="type"
                                        value={youTubeSearchQuery.type}
                                        label="Exercise Type"
                                        onChange={handleYouTubeInputsChange}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: theme.bg,
                                        }}
                                    >
                                        <MenuItem value={"Meditation"}>
                                            Meditation
                                        </MenuItem>
                                        <MenuItem value={"Mindfulness"}>
                                            Mindfulness
                                        </MenuItem>
                                        <MenuItem value={"Stress Relief"}>
                                            Stress Relief
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <StyledButton
                                type="submit"
                                variant="contained"
                                sx={{
                                    width: { xs: "100%", sm: "30%" },
                                    maxWidth: { md: "150px" },
                                }}
                            >
                                Search
                            </StyledButton>
                        </Box>

                        <Box sx={{ pt: 2 }}>
                            {youtubeSearchData?.length === 0 && !isSearchInProgress && (
                                <Box>
                                    <Typography
                                        variant="h4"
                                        sx={{ 
                                            mb: 3, 
                                            fontWeight: 600,
                                            fontFamily: "'Poppins', sans-serif",
                                            color: theme.text,
                                        }}
                                    >
                                        Recommended Meditation Videos
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "repeat(2, 1fr)",
                                                md: "repeat(3, 1fr)",
                                                xl: "repeat(4, 1fr)",
                                            },
                                            gap: "24px",
                                        }}
                                    >
                                        {initialYouTubeData
                                            ?.slice(0, itemsToDisplay)
                                            .map((routine, index) => {
                                                const embedUrl =
                                                    routine.videoUrl.replace(
                                                        "watch?v=",
                                                        "embed/"
                                                    );
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: 2,
                                                            backgroundColor: theme.cardBg,
                                                            borderRadius: "12px",
                                                            overflow: "hidden",
                                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                            transition: "transform 0.3s",
                                                            "&:hover": {
                                                                transform: "translateY(-5px)",
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: "relative",
                                                                paddingTop: "56.25%", // 16:9 aspect ratio
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <iframe
                                                                src={embedUrl}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                title={routine.videoTitle}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    border: "none",
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        </Box>
                                                        <Box sx={{ p: 2 }}>
                                                            <Link
                                                                href={routine.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: theme.text,
                                                                    fontSize: "1.1rem",
                                                                    textDecoration: "none",
                                                                    "&:hover": {
                                                                        color: theme.accent,
                                                                    },
                                                                }}
                                                            >
                                                                {routine.videoTitle}
                                                            </Link>
                                                            <Typography
                                                                sx={{
                                                                    mt: 1,
                                                                    color: theme.secondaryText,
                                                                    fontSize: "0.9rem",
                                                                }}
                                                            >
                                                                {routine.description.split(".")[0]}...
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                    </Box>

                                    <Box sx={{ mt: 5 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 3,
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontFamily: "'Poppins', sans-serif",
                                                    color: theme.text,
                                                }}
                                            >
                                                Your Search History
                                            </Typography>
                                            <Box
                                                onClick={deleteYouTubeSearchHistory}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        color: theme.accent,
                                                    },
                                                }}
                                            >
                                                <RiDeleteBin6Line size={20} />
                                                <Typography variant="body2">
                                                    Clear History
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {historyData.filter(
                                            (data) => data.search_type === "youtube_search"
                                        )?.length > 0 ? (
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                        xs: "1fr",
                                                        sm: "repeat(2, 1fr)",
                                                        md: "repeat(3, 1fr)",
                                                        xl: "repeat(4, 1fr)",
                                                    },
                                                    gap: "24px",
                                                }}
                                            >
                                                {historyData
                                                    .filter(
                                                        (data) => data.search_type === "youtube_search"
                                                    )
                                                    .map((data, index) => {
                                                        const chosenIndex = data.queries.length - 1;
                                                        const embedUrl = data.queries[0].videoUrl.replace(
                                                            "watch?v=",
                                                            "embed/"
                                                        );
                                                        return (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    backgroundColor: theme.cardBg,
                                                                    borderRadius: "12px",
                                                                    overflow: "hidden",
                                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                                    transition: "transform 0.3s",
                                                                    "&:hover": {
                                                                        transform: "translateY(-5px)",
                                                                    },
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        position: "relative",
                                                                        paddingTop: "56.25%",
                                                                        overflow: "hidden",
                                                                    }}
                                                                >
                                                                    <iframe
                                                                        src={embedUrl}
                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                        allowFullScreen
                                                                        title={data.queries[chosenIndex].videoTitle}
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: "100%",
                                                                            height: "100%",
                                                                            border: "none",
                                                                        }}
                                                                        loading="lazy"
                                                                    />
                                                                </Box>
                                                                <Box sx={{ p: 2 }}>
                                                                    <Link
                                                                        href={data.queries[chosenIndex].videoUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            color: theme.text,
                                                                            fontSize: "1.1rem",
                                                                            textDecoration: "none",
                                                                            "&:hover": {
                                                                                color: theme.accent,
                                                                            },
                                                                        }}
                                                                    >
                                                                        {data.queries[chosenIndex].videoTitle}
                                                                    </Link>
                                                                    <Typography
                                                                        sx={{
                                                                            mt: 1,
                                                                            color: theme.secondaryText,
                                                                            fontSize: "0.9rem",
                                                                        }}
                                                                    >
                                                                        {data.queries[chosenIndex].description.split(".")[0]}...
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        );
                                                    })}
                                            </Box>
                                        ) : (
                                            <Typography 
                                                variant="h6"
                                                sx={{
                                                    color: theme.secondaryText,
                                                    textAlign: "center",
                                                    py: 4,
                                                }}
                                            >
                                                No search history available
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                            {isSearchInProgress && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "300px",
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
                            )}
                            {youtubeSearchData?.length > 0 && !isSearchInProgress && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{ 
                                            fontWeight: 600,
                                            fontFamily: "'Poppins', sans-serif",
                                            color: theme.text,
                                        }}
                                    >
                                        Search Results
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "repeat(2, 1fr)",
                                                md: "repeat(3, 1fr)",
                                                xl: "repeat(4, 1fr)",
                                            },
                                            gap: "24px",
                                        }}
                                    >
                                        {youtubeSearchData?.map(
                                            ({ description, videoUrl, videoTitle }, index) => {
                                                const embedUrl = videoUrl.replace(
                                                    "watch?v=",
                                                    "embed/"
                                                );
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            backgroundColor: theme.cardBg,
                                                            borderRadius: "12px",
                                                            overflow: "hidden",
                                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                            transition: "transform 0.3s",
                                                            "&:hover": {
                                                                transform: "translateY(-5px)",
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: "relative",
                                                                paddingTop: "56.25%",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <iframe
                                                                src={embedUrl}
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                title={videoTitle}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    border: "none",
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        </Box>
                                                        <Box sx={{ p: 2 }}>
                                                            <Link
                                                                href={videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: theme.text,
                                                                    fontSize: "1.1rem",
                                                                    textDecoration: "none",
                                                                    "&:hover": {
                                                                        color: theme.accent,
                                                                    },
                                                                }}
                                                            >
                                                                {videoTitle}
                                                            </Link>
                                                            <Typography
                                                                sx={{
                                                                    mt: 1,
                                                                    color: theme.secondaryText,
                                                                    fontSize: "0.9rem",
                                                                }}
                                                            >
                                                                {description.split(".")[0]}...
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            }
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box>
                        <Box
                            component="form"
                            onSubmit={googleSearch}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: { xs: 3, sm: 7 },
                                mb: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: { xs: 2, sm: 5 },
                                    width: { xs: "100%", sm: "50%" },
                                }}
                            >
                                <TextField
                                    id="Google Search"
                                    label="Search Google"
                                    type="search"
                                    name="query"
                                    value={googleSearchQuery.query}
                                    variant="outlined"
                                    onChange={handleGoogleInputsChange}
                                    sx={{ 
                                        width: "50%",
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: theme.bg,
                                        }
                                    }}
                                />
                                <FormControl sx={{ width: "50%" }}>
                                    <InputLabel id="routine-exercise">
                                        Exercise Type
                                    </InputLabel>
                                    <Select
                                        labelId="routine-exercise"
                                        id="demo-simple-select"
                                        name="type"
                                        value={googleSearchQuery.type}
                                        label="Exercise Type"
                                        onChange={handleGoogleInputsChange}
                                        sx={{
                                            borderRadius: '12px',
                                            backgroundColor: theme.bg,
                                        }}
                                    >
                                        <MenuItem value={"Meditation"}>
                                            Meditation
                                        </MenuItem>
                                        <MenuItem value={"Mindfulness"}>
                                            Mindfulness
                                        </MenuItem>
                                        <MenuItem value={"Stress Relief"}>
                                            Stress Relief
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <StyledButton
                                type="submit"
                                variant="contained"
                                sx={{
                                    width: { xs: "100%", sm: "30%" },
                                    maxWidth: { md: "150px" },
                                }}
                            >
                                Search
                            </StyledButton>
                        </Box>

                        <Box>
                            {googleSearchData.length === 0 && !isSearchInProgress && (
                                <Box>
                                    <Typography
                                        variant="h4"
                                        sx={{ 
                                            mb: 3,
                                            fontWeight: 600,
                                            fontFamily: "'Poppins', sans-serif",
                                            color: theme.text,
                                        }}
                                    >
                                        Recommended Mindfulness Articles
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "repeat(2, 1fr)",
                                                md: "repeat(3, 1fr)",
                                            },
                                            gap: "24px",
                                        }}
                                    >
                                        {initialGoogleData
                                            ?.slice(0, itemsToDisplay)
                                            .map((result, index) => {
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            backgroundColor: theme.cardBg,
                                                            borderRadius: "12px",
                                                            padding: 3,
                                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                            transition: "transform 0.3s",
                                                            "&:hover": {
                                                                transform: "translateY(-5px)",
                                                            },
                                                        }}
                                                    >
                                                        <Link
                                                            href={result.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: theme.text,
                                                                fontSize: "1.1rem",
                                                                textDecoration: "none",
                                                                "&:hover": {
                                                                    color: theme.accent,
                                                                },
                                                            }}
                                                        >
                                                            {result.title}
                                                        </Link>
                                                        <Typography
                                                            sx={{
                                                                mt: 2,
                                                                color: theme.secondaryText,
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            {result.snippet}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                    </Box>

                                    <Box sx={{ mt: 5 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 3,
                                            }}
                                        >
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontFamily: "'Poppins', sans-serif",
                                                    color: theme.text,
                                                }}
                                            >
                                                Your Search History
                                            </Typography>
                                            <Box
                                                onClick={deleteGoogleSearchHistory}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        color: theme.accent,
                                                    },
                                                }}
                                            >
                                                <RiDeleteBin6Line size={20} />
                                                <Typography variant="body2">
                                                    Clear History
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {historyData.filter(
                                            (data) => data.search_type === "google_search"
                                        )?.length > 0 ? (
                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                        xs: "1fr",
                                                        sm: "repeat(2, 1fr)",
                                                        md: "repeat(3, 1fr)",
                                                    },
                                                    gap: "24px",
                                                }}
                                            >
                                                {historyData
                                                    .filter(
                                                        (data) => data.search_type === "google_search"
                                                    )
                                                    .map((data, index) => {
                                                        const chosenIndex = data.queries.length - 1;
                                                        return (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    backgroundColor: theme.cardBg,
                                                                    borderRadius: "12px",
                                                                    padding: 3,
                                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                                    transition: "transform 0.3s",
                                                                    "&:hover": {
                                                                        transform: "translateY(-5px)",
                                                                    },
                                                                }}
                                                            >
                                                                <Link
                                                                    href={data.queries[0].link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        color: theme.text,
                                                                        fontSize: "1.1rem",
                                                                        textDecoration: "none",
                                                                        "&:hover": {
                                                                            color: theme.accent,
                                                                        },
                                                                    }}
                                                                >
                                                                    {data.queries[chosenIndex].title}
                                                                </Link>
                                                                <Typography
                                                                    sx={{
                                                                        mt: 2,
                                                                        color: theme.secondaryText,
                                                                        fontSize: "0.9rem",
                                                                    }}
                                                                >
                                                                    {data.queries[chosenIndex].snippet}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })}
                                            </Box>
                                        ) : (
                                            <Typography 
                                                variant="h6"
                                                sx={{
                                                    color: theme.secondaryText,
                                                    textAlign: "center",
                                                    py: 4,
                                                }}
                                            >
                                                No search history available
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                            {isSearchInProgress && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "300px",
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
                            )}
                            {googleSearchData?.length > 0 && !isSearchInProgress && (
                                <Box
                                    sx={{
                                        pt: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{ 
                                            fontWeight: 600,
                                            fontFamily: "'Poppins', sans-serif",
                                            color: theme.text,
                                        }}
                                    >
                                        Search Results
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                sm: "repeat(2, 1fr)",
                                            },
                                            gap: "24px",
                                        }}
                                    >
                                        {googleSearchData
                                            .splice(0, 6)
                                            .map((result, index) => {
                                                return (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            backgroundColor: theme.cardBg,
                                                            borderRadius: "12px",
                                                            padding: 3,
                                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                                            transition: "transform 0.3s",
                                                            "&:hover": {
                                                                transform: "translateY(-5px)",
                                                            },
                                                        }}
                                                    >
                                                        <Link
                                                            href={result.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: theme.text,
                                                                fontSize: "1.1rem",
                                                                textDecoration: "none",
                                                                "&:hover": {
                                                                    color: theme.accent,
                                                                },
                                                            }}
                                                        >
                                                            {result.title}
                                                        </Link>
                                                        <Typography
                                                            sx={{
                                                                mt: 2,
                                                                color: theme.secondaryText,
                                                                fontSize: "0.9rem",
                                                            }}
                                                        >
                                                            {result.snippet}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={handleClose}
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
            </Box>
        </Box>
    );
}

export default Routine;