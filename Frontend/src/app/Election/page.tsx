'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ethers, Contract } from 'ethers';
import FactoryABI from '../../ABI/ElectionFactoryABI.json';
import ElectionABI from '../../ABI/ElectionABI.json';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useWallet } from '../../components/WalletProvider';
import {
Box,
Container,
Typography,
TextField,
Button,
Paper,
Chip,
CircularProgress,
Alert,
Tab,
Tabs,
Divider,
IconButton,
Tooltip,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BallotIcon from '@mui/icons-material/Ballot';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Election } from '../../types/electionTypes';
import HostCard from '../../components/HostCard';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { styled } from '@mui/material/styles';

// Update this with your deployed factory address
const FACTORY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function ElectionsPage() {
    // Form state
    const [title, setTitle] = useState<string>('');
    const [proposals, setProposals] = useState<string>('');
    const [voters, setVoters] = useState<string>('');
    const [startDateTime, setStartDateTime] = useState<Dayjs | null>(
        dayjs().add(10, 'minute') // Default to 10 minutes from now
    );
    const [endDateTime, setEndDateTime] = useState<Dayjs | null>(
        dayjs().add(1, 'day') // Default to 1 day from now
    );
    const [tabValue, setTabValue] = useState<number>(0);

    // Elections state
    const [myElections, setMyElections] = useState<Election[]>([]);
    const [loadingElections, setLoadingElections] = useState<boolean>(true);

    // Use wallet context
    const { provider, signer, account } = useWallet();
    const [factoryContract, setFactoryContract] = useState<Contract | null>(null);

    // UI state
    const [status, setStatus] = useState<string>('');
    const [statusType, setStatusType] = useState<
        'success' | 'info' | 'warning' | 'error'
    >('info');
    const [loading, setLoading] = useState<boolean>(false);
    const [endingElection, setEndingElection] = useState<string | null>(null);

    // Initialize factory contract when wallet is connected
    useEffect(() => {
        const initContract = async () => {
            if (!signer) return;

            try {
                const factory = new ethers.Contract(
                    FACTORY_ADDRESS,
                    FactoryABI.abi,
                    signer
                );
                setFactoryContract(factory);
                setStatus('Connected to blockchain');
                setStatusType('info');
            } catch (err: any) {
                console.error('Contract initialization error:', err);
                setStatus(`Failed to initialize: ${err.message}`);
                setStatusType('error');
            }
        };

        initContract();
    }, [signer]);

    // Fetch elections created by the current user
    useEffect(() => {
        const fetchMyElections = async () => {
            if (!factoryContract || !account) {
                setLoadingElections(false);
                return;
            }

            setLoadingElections(true);

            try {
                // Get all election addresses
                const electionAddresses = await factoryContract.getAllElections();

                if (electionAddresses.length === 0) {
                    setLoadingElections(false);
                    return;
                }

                const userElections: Election[] = [];

                // Loop through each election to check if current user is the owner
                for (let i = 0; i < electionAddresses.length; i++) {
                    try {
                        // Get election details
                        const details = await factoryContract.getElectionDetails(i);

                        // Create election contract instance
                        const electionContract = new ethers.Contract(
                            details.electionAddress,
                            ElectionABI.abi,
                            signer
                        );

                        // Check if current user is the owner
                        const owner = await electionContract.owner();

                        if (owner.toLowerCase() === account.toLowerCase()) {
                            // Get proposals with votes
                            const rawProposals = await electionContract.getAllProposals();

                            const candidates = rawProposals.map((p: any, index: number) => ({
                                id: index + 1,
                                name: p.name,
                                image: '/candidate-placeholder.jpg',
                                votes: Number(p.votes),
                            }));

                            // Calculate total votes
                            interface Candidate {
                                id: number;
                                name: string;
                                image: string;
                                votes: number;
                            }

                            const totalVotes: number = candidates.reduce(
                                (sum: number, candidate: Candidate) =>
                                    sum + (candidate.votes || 0),
                                0
                            );

                            // Create election object
                            const election: Election = {
                                id: i + 1,
                                title: details.title,
                                candidates: candidates,
                                address: details.electionAddress,
                                ended: details.ended,
                                startTime: Number(details.startTime),
                                endTime: Number(details.endTime),
                                allowedVoters: details.allowedVoters,
                                // totalVotes: totalVotes
                            };

                            userElections.push(election);
                        }
                    } catch (err) {
                        console.error(`Error checking election at index ${i}:`, err);
                    }
                }

                setMyElections(userElections);
            } catch (err) {
                console.error('Error fetching elections:', err);
                setStatus('Failed to load your elections');
                setStatusType('error');
            } finally {
                setLoadingElections(false);
            }
        };

        fetchMyElections();
    }, [factoryContract, account, signer]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    // Handle form submission to create new election
    const handleElection = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!factoryContract) {
            setStatus('Contract not initialized');
            setStatusType('error');
            return;
        }

        if (!title || !proposals || !voters || !startDateTime || !endDateTime) {
            setStatus('Please fill all required fields');
            setStatusType('warning');
            return;
        }

        // Validate the dates
        const now = dayjs();

        // Check if start time is in the past
        if (startDateTime.isBefore(now)) {
            setStatus('Start time cannot be in the past');
            setStatusType('warning');
            return;
        }

        // Check if end time is after start time
        if (endDateTime.isBefore(startDateTime)) {
            setStatus('End time must be after start time');
            setStatusType('warning');
            return;
        }

        // Check if election duration is at least 1 hour
        if (endDateTime.diff(startDateTime, 'hour') < 1) {
            setStatus('Election must last at least 1 hour');
            setStatusType('warning');
            return;
        }

        setLoading(true);
        setStatus('Creating election...');
        setStatusType('info');

        try {
            const proposalArray = proposals.split(',').map((p) => p.trim());
            const voterArray = voters.split(',').map((v) => v.trim());
            // Convert to UNIX timestamps (seconds)
            const startTimestamp = Math.floor(startDateTime.valueOf() / 1000);
            const endTimestamp = Math.floor(endDateTime.valueOf() / 1000);

            // Create transaction
            const tx = await factoryContract.createElection(
                title,
                proposalArray,
                voterArray,
                startTimestamp,
                endTimestamp
            );

            setStatus(`Transaction submitted: ${tx.hash}`);
            setStatusType('info');

            // Wait for confirmation
            const receipt = await tx.wait();

            // Get the new election address from events
            let electionAddress = '';

            // Try to find event from logs
            try {
                const eventTopic = ethers.id(
                    'ElectionCreated(address,string,uint256,uint256)'
                );
                const event = receipt.logs.find(
                    (log: any) => log.topics[0] === eventTopic
                );

                if (event && factoryContract) {
                    const parsedLog = factoryContract.interface.parseLog({
                        topics: event.topics as string[],
                        data: event.data,
                    });

                    if (parsedLog && parsedLog.args) {
                        electionAddress = parsedLog.args[0];
                    }
                }
            } catch (err) {
                console.error('Error parsing event:', err);
            }

            // Fallback: get latest election
            if (!electionAddress && factoryContract) {
                try {
                    const count = await factoryContract.getElectionCount();
                    const details = await factoryContract.getElectionDetails(count - 1);
                    electionAddress = details.electionAddress;
                } catch (err) {
                    console.error('Error getting election details:', err);
                }
            }

            if (electionAddress) {
                setStatus(`Election created successfully at address ${electionAddress}. 
                         Voting will start ${startDateTime.format(
                    'MMM D, YYYY [at] h:mm A'
                )} 
                         and end ${endDateTime.format(
                    'MMM D, YYYY [at] h:mm A'
                )}`);
                setStatusType('success');

                // Refresh the elections list
                setMyElections((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        title: title,
                        candidates: proposalArray.map((name, index) => ({
                            id: index + 1,
                            name,
                            image: '/candidate-placeholder.jpg',
                            votes: 0,
                        })),
                        address: electionAddress,
                        ended: false,
                        startTime: startTimestamp,
                        endTime: endTimestamp,
                        allowedVoters: voterArray,
                        totalVotes: 0,
                    },
                ]);
            } else {
                setStatus('Election created but address not captured');
                setStatusType('warning');
            }

            // Reset form
            setTitle('');
            setProposals('');
            setVoters('');
            setStartDateTime(dayjs().add(10, 'minute'));
            setEndDateTime(dayjs().add(1, 'day'));
        } catch (err: any) {
            console.error('Error creating election:', err);

            // More user-friendly error message
            if (err.message.includes("unknown account")) {
                setStatus("Error: Please connect your MetaMask wallet");
            } else if (err.message.includes("insufficient funds")) {
                setStatus("Error: You don't have enough ETH to create an election");
            } else if (err.message.includes("user rejected")) {
                setStatus("Transaction rejected in MetaMask");
            } else {
                setStatus(`Error: ${err.message}`);
            }
            setStatusType('error');
        } finally {
            setLoading(false);
        }
    };

    // Add this function to handle file reading
    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    // Add this component inside your ElectionsPage component
    const Input = styled('input')({
        display: 'none',
    });

    // Handle ending an election
    const handleEndElection = async (
        electionAddress: string,
        electionId: number
    ) => {
        if (!signer) return;

        setEndingElection(electionAddress);

        try {
            // Create election contract instance
            const electionContract = new ethers.Contract(
                electionAddress,
                ElectionABI.abi,
                signer
            );

            // End the election
            const tx = await electionContract.endVote();

            setStatus(`Ending election... Transaction submitted`);
            setStatusType('info');

            // Wait for confirmation
            await tx.wait();

            // Update the local state
            setMyElections((prev) =>
                prev.map((election) =>
                    election.address === electionAddress
                        ? { ...election, ended: true }
                        : election
                )
            );

            setStatus(
                `Election "${myElections.find((e) => e.address === electionAddress)?.title
                }" ended successfully`
            );
            setStatusType('success');
        } catch (err: any) {
            console.error('Error ending election:', err);

            if (err.message.includes('user rejected')) {
                setStatus('Transaction rejected in MetaMask');
            } else {
                setStatus(`Error: ${err.message}`);
            }
            setStatusType('error');
        } finally {
            setEndingElection(null);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Add this function to your component (before the return statement)
    const calculatePeriod = (start: Dayjs, end: Dayjs) => {
        const diff = end.diff(start, 'minute');

        if (diff < 0) {
            return 'End time must be after start time';
        }

        if (diff < 60) {
            return `${diff} minutes`;
        }

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes > 0 ? `and ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''
                }`;
        }

        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;

        return `${days} day${days !== 1 ? 's' : ''} ${remainingHours > 0
                ? `and ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
                : ''
            }`;
    };

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                    color: '#fff',
                    px: { xs: 3, md: 8 },
                    py: { xs: 6, md: 10 },
                }}
            >
                <Navbar />
                <Container maxWidth="lg">
                    <Box textAlign="center" py={8}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 'bold',
                                mb: 3,
                                textShadow: '0 4px 6px rgba(0,0,0,0.3)',
                            }}
                        >
                            My Elections
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ maxWidth: 700, mx: 'auto', color: '#d1d1d1', mb: 4 }}
                        >
                            Create and manage your blockchain-based elections
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    px: { xs: 3, md: 6 },
                    backgroundColor: '#121212',
                    color: '#fff',
                    minHeight: '100vh',
                }}
            >
                <Container maxWidth="lg">
                    {/* Wallet Status */}
                    <Box mb={6} display="flex" justifyContent="center">
                        <Chip
                            icon={account ? <CheckCircleOutlineIcon /> : undefined}
                            label={
                                account
                                    ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                                    : 'Wallet Not Connected'
                            }
                            color={account ? 'success' : 'error'}
                            variant="outlined"
                            sx={{
                                fontSize: '1rem',
                                py: 2.5,
                                px: 1.5,
                                borderRadius: 3,
                                backgroundColor: account
                                    ? 'rgba(46, 196, 182, 0.1)'
                                    : 'rgba(244, 67, 54, 0.1)',
                            }}
                        />
                    </Box>

                    {/* Status Alert
                    {status && (
                        <Alert
                            severity={statusType}
                            sx={{
                                mb: 4,
                                borderRadius: 2,
                                backgroundColor: statusType === 'success' ? 'rgba(76, 175, 80, 0.1)' :
                                    statusType === 'error' ? 'rgba(244, 67, 54, 0.1)' :
                                        statusType === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                                color: statusType === 'success' ? '#4caf50' :
                                    statusType === 'error' ? '#f44336' :
                                        statusType === 'warning' ? '#ff9800' : '#2196f3',
                                border: '1px solid',
                                borderColor: statusType === 'success' ? 'rgba(76, 175, 80, 0.2)' :
                                    statusType === 'error' ? 'rgba(244, 67, 54, 0.2)' :
                                        statusType === 'warning' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                            }}
                            onClose={() => setStatus('')}
                        >
                            {status}
                        </Alert>
                    )} */}

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#00c896',
                                },
                                '& .MuiTab-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-selected': {
                                        color: '#00c896',
                                    },
                                },
                            }}
                        >
                            <Tab
                                icon={<HowToVoteIcon />}
                                iconPosition="start"
                                label="My Elections"
                                sx={{ fontSize: '1rem', textTransform: 'none' }}
                            />
                            <Tab
                                icon={<AddCircleIcon />}
                                iconPosition="start"
                                label="Create New Election"
                                sx={{ fontSize: '1rem', textTransform: 'none' }}
                            />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <Box role="tabpanel" hidden={tabValue !== 0}>
                        {tabValue === 0 && (
                            <Box>
                                <Typography variant="h5" fontWeight="bold" mb={4} color="white">
                                    Elections You Created
                                </Typography>

                                {loadingElections ? (
                                    <Box display="flex" justifyContent="center" py={6}>
                                        <CircularProgress size={40} sx={{ color: '#00c896' }} />
                                    </Box>
                                ) : myElections.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        {myElections.map((election) => (
                                            <Box
                                                key={election.address}
                                                sx={{
                                                    width: { xs: '100%', sm: 'calc(50% - 16px)', lg: 'calc(33.33% - 16px)' },
                                                    position: 'relative'
                                                }}
                                            >
                                                <HostCard
                                                    election={election}
                                                    isEnding={endingElection === election.address}
                                                    onEndElection={() => handleEndElection(election.address!, election.id)}
                                                    voteData={election.candidates.map(c => ({ name: c.name, votes: c.votes || 0 }))}
                                                // voterMetrics={{
                                                //     total: election.allowedVoters?.length || 0,
                                                //     // voted: election.totalVotes || 0
                                                // }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Box textAlign="center" py={6} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 4, p: 4 }}>
                                        <Typography variant="h6" color="#aaa" gutterBottom>
                                            You haven't created any elections yet
                                        </Typography>
                                        <Typography variant="body1" color="#aaa" mb={3}>
                                            Create your first election by clicking the "Create New Election" tab
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddCircleIcon />}
                                            onClick={() => setTabValue(1)}
                                            sx={{
                                                backgroundColor: "#00c896",
                                                px: 3,
                                                py: 1,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                "&:hover": {
                                                    backgroundColor: "#00e6ac",
                                                },
                                            }}
                                        >
                                            Create New Election
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Box role="tabpanel" hidden={tabValue !== 1}>
                        {tabValue === 1 && (
                            <Paper
                                elevation={3}
                                sx={{
                                    p: { xs: 3, md: 5 },
                                    borderRadius: 4,
                                    backgroundColor: '#1f1f1f',
                                    mb: 6,
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                }}
                            >
                                <Typography variant="h4" fontWeight="bold" mb={4} color="white">
                                    Create New Election
                                </Typography>

                                <Box component="form" onSubmit={handleElection} noValidate>
                                    <Box sx={{ mb: 4 }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <BallotIcon sx={{ color: '#00c896', mr: 1 }} />
                                            <Typography variant="h6" color="white">
                                                Election Title
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            placeholder="Presidential Election 2025"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            variant="outlined"
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.23)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#00c896',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00c896',
                                                    },
                                                    color: 'white',
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <HowToVoteIcon sx={{ color: '#00c896', mr: 1 }} />
                                            <Typography variant="h6" color="white">
                                                Candidates (comma-separated)
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Candidate A, Candidate B, Candidate C"
                                            value={proposals}
                                            onChange={(e) => setProposals(e.target.value)}
                                            variant="outlined"
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.23)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#00c896',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00c896',
                                                    },
                                                    color: 'white',
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 4, position: 'relative' }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <GroupIcon sx={{ color: '#00c896', mr: 1 }} />
                                            <Typography variant="h6" color="white">
                                                Voter Addresses (comma-separated)
                                            </Typography>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, 0x..."
                                            value={voters}
                                            onChange={(e) => setVoters(e.target.value)}
                                            variant="outlined"
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'rgba(255, 255, 255, 0.23)',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#00c896',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00c896',
                                                    },
                                                    color: 'white',
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />

                                        {/* File Upload Button */}
                                        <Box sx={{ position: 'absolute', bottom: '-20px', right: '10px', zIndex: 1 }}>
                                            <label htmlFor="upload-voters-file">
                                                <Input
                                                    id="upload-voters-file"
                                                    type="file"
                                                    accept=".txt"
                                                    onChange={async (e) => {
                                                        try {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            // Read the file
                                                            const content = await readFile(file);
                                                            // Process addresses: split by commas, newlines, or spaces and clean them
                                                            const addresses = content
                                                                .split(/[\n,\s]+/)
                                                                .map(addr => addr.trim())
                                                                .filter(addr => addr.startsWith('0x') && addr.length === 42);

                                                            if (addresses.length === 0) {
                                                                setStatus('No valid Ethereum addresses found in file');
                                                                setStatusType('warning');
                                                                return;
                                                            }

                                                            // Update the voters field with the parsed addresses
                                                            setVoters(addresses.join(', '));
                                                            setStatus(`Successfully imported ${addresses.length} voter addresses from ${file.name}`);
                                                            setStatusType('success');

                                                            // Reset the file input
                                                            e.target.value = '';
                                                        } catch (error) {
                                                            console.error('Error reading file:', error);
                                                            setStatus('Error reading file. Please try again.');
                                                            setStatusType('error');
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    component="span"
                                                    variant="contained"
                                                    onClick={handleButtonClick}
                                                    startIcon={<UploadFileIcon />}
                                                    sx={{
                                                        backgroundColor: "#00c896",
                                                        borderRadius: "24px",
                                                        padding: "8px 16px",
                                                        textTransform: "none",
                                                        boxShadow: "0 4px 12px rgba(0,200,150,0.3)",
                                                        "&:hover": {
                                                            backgroundColor: "#00e6ac",
                                                        },
                                                    }}
                                                >
                                                    Upload File
                                                </Button>
                                            </label>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 6 }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <EventIcon sx={{ color: '#00c896', mr: 1 }} />
                                            <Typography variant="h6" color="white">
                                                Election Schedule
                                            </Typography>
                                        </Box>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: { xs: 'column', md: 'row' },
                                                    gap: 2,
                                                }}
                                            >
                                                <Box sx={{ flex: 1 }}>
                                                    <DateTimePicker
                                                        label="Start Time"
                                                        value={startDateTime}
                                                        onChange={(newValue) => setStartDateTime(newValue)}
                                                        sx={{
                                                            width: '100%',
                                                            mt: 1,
                                                            '& .MuiPickersSectionList-root': {
                                                                color: '#aaa',
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: '#aaa',
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color: '#00c896',
                                                            },
                                                            '& .MuiPickersDay-root.Mui-selected': {
                                                                backgroundColor: '#00c896',
                                                            },
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <DateTimePicker
                                                        label="End Time"
                                                        value={endDateTime}
                                                        onChange={(newValue) => setEndDateTime(newValue)}
                                                        sx={{
                                                            width: '100%',
                                                            mt: 1,
                                                            '& .MuiPickersSectionList-root': {
                                                                color: '#aaa',
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: '#aaa',
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color: '#00c896',
                                                            },
                                                            '& .MuiPickersDay-root.Mui-selected': {
                                                                backgroundColor: '#00c896',
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </LocalizationProvider>

                                        {/* Time period info */}
                                        {startDateTime && endDateTime && (
                                            <Box sx={{ mt: 2, px: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    color={
                                                        dayjs(endDateTime).diff(
                                                            dayjs(startDateTime),
                                                            'hour'
                                                        ) < 1
                                                            ? '#f44336'
                                                            : '#00c896'
                                                    }
                                                >
                                                    Election period:{' '}
                                                    {calculatePeriod(startDateTime, endDateTime)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || !factoryContract || !account}
                                        startIcon={
                                            loading ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                <SendIcon />
                                            )
                                        }
                                        sx={{
                                            backgroundColor: '#00c896',
                                            px: 5,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            borderRadius: '30px',
                                            boxShadow: '0 4px 20px rgba(0,200,150,0.4)',
                                            textTransform: 'none',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#00e6ac',
                                                boxShadow: '0 6px 25px rgba(0,230,172,0.6)',
                                            },
                                            '&:disabled': {
                                                backgroundColor: 'rgba(0, 200, 150, 0.3)',
                                            },
                                        }}
                                    >
                                        {loading ? 'Creating...' : 'Create Election'}
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </Container>
            </Box>

            <Footer />
        </>
    );
}
