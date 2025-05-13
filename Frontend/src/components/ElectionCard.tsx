import React from 'react';
import { Box, Typography, Paper, Chip, LinearProgress, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Election } from '../types/electionTypes';

interface ElectionCardProps {
    election: Election;
    alreadyVoted: boolean;
    onSelect: () => void;
    onViewDetails: () => void; // New prop for viewing details
    totalVoters: number;
    votedCount: number;
    notStarted?: boolean; // New prop to indicate if election hasn't started yet
}

const ElectionCard: React.FC<ElectionCardProps> = ({
    election,
    alreadyVoted,
    onSelect,
    onViewDetails, // New prop
    totalVoters,
    votedCount,
    notStarted = false // Default to false
}) => {
    // Calculate time remaining
    const now = Math.floor(Date.now() / 1000);
    const endTime = election.endTime || now + 86400; // Default to 24 hours if not set
    const startTime = election.startTime || now;
    const totalDuration = endTime - startTime;
    const timeElapsed = now - startTime;
    const timeRemaining = endTime - now;

    // Calculate percentage of time elapsed
    const progressPercentage = Math.min(100, Math.max(0, (timeElapsed / totalDuration) * 100));

    // Calculate participation rate
    const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

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

    // Is the election ended (either by contract flag or by time)
    const isEnded = status === 'ended';

    // Format time remaining
    const formatTimeRemaining = () => {
        if (status === 'ended') return 'Voting closed';
        if (status === 'upcoming') return `Starts ${new Date(startTime * 1000).toLocaleString()}`;

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

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                color: '#ffffff',
                borderRadius: 4,
                backgroundColor: '#1f1f1f',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: isEnded || alreadyVoted || notStarted ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
                mb: 3,
                '&:hover': {
                    transform: isEnded || alreadyVoted ? 'none' : 'translateY(-4px)',
                    boxShadow: isEnded || alreadyVoted ? 3 : '0 8px 24px rgba(0,0,0,0.15)',
                },
                opacity: isEnded || alreadyVoted || notStarted ? 0.9 : 1,
                border: isEnded || alreadyVoted ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
            onClick={() => !isEnded && !alreadyVoted && !notStarted && onSelect()}
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
                    label={notStarted ? "Not Started" : statusLabels[status]}
                    sx={{
                        backgroundColor: notStarted ? 'rgba(33, 150, 243, 0.2)' : `${statusColors[status]}20`,
                        color: notStarted ? '#2196f3' : statusColors[status],
                        fontWeight: 'bold',
                    }}
                />
            </Box>

            {/* Voted indicator and Election title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pr: 8 }}>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{
                        color: '#fff',
                        mr: 1
                    }}
                >
                    {election.title}
                </Typography>

                {alreadyVoted && (
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="You Voted"
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            color: '#4caf50',
                            fontWeight: 'medium',
                            '& .MuiChip-icon': {
                                color: '#4caf50'
                            }
                        }}
                    />
                )}
            </Box>

            {/* Candidates count */}
            <Typography
                variant="body2"
                sx={{
                    mb: 3,
                    color: '#aaa'
                }}
            >
                {election.candidates.length} candidate{election.candidates.length !== 1 ? 's' : ''}
            </Typography>

            {/* Time progress */}
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

            {/* Time remaining */}
            <Typography
                variant="body2"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: status === 'ended' ? '#9e9e9e' :
                        status === 'ending' ? '#ff9800' : '#00c896',
                    mb: isEnded ? 3 : 1.5 // More margin if we don't have the button
                }}
            >
                <AccessTimeIcon fontSize="small" />
                {formatTimeRemaining()}
            </Typography>

            {/* View Details Button - only for ended elections */}
            {isEnded && (
                <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent parent onClick from firing
                        onViewDetails();
                    }}
                    sx={{
                        color: "#4dabf5",
                        borderColor: "#4dabf5",
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": {
                            borderColor: "#2196f3",
                            backgroundColor: "rgba(33, 150, 243, 0.08)",
                        },
                    }}
                >
                    View Results
                </Button>
            )}

            {/* Add countdown to start if not started
            {notStarted && (
                <Typography
                    variant="body2"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#2196f3',
                        mt: 2
                    }}
                >
                    <AccessTimeIcon fontSize="small" />
                    Starts: {new Date(startTime * 1000).toLocaleString()}
                </Typography>
            )} */}
        </Paper>
    );
};

export default ElectionCard;