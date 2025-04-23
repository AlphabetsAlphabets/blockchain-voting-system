import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#1a1a1a',
                color: '#ccc',
                py: 5,
                px: { xs: 3, md: 10 },
                borderTop: '1px solid #333',
                // mt: 10
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 4,
                    maxWidth: '1200px',
                    mx: 'auto'
                }}
            >
                {/* Brand */}
                <Typography variant="h6" fontWeight="bold" color="#fff">
                    The Line
                </Typography>

                {/* Nav Links */}
                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Link href="/elections" underline="hover" color="inherit">
                        Elections
                    </Link>
                    <Link href="/vote" underline="hover" color="inherit">
                        Vote Now
                    </Link>
                    <Link href="/how-it-works" underline="hover" color="inherit">
                        How It Works
                    </Link>
                </Box>

                {/* Socials */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener"
                        sx={{ color: '#ccc', '&:hover': { color: '#fff' } }}
                    >
                        <FacebookIcon />
                    </IconButton>
                    <IconButton
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener"
                        sx={{ color: '#ccc', '&:hover': { color: '#fff' } }}
                    >
                        <TwitterIcon />
                    </IconButton>
                    <IconButton
                        href="https://github.com"
                        target="_blank"
                        rel="noopener"
                        sx={{ color: '#ccc', '&:hover': { color: '#fff' } }}
                    >
                        <GitHubIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Bottom Text */}
            <Typography
                variant="body2"
                color="gray"
                align="center"
                sx={{ mt: 4 }}
            >
                © {new Date().getFullYear()} The Line. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
