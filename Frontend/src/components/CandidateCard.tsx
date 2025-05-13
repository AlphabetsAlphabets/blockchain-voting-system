import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Candidate } from '../types/electionTypes';

interface CandidateCardProps {
    candidate: Candidate;
    isSelected: boolean;
    onSelect: () => void;
    voteCount?: number;
    totalVotes?: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
    candidate,
    isSelected,
    onSelect,
    voteCount = 0,
    totalVotes = 0
}) => {
    // Generate initials for the avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    // Calculate percentage of votes
    const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

    // Generate a consistent color based on candidate name
    const getAvatarColor = (name: string) => {
        const colors = [
            '#f44336', '#e91e63', '#9c27b0', '#673ab7',
            '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
            '#009688', '#4caf50', '#8bc34a', '#cddc39',
            '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Paper
            elevation={isSelected ? 6 : 2}
            sx={{
                p: 3,
                borderRadius: 2.5, // Slightly less rounded corners for a cleaner look
                backgroundColor: isSelected ? 'rgba(0, 200, 150, 0.08)' : '#1a1a1a', // Slightly darker for contrast
                borderBottom: isSelected ? '3px solid #00c896' : '3px solid transparent',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                boxShadow: isSelected
                    ? '0 6px 20px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 200, 150, 0.2)'
                    : '0 2px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                    transform: isSelected ? 'translateY(-4px)' : 'translateY(-2px)',
                    boxShadow: isSelected
                        ? '0 6px 20px rgba(0, 0, 0, 0.25), 0 3px 6px rgba(0, 200, 150, 0.2)'
                        : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    borderBottom: isSelected ? '3px solid #00c896' : '3px solid rgba(255, 255, 255, 0.1)',
                },
            }}
            onClick={onSelect}
        >
            {/* Candidate Avatar */}
            <Avatar
                src={candidate.image}
                alt={candidate.name}
                sx={{
                    width: 90, // Slightly smaller for better proportions
                    height: 90,
                    my: 1, // More consistent vertical spacing
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    backgroundColor: getAvatarColor(candidate.name),
                    border: isSelected
                        ? '3px solid #00c896'
                        : '3px solid rgba(255,255,255,0.08)',
                    boxShadow: isSelected
                        ? '0 0 12px rgba(0, 200, 150, 0.4)'
                        : 'none',
                    transition: 'all 0.2s ease',
                }}
            >
                {getInitials(candidate.name)}
            </Avatar>

            {/* Candidate Name */}
            <Typography
                variant="h6"
                component="h3"
                fontWeight="medium"
                sx={{
                    mt: 2,
                    color: isSelected ? '#00c896' : '#fff',
                    transition: 'color 0.2s ease',
                    fontSize: '1.1rem', // Slightly smaller for better proportions
                    lineHeight: 1.3,
                }}
            >
                {candidate.name}
            </Typography>
        </Paper>
    );
};

export default CandidateCard;