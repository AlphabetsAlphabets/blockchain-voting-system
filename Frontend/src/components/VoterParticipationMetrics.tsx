import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonOffIcon from '@mui/icons-material/PersonOff';

interface VoterParticipationMetricsProps {
    totalVoters: number;
    votedCount: number;
    electionTitle: string;
}

const VoterParticipationMetrics: React.FC<VoterParticipationMetricsProps> = ({
    totalVoters,
    votedCount,
    electionTitle
}) => {
    // Calculate participation rate
    const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: '#1f1f1f',
                mb: 4
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                    mb: 3,
                    color: '#fff'
                }}
            >
                Voter Participation: {electionTitle}
            </Typography>

            {/* Participation circle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={180}
                        thickness={4}
                        sx={{ color: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={participationRate}
                        size={180}
                        thickness={4}
                        sx={{
                            color: participationRate > 75 ? '#4caf50' :
                                participationRate > 50 ? '#2196f3' :
                                    participationRate > 25 ? '#ff9800' : '#f44336',
                            position: 'absolute',
                            left: 0,
                        }}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="div"
                            fontWeight="bold"
                            color="#fff"
                        >
                            {Math.round(participationRate)}%
                        </Typography>
                        <Typography
                            variant="body2"
                            component="div"
                            color="#aaa"
                        >
                            Participation
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Metrics grid */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center'
                }}
            >
                <Paper
                    sx={{
                        flex: '1 1 160px',
                        p: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <PeopleAltIcon sx={{ color: '#2196f3', fontSize: 36 }} />
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="#fff">
                            {totalVoters}
                        </Typography>
                        <Typography variant="body2" color="#aaa">
                            Eligible Voters
                        </Typography>
                    </Box>
                </Paper>

                <Paper
                    sx={{
                        flex: '1 1 160px',
                        p: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <HowToVoteIcon sx={{ color: '#4caf50', fontSize: 36 }} />
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="#fff">
                            {votedCount}
                        </Typography>
                        <Typography variant="body2" color="#aaa">
                            Votes Cast
                        </Typography>
                    </Box>
                </Paper>

                <Paper
                    sx={{
                        flex: '1 1 160px',
                        p: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <PersonOffIcon sx={{ color: '#f44336', fontSize: 36 }} />
                    <Box>
                        <Typography variant="h5" fontWeight="bold" color="#fff">
                            {totalVoters - votedCount}
                        </Typography>
                        <Typography variant="body2" color="#aaa">
                            Not Voted
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Paper>
    );
};

export default VoterParticipationMetrics;