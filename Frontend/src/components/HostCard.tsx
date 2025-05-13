import React, { useState } from 'react';
import { Box, Typography, Paper, Chip, LinearProgress, Button, CircularProgress, Collapse } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Election, Proposal } from '../types/electionTypes';
import VoteCountDashboard from './VoteCountDashboard';

interface HostCardProps {
    election: Election;
    isEnding: boolean;
    onEndElection: () => void;
    voteData?: Proposal[]; // Vote data for results display
    voterMetrics?: { total: number; voted: number }; // Voter metrics
}

const HostCard: React.FC<HostCardProps> = ({
    election,
    isEnding,
    onEndElection,
    voteData = [],
    voterMetrics = { total: 0, voted: 0 }
}) => {
    // Add state to track if results are being viewed
    const [viewingResults, setViewingResults] = useState(false);

    // Calculate time remaining
    const now = Math.floor(Date.now() / 1000);
    const endTime = election.endTime || now + 86400; // Default to 24 hours if not set
    const startTime = election.startTime || now;
    const totalDuration = endTime - startTime;
    const timeElapsed = now - startTime;
    const timeRemaining = endTime - now;

    // Calculate percentage of time elapsed
    const progressPercentage = Math.min(100, Math.max(0, (timeElapsed / totalDuration) * 100));

    // Determine status
    let status: 'active' | 'ending' | 'ended' | 'upcoming' = 'active';
    if (election.ended) {
        status = 'ended';
    } else if (timeRemaining < 0) {
        status = 'ended';
    } else if (timeRemaining < 3600 * 3) { // Less than 3 hours
        status = 'ending';
    } else if (now < startTime) {
        status = 'upcoming';
    }

    // Format time remaining
    const formatTimeRemaining = () => {
        if (status === 'ended') return 'Voting closed';
        if (status === 'upcoming') return 'Starts soon';

        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''} remaining`;
        }

        return `${hours}h ${minutes}m remaining`;
    };

    // Status colors
    const statusColors = {
        active: '#00c896',
        ending: '#ff9800',
        ended: '#9e9e9e',
        upcoming: '#2196f3'
    };

    // Status labels
    const statusLabels = {
        active: 'Active',
        ending: 'Ending Soon',
        ended: 'Ended',
        upcoming: 'Upcoming'
    };

    // Calculate total votes
    const totalVotes = voteData.reduce((sum, p) => sum + p.votes, 0);

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                color: '#ffffff',
                borderRadius: 4,
                backgroundColor: '#1f1f1f',
                position: 'relative',
                transition: 'all 0.3s ease',
            }}
        >
            {/* Status indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1
                }}
            >
                <Chip
                    label={statusLabels[status]}
                    sx={{
                        backgroundColor: `${statusColors[status]}20`,
                        color: statusColors[status],
                        fontWeight: 'bold',
                    }}
                />
            </Box>

            {/* Election title */}
            <Box sx={{ mb: 2, pr: 8 }}>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        color: '#fff',
                    }}
                >
                    {election.title}
                </Typography>
            </Box>

            {/* Address */}
            <Typography
                variant="body2"
                sx={{
                    mb: 2,
                    color: '#aaa',
                    wordBreak: 'break-all'
                }}
            >
                Address: {election.address}
            </Typography>

            {/* Candidates and votes */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="body2"
                    sx={{
                        mb: 1,
                        color: '#aaa'
                    }}
                >
                    {election.candidates.length} candidate{election.candidates.length !== 1 ? 's' : ''}
                    {totalVotes > 0 && ` • ${totalVotes} vote${totalVotes !== 1 ? 's' : ''} cast`}
                </Typography>

                <Box sx={{
                    maxHeight: '100px',
                    overflowY: 'auto',
                    p: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 1
                }}>
                    {election.candidates.map((candidate) => (
                        <Box key={candidate.id} sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 0.5
                        }}>
                            <Typography variant="body2" color="#fff">
                                {candidate.name}
                            </Typography>
                            <Typography variant="body2" color="#00c896" fontWeight="medium">
                                {candidate.votes || 0} votes
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Time progress bar */}
            <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="#fff">
                        {new Date(startTime * 1000).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="#fff">
                        {new Date(endTime * 1000).toLocaleDateString()}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: status === 'ended' ? '#9e9e9e' :
                                status === 'ending' ? '#ff9800' : '#00c896',
                        }
                    }}
                />
            </Box>

            {/* Time info */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="body2"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#fff',
                        mb: 0.5
                    }}
                >
                    <AccessTimeIcon fontSize="small" />
                    Created: {new Date(startTime * 1000).toLocaleString()}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: election.ended ? '#9e9e9e' : statusColors[status],
                    }}
                >
                    <AccessTimeIcon fontSize="small" />
                    {election.ended ? 'Ended' : 'Ends'}: {new Date(endTime * 1000).toLocaleString()}
                </Typography>
            </Box>

            {/* Results View Collapse Section */}
            <Collapse in={viewingResults} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2, mb: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#4dabf5'
                        }}
                    >
                        Election Results
                    </Typography>

                    {voteData.length > 0 ? (
                        <>
                            <VoteCountDashboard
                                title={election.title}
                                candidates={election.candidates}
                                voteData={voteData}
                                totalVotes={totalVotes}
                            />

                            
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 3, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                            <Typography variant="body1" color="#aaa">
                                No voting data available
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* End Button (only for active elections) */}
                {!election.ended && status !== 'ended' && (
                    <Button
                        variant="contained"
                        startIcon={isEnding ?
                            <CircularProgress size={20} color="inherit" /> :
                            <StopCircleIcon />
                        }
                        fullWidth
                        onClick={onEndElection}
                        disabled={isEnding}
                        sx={{
                            backgroundColor: "#f44336",
                            color: "#fff",
                            py: 1,
                            borderRadius: 2,
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "#d32f2f",
                            },
                        }}
                    >
                        {isEnding ? 'Ending...' : 'End Election'}
                    </Button>
                )}

                {/* View Results Button */}
                <Button
                    variant="outlined"
                    startIcon={viewingResults ? <ExpandLessIcon /> : <VisibilityIcon />}
                    fullWidth
                    onClick={() => setViewingResults(!viewingResults)}
                    sx={{
                        color: "#4dabf5",
                        borderColor: "#4dabf5",
                        py: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                            borderColor: "#2196f3",
                            backgroundColor: "rgba(33, 150, 243, 0.08)",
                        },
                    }}
                >
                    {viewingResults ? 'Hide Results' : 'View Results'}
                </Button>
            </Box>
        </Paper>
    );
};

export default HostCard;