import React from "react";
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
} from "@mui/material";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';

const HowItWorks = () => {
    const steps = [
        {
            title: "Set Up Your Wallet",
            description: "Install a compatible blockchain wallet like MetaMask to connect to the voting system.",
            icon: <AccountBalanceWalletIcon sx={{ fontSize: 64, color: "#00c896" }} />,
            details: "Your wallet serves as your digital identity for secure authentication. It stores your private keys and allows you to interact with the blockchain."
        },
        {
            title: "Connect Your Wallet",
            description: "Click the wallet button in the navigation bar and select your preferred wallet provider.",
            icon: <PersonIcon sx={{ fontSize: 64, color: "#00c896" }} />,
            details: "When connecting, you'll be asked to sign a message verifying your identity. No personal information is shared or stored."
        },
        {
            title: "Select an Election",
            description: "Browse the list of active elections you're eligible to participate in.",
            icon: <HowToVoteIcon sx={{ fontSize: 64, color: "#00c896" }} />,
            details: "Only elections you're authorized to vote in will appear in your list. Each election displays its title, candidates, and voting deadline."
        },
        {
            title: "Cast Your Vote",
            description: "Select your preferred candidate and confirm your vote using your blockchain wallet.",
            icon: <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#00c896" }} />,
            details: "Your vote is encrypted and recorded on the blockchain as a transaction. You'll need to approve this transaction in your wallet. Voting costs a small amount of gas (network fee)."
        },
        {
            title: "Verify Your Vote",
            description: "You can independently verify that your vote was correctly recorded on the blockchain.",
            icon: <VerifiedUserIcon sx={{ fontSize: 64, color: "#00c896" }} />,
            details: "After voting, you'll receive a transaction confirmation. You can use this to verify your vote on any blockchain explorer."
        }
    ];

    const faqs = [
        {
            question: "What is a blockchain wallet?",
            answer: "A blockchain wallet is a digital tool that allows you to interact with blockchain networks. It stores your private keys which prove your ownership of digital assets and your identity on the blockchain. Popular wallets include MetaMask, Coinbase Wallet, and Trust Wallet."
        },
        {
            question: "Is my vote anonymous?",
            answer: "Your vote is pseudonymous, meaning it's tied to your blockchain address but not your personal identity. While the vote itself is visible on the blockchain (for transparency), it's not directly connected to your real-world identity unless you've publicly associated your wallet address with your identity."
        },
        {
            question: "Do I need to pay to vote?",
            answer: "Voting requires a small transaction fee (gas fee) to process your vote on the blockchain. These fees are typically very small and are used to compensate the network for processing your transaction."
        },
        {
            question: "What if I make a mistake while voting?",
            answer: "Before your vote is finalized, you'll be asked to confirm your selection. However, once a vote is submitted to the blockchain, it cannot be changed or retracted due to the immutable nature of blockchain technology."
        },
        {
            question: "How do I know if I'm eligible to vote in an election?",
            answer: "When you connect your wallet to the platform, you'll only see elections that you're eligible to participate in. Eligibility is determined by the election creator and might be based on various criteria depending on the election type."
        }
    ];

    const benefits = [
        {
            title: "Immutable Record",
            description: "Once cast, votes cannot be altered or deleted by anyone, ensuring vote integrity and preventing tampering."
        },
        {
            title: "Transparency",
            description: "All votes are publicly verifiable on the blockchain, allowing anyone to audit the election results without revealing personal identity."
        },
        {
            title: "Decentralization",
            description: "No single entity controls the voting system, eliminating central points of failure and reducing the risk of manipulation."
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                    color: "#fff",
                    px: { xs: 3, md: 8 },
                    py: { xs: 6, md: 10 }
                }}
            >
                <Navbar />
                <Container maxWidth="lg">
                    <Box textAlign="center" py={8}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: "bold",
                                mb: 3,
                                textShadow: "0 4px 6px rgba(0,0,0,0.3)"
                            }}
                        >
                            How It Works
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ maxWidth: 700, mx: "auto", color: "#d1d1d1", mb: 4 }}
                        >
                            Our blockchain voting system combines cutting-edge security with
                            ease of use, ensuring your vote is counted accurately and transparently.
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Voting Process Flow */}
            <Box
                sx={{
                    py: { xs: 10, md: 14 },
                    px: { xs: 3, md: 6 },
                    backgroundColor: '#121212',
                    color: '#fff',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
                        The Voting Process
                    </Typography>
                    <Typography
                        variant="body1"
                        color="gray"
                        maxWidth="700px"
                        mx="auto"
                        mb={8}
                        textAlign="center"
                    >
                        Follow these simple steps to cast your secure vote on the blockchain
                    </Typography>

                    {/* Flexbox layout for steps instead of Grid */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 3, md: 6 },
                        justifyContent: 'center'
                    }}>
                        {steps.map((step, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.33% - 32px)' },
                                    minWidth: { xs: '100%', sm: '280px', md: '280px' }
                                }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        backgroundColor: '#1f1f1f',
                                        borderRadius: 4,
                                        color: '#fff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        "&:hover": {
                                            transform: 'translateY(-6px)',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                        <Box sx={{ mb: 3 }}>
                                            {step.icon}
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                                            {index + 1}. {step.title}
                                        </Typography>
                                        <Typography variant="body1" mb={2} color="#d1d1d1">
                                            {step.description}
                                        </Typography>
                                        <Typography variant="body2" color="gray">
                                            {step.details}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Wallet Information */}
            <Box
                sx={{
                    py: { xs: 10, md: 14 },
                    px: { xs: 3, md: 6 },
                    backgroundColor: '#0f1922',
                    color: '#fff',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 6,
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            width: { xs: '100%', md: '50%' },
                            order: { xs: 2, md: 1 }
                        }}>
                            <Box component="img" 
                                src="/wallet_illustration.png" 
                                alt="Blockchain Wallet"
                                sx={{ 
                                    width: '100%', 
                                    maxWidth: 500, 
                                    mx: 'auto', 
                                    display: 'block', 
                                    borderRadius: 4 
                                }} 
                            />
                        </Box>

                        <Box sx={{
                            width: { xs: '100%', md: '50%' },
                            order: { xs: 1, md: 2 }
                        }}>
                            <Typography variant="h4" fontWeight="bold" mb={4}>
                                Why You Need a Wallet
                            </Typography>
                            <Typography variant="body1" mb={4} color="#d1d1d1">
                                A blockchain wallet is essential for participating in secure digital voting.
                                It serves as your digital identity and enables you to:
                            </Typography>

                            <List>
                                <ListItem sx={{ pl: 0, py: 2 }}>
                                    <ListItemIcon>
                                        <SecurityIcon sx={{ color: '#00c896' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Securely authenticate your identity"
                                        secondary="Without sharing personal information"
                                        secondaryTypographyProps={{ color: 'gray' }}
                                    />
                                </ListItem>
                                <ListItem sx={{ pl: 0, py: 2 }}>
                                    <ListItemIcon>
                                        <LockIcon sx={{ color: '#00c896' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Cast tamper-proof votes"
                                        secondary="Guaranteed by blockchain cryptography"
                                        secondaryTypographyProps={{ color: 'gray' }}
                                    />
                                </ListItem>
                                <ListItem sx={{ pl: 0, py: 2 }}>
                                    <ListItemIcon>
                                        <VerifiedUserIcon sx={{ color: '#00c896' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Verify your vote was counted"
                                        secondary="With full transparency and audibility"
                                        secondaryTypographyProps={{ color: 'gray' }}
                                    />
                                </ListItem>
                            </List>

                            <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
                                Don't have a wallet?
                            </Typography>

                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                href="https://metamask.io/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    backgroundColor: "#00c896",
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "1rem",
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
                                Get MetaMask Wallet
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Security Benefits */}
            <Box
                sx={{
                    py: { xs: 10, md: 14 },
                    px: { xs: 3, md: 6 },
                    backgroundColor: '#121212',
                    color: '#fff',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
                        Blockchain Voting Benefits
                    </Typography>

                    {/* Flexbox for benefits cards instead of Grid */}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'center'
                    }}>
                        {benefits.map((benefit, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
                                    minWidth: { xs: '100%', sm: '280px', md: '280px' },
                                    display: 'flex'
                                }}
                            >
                                <Card
                                    sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: '#1f1f1f',
                                        borderRadius: 4,
                                        color: '#fff',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                                            {benefit.title}
                                        </Typography>
                                        <Typography variant="body2" color="#d1d1d1">
                                            {benefit.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* FAQs */}
            <Box
                sx={{
                    py: { xs: 10, md: 14 },
                    px: { xs: 3, md: 6 },
                    backgroundColor: '#0f1922',
                    color: '#fff',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
                        Frequently Asked Questions
                    </Typography>

                    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                        <Stack spacing={2}>
                            {faqs.map((faq, index) => (
                                <Accordion
                                    key={index}
                                    sx={{
                                        background: '#1f1f1f',
                                        color: '#fff',
                                        borderRadius: '8px',
                                        '&:before': {
                                            display: 'none',
                                        },
                                        overflow: 'hidden'
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#00c896' }} />}
                                        sx={{
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 200, 150, 0.1)',
                                            }
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="medium">{faq.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography color="#d1d1d1">{faq.answer}</Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Call to Action */}
            <Box
                sx={{
                    py: 10,
                    px: { xs: 3, md: 6 },
                    backgroundColor: '#121212',
                    color: '#fff',
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h4" fontWeight="bold" mb={3}>
                        Ready to Cast Your Vote?
                    </Typography>
                    <Typography variant="body1" color="#d1d1d1" mb={5} maxWidth={600} mx="auto">
                        Join our blockchain voting platform today for secure, transparent, and
                        efficient voting. Your voice matters—make it count.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            href="/votingPage"
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
                            Vote Now
                        </Button>

                        <Button
                            variant="outlined"
                            href="https://metamask.io/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                borderColor: "#00c896",
                                color: "#00c896",
                                px: 5,
                                py: 1.5,
                                fontSize: "1.1rem",
                                borderRadius: "30px",
                                textTransform: "none",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                    borderColor: "#00e6ac",
                                    backgroundColor: "rgba(0,200,150,0.1)",
                                }
                            }}
                        >
                            Get a Wallet
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Footer />
        </>
    );
};

export default HowItWorks;