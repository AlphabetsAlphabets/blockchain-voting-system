import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const actions = [
    {
        title: 'Register Yourself',
        img: "/register.png",
        description: 'Create your verified identity to participate securely in elections.'
    },
    {
        title: 'Vote Now',
        img: "/online-electronic-voting.png", // Add actual image paths
        description: 'Cast your vote with confidence and transparency in real-time.'
    },
    {
        title: 'Host Election',
        img: "/host-election.png", // Add actual image paths
        description: 'Create, manage, and monitor elections using blockchain technology.'
    }
];

const Home = () => {
    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: "90vh",
                    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                    color: "#fff",
                    px: { xs: 3, md: 8 },
                    py: { xs: 6, md: 2 }
                }}
            >
                <Navbar />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        maxWidth: "1200px",
                        mx: "auto",
                        py: 8,
                        gap: 6
                    }}
                >
                    {/* Left: Text + CTA */}
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: "bold",
                                mb: 3,
                                textShadow: "0 4px 6px rgba(0,0,0,0.3)"
                            }}
                        >
                            VOTE NOW SECURELY
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ maxWidth: 500, color: "#d1d1d1", mb: 4 }}
                        >
                            Transparent. Immutable. Trusted. Our blockchain-based platform guarantees secure digital elections, ensuring every voice is counted.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#00c896",
                                px: 5,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: "30px",
                                boxShadow: "0 4px 20px rgba(0,200,150,0.4)",
                                textTransform: "none",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                    backgroundColor: "#00e6ac",
                                    boxShadow: "0 6px 25px rgba(0,230,172,0.6)"
                                }
                            }}
                        >
                            Start Voting
                        </Button>
                    </Box>

                    {/* Right: Illustration */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Box
                            component="img"
                            src="/vote-illustrate-2.png"
                            alt="Blockchain Voting Illustration"
                            sx={{
                                width: "100%",
                                maxWidth: 500,
                                mx: "auto"
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Host and Vote Easily Section */}
            <Box
                sx={{
                    py: { xs: 10, md: 14 },
                    px: { xs: 3, md: 10 },
                    backgroundColor: '#121212',
                    color: '#fff',
                    textAlign: 'center',
                    height: '80vh'
                }}
            >
                <Typography variant="h4" fontWeight="bold" mb={2}>
                    Host and Vote Easily
                </Typography>
                <Typography
                    variant="body1"
                    color="gray"
                    maxWidth="700px"
                    mx="auto"
                    mb={8}
                >
                    Whether you're organizing an election or participating as a voter, our platform simplifies the entire process with unmatched security and ease.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        maxWidth: '1200px',
                        mx: 'auto'
                    }}
                >
                    {actions.map((action, index) => (
                        <Card
                            key={index}
                            sx={{
                                flex: 1,
                                backgroundColor: '#1f1f1f',
                                borderRadius: 4,
                                overflow: 'hidden',
                                color: '#fff',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                "&:hover": {
                                    transform: 'translateY(-6px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                }
                            }}
                        >
                            {action.img && (
                                <Box
                                    component="img"
                                    src={action.img}
                                    alt={action.title}
                                    sx={{
                                        width: '100%',
                                        height: 180,
                                        objectFit: 'cover'
                                    }}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {action.title}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    {action.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
            <Footer />
        </>
    );
};

export default Home;
