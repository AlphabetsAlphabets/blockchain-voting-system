import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton, Tabs, Tab } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis } from "recharts";
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Candidate } from '../types/electionTypes';

interface VoteCountDashboardProps {
    title: string;
    candidates: Candidate[];
    voteData: { name: string; votes: number }[];
    totalVotes: number;
}

const VoteCountDashboard: React.FC<VoteCountDashboardProps> = ({
    title,
    candidates,
    voteData,
    totalVotes
}) => {
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
    const [counters, setCounters] = useState<number[]>(voteData.map(() => 0));
    const [chartWidth, setChartWidth] = useState(0);

    // Colors for chart
    const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8884d8'];
    
    // Animate counters on load
    useEffect(() => {
        const interval = setInterval(() => {
            let completed = true;

            setCounters(prev =>
                prev.map((counter, index) => {
                    const target = voteData[index]?.votes || 0;
                    if (counter < target) {
                        completed = false;
                        return counter + Math.max(1, Math.ceil((target - counter) / 10));
                    }
                    return target;
                })
            );

            if (completed) clearInterval(interval);
        }, 50);

        return () => clearInterval(interval);
    }, [voteData]);

    // Set chart container width
    useEffect(() => {
        setChartWidth(window.innerWidth < 600 ? window.innerWidth - 64 : 500);

        const handleResize = () => {
            setChartWidth(window.innerWidth < 600 ? window.innerWidth - 64 : 500);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Format voteData for charts
    const chartData = voteData.map((item, index) => ({
        name: item.name,
        votes: item.votes,
        displayVotes: counters[index],
        color: COLORS[index % COLORS.length]
    }));

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper
                    sx={{
                        p: 2,
                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Typography sx={{ fontWeight: 'bold', color: payload[0].payload.color }}>
                        {payload[0].name}: {payload[0].value} votes
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {((payload[0].value / totalVotes) * 100).toFixed(1)}% of total
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: '#1f1f1f',
                mb: 4,
                overflow: 'hidden'
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
                Vote Results: {title}
            </Typography>

            {/* Vote count summary */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 4
                }}
            >
                <Paper
                    sx={{
                        flex: '1 1 200px',
                        p: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h3" fontWeight="bold" color="#00c896">
                        {totalVotes}
                    </Typography>
                    <Typography variant="body2" color="#aaa">
                        Total Votes Cast
                    </Typography>
                </Paper>

                {candidates.length > 0 && (
                    <Paper
                        sx={{
                            flex: '1 1 200px',
                            p: 2,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h3" fontWeight="bold" color="#3f51b5">
                            {candidates.length}
                        </Typography>
                        <Typography variant="body2" color="#aaa">
                            Candidates
                        </Typography>
                    </Paper>
                )}
            </Box>

            {/* Chart type selector */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(_, newValue) => {
                        if (newValue !== null) {
                            setChartType(newValue);
                        }
                    }}
                    aria-label="chart type"
                    sx={{
                        '& .MuiToggleButton-root': {
                            color: '#aaa',
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(0, 200, 150, 0.1)',
                                color: '#00c896'
                            }
                        }
                    }}
                >
                    <ToggleButton value="pie" aria-label="pie chart">
                        <DonutLargeIcon />
                    </ToggleButton>
                    <ToggleButton value="bar" aria-label="bar chart">
                        <BarChartIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Chart */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                height: 400,
                width: '100%',
                overflow: 'hidden',
            }}>
                {chartType === 'pie' ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="displayVotes"
                                nameKey="name"
                                label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                animationDuration={500}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value: string): React.ReactNode => <span style={{ color: '#ddd' }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 60,
                            }}
                        >
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                tick={{ fill: '#aaa' }}
                                height={70}
                            />
                            <YAxis tick={{ fill: '#aaa' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend formatter={(value: string): React.ReactNode => <span style={{ color: '#ddd' }}>{value}</span>} />
                            <Bar dataKey="displayVotes" name="Votes">
                                {chartData.map((entry: {
                                    name: string;
                                    votes: number;
                                    displayVotes: number;
                                    color: string;
                                }, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Paper>
    );
};

export default VoteCountDashboard;