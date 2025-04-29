// App.tsx
import React from 'react';
import { CssBaseline } from '@mui/material';
import Home from './app/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VotingPage from './app/votingPage/page';


function App() {
    return (

        <>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/votingPage" element={<VotingPage />} />
                </Routes>
            </Router>
        </>

    );
}

export default App;



