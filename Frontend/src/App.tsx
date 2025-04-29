// App.tsx
import React from "react";
import { CssBaseline } from "@mui/material";
import Home from "./app/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VotingPage from "./app/votingPage/page";
import { DiscoverWalletProviders } from "./components/DiscoverWalletProviders";

function App() {
  return (
    <>
      <DiscoverWalletProviders />
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
