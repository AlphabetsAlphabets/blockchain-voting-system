// App.tsx
import React from "react";
import { CssBaseline } from "@mui/material";
import Home from "./app/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VotingPage from "./app/votingPage/page";
import { DiscoverWalletProviders } from "./components/DiscoverWalletProviders";
import ElectionPage from "./app/Election/page";
import { WalletProvider } from "./components/WalletProvider";
import HowItWorks from "./app/howItWorks/page";

function App() {
  return (
    <>
      <CssBaseline />
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/votingPage" element={<VotingPage />} />
            <Route path="/Election" element={<ElectionPage />} />
            <Route path="/howItWorks" element={<HowItWorks />} />
          </Routes>
        </Router>
      </WalletProvider>

    </>
  );
}

export default App;
