'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Alert, Button } from '@mui/material';
import CustomButton from '../../components/Button';
import './votingPage.css';
import Navbar from '../../components/navbar';
import { ethers } from 'ethers';
import ElectionABI from '../../ABI/ElectionABI.json';
import FactoryABI from '../../ABI/ElectionFactoryABI.json';
import { useWallet } from '../../components/WalletProvider';
import ElectionCard from '../../components/ElectionCard';
import CandidateCard from '../../components/CandidateCard';
import VoteCountDashboard from '../../components/VoteCountDashboard';
import { Election, Candidate, Proposal } from '../../types/electionTypes';
import toast, { Toaster } from 'react-hot-toast';

// Update this with your deployed factory address
const FACTORY_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function VotingPage() {
  // State variables remain the same
  const { provider, signer, account } = useWallet();
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [votedElectionIds, setVotedElectionIds] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [electionContracts, setElectionContracts] = useState<{ [key: number]: ethers.Contract }>({});
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [voterMetrics, setVoterMetrics] = useState<{ [key: number]: { total: number, voted: number } }>({});
  const [viewingElectionDetails, setViewingElectionDetails] = useState<Election | null>(null);

  // All useEffect hooks remain the same
  useEffect(() => {
    if (!signer || !account) return;

    const initFactory = async () => {
      try {
        const factory = new ethers.Contract(FACTORY_ADDRESS, FactoryABI.abi, signer);
        setFactoryContract(factory);

        // Check if user is factory owner
        const ownerAddr = await factory.owner();
        setIsOwner(ownerAddr.toLowerCase() === account.toLowerCase());
      } catch (err) {
        console.error("Error initializing factory contract:", err);
      }
    };

    initFactory();
  }, [signer, account]);

  // Fetch blockchain elections (keep as is)
  useEffect(() => {
    if (!factoryContract || !signer || !account) return;

    const fetchBlockchainElections = async () => {
      try {
        // Get all election addresses
        const electionAddresses = await factoryContract.getAllElections();

        if (electionAddresses.length === 0) {
          console.log("No elections found on blockchain");
          setLoading(false);
          return;
        }

        // Create array to store blockchain elections
        const blockchainElections: Election[] = [];
        const newVoterMetrics: { [key: number]: { total: number, voted: number } } = {};

        // Loop through each election address
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

            // Store contract reference for later use
            setElectionContracts(prev => ({
              ...prev,
              [i + 1]: electionContract
            }));

            // Get proposals with votes
            const rawProposals = await electionContract.getAllProposals();
            let totalVotes = 0;

            const candidates = rawProposals.map((p: any, index: number) => {
              totalVotes += Number(p.votes);
              return {
                id: index + 1,
                name: p.name,
                image: '/candidate-placeholder.jpg',
                votes: Number(p.votes)
              };
            });

            // Check if user has voted
            const hasVoted = await electionContract.hasVoted(account);
            if (hasVoted && !votedElectionIds.includes(i + 1)) {
              setVotedElectionIds(prev => [...prev, i + 1]);
            }

            // Get voter metrics
            const allowedVoters = details.allowedVoters || [];
            const voterCount = allowedVoters.length;

            // Count how many have voted
            let votedCount = 0;
            for (const voter of allowedVoters) {
              try {
                const hasVoted = await electionContract.hasVoted(voter);
                if (hasVoted) votedCount++;
              } catch (err) {
                console.error(`Error checking if voter ${voter} has voted:`, err);
              }
            }

            newVoterMetrics[i + 1] = {
              total: voterCount,
              voted: votedCount
            };

            // Create election object
            const election: Election = {
              id: i + 1,
              title: details.title,
              candidates: candidates,
              address: details.electionAddress,
              ended: details.ended,
              startTime: Number(details.startTime),
              endTime: Number(details.endTime),
              allowedVoters: details.allowedVoters
            };

            blockchainElections.push(election);
          } catch (err) {
            console.error(`Error fetching election at index ${i}:`, err);
          }
        }

        // Set voter metrics
        setVoterMetrics(newVoterMetrics);

        // Replace elections with blockchain elections
        if (blockchainElections.length > 0) {
          setElections(blockchainElections);
        }
      } catch (err) {
        toast.error("Failed to load your elections");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainElections();
  }, [factoryContract, signer, account]);

  // Update selected election's proposals (keep as is)
  useEffect(() => {
    if (!selectedElection || !electionContracts[selectedElection.id]) return;

    const fetchProposals = async () => {
      try {
        const electionContract = electionContracts[selectedElection.id];

        // Get all proposals
        const rawProposals = await electionContract.getAllProposals();

        if (Array.isArray(rawProposals) && rawProposals.length > 0) {
          const formattedProposals = rawProposals.map((p: any) => ({
            name: p.name,
            votes: Number(p.votes)
          }));
          setProposals(formattedProposals);
          setError("");
        } else {
          console.log("No proposals found for selected election");
          setProposals([]);
          setError("No proposals found for this election");
        }
      } catch (err) {
        console.error("Error fetching proposals for selected election:", err);
        toast.error("Failed to load election details");
      }
    };

    fetchProposals();
  }, [selectedElection, electionContracts]);

  // Handle blockchain vote submission (keep as is)
  const handleBlockchainVote = async () => {
    if (!selectedElection || !selectedCandidate || !electionContracts[selectedElection.id]) {
      toast.error('⚠️ Please select a candidate first.');
      return;
    }

    if (votedElectionIds.includes(selectedElection.id)) {
      toast.error('⚠️ You have already voted in this election.');
      return;
    }

    // Set loading state
    setLoading(true);
    setMessage('📝 Submitting your vote to the blockchain...');

    try {
      const electionContract = electionContracts[selectedElection.id];

      // Submit vote transaction
      const tx = await electionContract.vote(selectedCandidate.name);
      await tx.wait();

      // Update voted election IDs
      setVotedElectionIds([...votedElectionIds, selectedElection.id]);
      toast.success(`You voted for ${selectedCandidate.name} in ${selectedElection.title}.`);

      // Update voter metrics
      setVoterMetrics(prev => {
        const metrics = { ...prev };
        if (metrics[selectedElection.id]) {
          metrics[selectedElection.id].voted += 1;
        }
        return metrics;
      });

      // Reset selection
      setSelectedElection(null);
      setSelectedCandidate(null);
    } catch (err: any) {
      console.error("Error submitting vote:", err);
      toast.error('Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  // Add this function to your component (just before return statement)
  const isElectionFinished = (election: any) => {
    const now = Math.floor(Date.now() / 1000);
    // Election is finished if either:
    // 1. The ended flag is set in the contract
    // 2. The current time is past the election's end time
    return election.ended || (election.endTime && now > election.endTime);
  };

  const isElectionStarted = (election: any) => {
    const now = Math.floor(Date.now() / 1000);
    // Election is started if the current time is past the election's start time
    return election.startTime && now >= election.startTime;
  };

  // Wallet not connected UI (keep as is)
  if (!provider || !signer || !account) {
    return (
      <>
        <div className="voting-container">
          <Navbar />
          <h1 className="voting-title">🗳️ Ongoing Elections</h1>

          <div className="wallet-connect-prompt">
            <h2 style={{ color: 'white' }}>Connect Your Wallet</h2>
            <p style={{ color: 'white' }}>Please connect your wallet using the button in the navigation bar to view and participate in elections.</p>
            <div className="mt-4">
              <CustomButton
                typeofButton="primary"
                onClickButton={() => window.location.href = '/howItWorks'}
              >
                Learn How It Works
              </CustomButton>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">Loading elections...</div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="error">{error}</div>
    </>
  );

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          minHeight: '100vh',
          color: '#fff',
          px: { xs: 3, md: 8 },  // Add horizontal padding like home page
          py: { xs: 6, md: 2 }   // Add vertical padding like home page
        }}
      >
        <Navbar />
        <Toaster position='top-center'/>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 4,
              textAlign: 'center'
            }}
          >
            🗳️ Elections
          </Typography>



          {!selectedElection ? (
            // Elections list with sections
            <Box sx={{ width: '100%' }}>
              {/* Message display */}
              {message && (
                <Alert
                  severity={message.includes('⚠️') ? 'warning' : message.includes('✅') ? 'success' : 'info'}
                  sx={{
                    mb: 4,
                    borderRadius: 2,
                    backgroundColor: message.includes('⚠️') ? 'rgba(255, 152, 0, 0.1)' :
                      message.includes('✅') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                    color: message.includes('⚠️') ? '#ff9800' :
                      message.includes('✅') ? '#4caf50' : '#2196f3',
                  }}
                  onClose={() => setMessage('')}
                >
                  {message}
                </Alert>
              )}

              {/* Filter elections by status */}
              {(() => {
                // Filter elections into categories
                const activeElections = elections.filter(election =>
                  isElectionStarted(election) && !isElectionFinished(election)
                );

                const upcomingElections = elections.filter(election =>
                  !isElectionStarted(election)
                );

                const endedElections = elections.filter(election =>
                  isElectionFinished(election)
                );

                return (
                  <>
                    {/* 1. ACTIVE ELECTIONS SECTION */}
                    <Box sx={{ mb: 5 }}>
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#00c896'
                        }}
                      >
                        {/* <Box component="span" sx={{
                          backgroundColor: 'rgba(0, 200, 150, 0.1)',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1.5
                        }}>
                          🔴
                        </Box> */}
                        Active Elections
                      </Typography>

                      {activeElections.length > 0 ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'flex-start',
                            mt: 3
                          }}
                        >
                          {activeElections.map((election) => {
                            const alreadyVoted = votedElectionIds.includes(election.id);
                            const metrics = voterMetrics[election.id] || { total: 0, voted: 0 };
                            const electionFinished = isElectionFinished(election);

                            return (
                              <Box
                                key={election.id}
                                sx={{
                                  width: { xs: '100%', sm: 'calc(50% - 24px)', lg: 'calc(33.33% - 24px)' },
                                  minWidth: { xs: '100%', sm: '280px', lg: '300px' },
                                  maxWidth: '500px',
                                }}
                              >
                                <ElectionCard
                                  election={{ ...election, ended: electionFinished }}
                                  alreadyVoted={alreadyVoted}
                                  onSelect={() => {
                                    if (isElectionStarted(election) && !electionFinished && !alreadyVoted) {
                                      setSelectedElection(election);
                                      setMessage('');
                                    }
                                  }}
                                  onViewDetails={() => {
                                    setViewingElectionDetails(election);
                                    if (electionContracts[election.id]) {
                                      const fetchProposals = async () => {
                                        try {
                                          const electionContract = electionContracts[election.id];
                                          const rawProposals = await electionContract.getAllProposals();
                                          if (Array.isArray(rawProposals) && rawProposals.length > 0) {
                                            const formattedProposals = rawProposals.map((p: any) => ({
                                              name: p.name,
                                              votes: Number(p.votes)
                                            }));
                                            setProposals(formattedProposals);
                                          } else {
                                            setProposals([]);
                                          }
                                        } catch (err) {
                                          console.error("Error fetching proposals:", err);
                                          setProposals([]);
                                        }
                                      };
                                      fetchProposals();
                                    }
                                  }}
                                  totalVoters={metrics.total}
                                  votedCount={metrics.voted}
                                  notStarted={!isElectionStarted(election)}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: 2,
                            mt: 2
                          }}
                        >
                          <Typography variant="body1" color="#aaa">
                            No active elections at this time.
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Divider after active elections */}
                    {(activeElections.length > 0 && (upcomingElections.length > 0 || endedElections.length > 0)) && (
                      <Box
                        sx={{
                          my: 5,
                          height: '1px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          width: '100%'
                        }}
                      />
                    )}

                    {/* 2. UPCOMING ELECTIONS SECTION */}
                    {upcomingElections.length > 0 && (
                      <Box sx={{ mb: 5 }}>
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#2196f3'
                          }}
                        >
                          {/* <Box component="span" sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            🔵
                          </Box> */}
                          Upcoming Elections
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'flex-start',
                            mt: 3
                          }}
                        >
                          {upcomingElections.map((election) => {
                            const metrics = voterMetrics[election.id] || { total: 0, voted: 0 };

                            return (
                              <Box
                                key={election.id}
                                sx={{
                                  width: { xs: '100%', sm: 'calc(50% - 24px)', lg: 'calc(33.33% - 24px)' },
                                  minWidth: { xs: '100%', sm: '280px', lg: '300px' },
                                  maxWidth: '500px',
                                }}
                              >
                                <ElectionCard
                                  election={election}
                                  alreadyVoted={false}
                                  onSelect={() => {
                                    const startTimeMessage = election.startTime
                                      ? `Starts on ${new Date(election.startTime * 1000).toLocaleString()}`
                                      : "Start time not available";
                                    setMessage(`⚠️ Election "${election.title}" hasn't started yet. ${startTimeMessage}`);
                                  }}
                                  onViewDetails={() => {
                                    setMessage(`⚠️ Results will be available when election "${election.title}" begins.`);
                                  }}
                                  totalVoters={metrics.total}
                                  votedCount={0}
                                  notStarted={true}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Divider after upcoming elections */}
                    {(upcomingElections.length > 0 && endedElections.length > 0) && (
                      <Box
                        sx={{
                          my: 5,
                          height: '1px',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          width: '100%'
                        }}
                      />
                    )}

                    {/* 3. ENDED ELECTIONS SECTION */}
                    {endedElections.length > 0 && (
                      <Box sx={{ mb: 5 }}>
                        <Typography
                          variant="h4"
                          component="h2"
                          sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#9e9e9e'
                          }}
                        >
                          {/* <Box component="span" sx={{
                            backgroundColor: 'rgba(158, 158, 158, 0.1)',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            ⚫
                          </Box> */}
                          Ended Elections
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: 'flex-start',
                            mt: 3
                          }}
                        >
                          {endedElections.map((election) => {
                            const alreadyVoted = votedElectionIds.includes(election.id);
                            const metrics = voterMetrics[election.id] || { total: 0, voted: 0 };

                            return (
                              <Box
                                key={election.id}
                                sx={{
                                  width: { xs: '100%', sm: 'calc(50% - 24px)', lg: 'calc(33.33% - 24px)' },
                                  minWidth: { xs: '100%', sm: '280px', lg: '300px' },
                                  maxWidth: '500px',
                                }}
                              >
                                <ElectionCard
                                  election={{ ...election, ended: true }}
                                  alreadyVoted={alreadyVoted}
                                  onSelect={() => {
                                    setViewingElectionDetails(election);
                                    if (electionContracts[election.id]) {
                                      const fetchProposals = async () => {
                                        try {
                                          const electionContract = electionContracts[election.id];
                                          const rawProposals = await electionContract.getAllProposals();
                                          if (Array.isArray(rawProposals) && rawProposals.length > 0) {
                                            const formattedProposals = rawProposals.map((p: any) => ({
                                              name: p.name,
                                              votes: Number(p.votes)
                                            }));
                                            setProposals(formattedProposals);
                                          } else {
                                            setProposals([]);
                                          }
                                        } catch (err) {
                                          console.error("Error fetching proposals:", err);
                                          setProposals([]);
                                        }
                                      };
                                      fetchProposals();
                                    }
                                  }}
                                  onViewDetails={() => {
                                    setViewingElectionDetails(election);
                                    if (electionContracts[election.id]) {
                                      const fetchProposals = async () => {
                                        try {
                                          const electionContract = electionContracts[election.id];
                                          const rawProposals = await electionContract.getAllProposals();
                                          if (Array.isArray(rawProposals) && rawProposals.length > 0) {
                                            const formattedProposals = rawProposals.map((p: any) => ({
                                              name: p.name,
                                              votes: Number(p.votes)
                                            }));
                                            setProposals(formattedProposals);
                                          } else {
                                            setProposals([]);
                                          }
                                        } catch (err) {
                                          console.error("Error fetching proposals:", err);
                                          setProposals([]);
                                        }
                                      };
                                      fetchProposals();
                                    }
                                  }}
                                  totalVoters={metrics.total}
                                  votedCount={metrics.voted}
                                  notStarted={false}
                                />
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Show empty state if no elections at all */}
                    {elections.length === 0 && (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 8,
                          color: '#aaa',
                          width: '100%',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: 4,
                          mt: 4
                        }}
                      >
                        <Typography variant="h5" gutterBottom>
                          No elections found
                        </Typography>
                        <Typography variant="body1">
                          There are no elections available at this time.
                        </Typography>
                      </Box>
                    )}

                    {/* Election Results Dashboard - shown when an ended election's details are viewed */}
                    {viewingElectionDetails && (
                      <Box
                        sx={{
                          width: '100%',
                          mt: 6,
                          mb: 6,
                          backgroundColor: 'rgba(0,0,0,0.2)',
                          borderRadius: 3,
                          p: 4,
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}
                      >
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                              fontWeight: 'bold',
                              color: '#fff'
                            }}
                          >
                            {viewingElectionDetails.title} Results
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => setViewingElectionDetails(null)}
                            sx={{
                              color: "#aaa",
                              borderColor: "#333",
                              "&:hover": {
                                borderColor: "#aaa",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                              },
                            }}
                          >
                            Close Results
                          </Button>
                        </Box>

                        {/* Vote count dashboard */}
                        {proposals.length > 0 ? (
                          <>
                            <VoteCountDashboard
                              title={viewingElectionDetails.title}
                              candidates={viewingElectionDetails.candidates}
                              voteData={proposals.filter(p =>
                                viewingElectionDetails.candidates.some(c => c.name === p.name)
                              )}
                              totalVotes={proposals.reduce((sum, p) => sum + p.votes, 0)}
                            />
                          </>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                            <Typography variant="body1" color="#aaa">
                              Loading election results...
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </>
                );
              })()}

            </Box>
          ) : (
            <Box>
              {/* Back button */}
              <Box sx={{ mb: 4 }}>
                <CustomButton
                  typeofButton="info"
                  onClickButton={() => {
                    setSelectedElection(null);
                    setSelectedCandidate(null);
                    setMessage('');
                  }}
                >
                  ← Back to Elections
                </CustomButton>
              </Box>

              {/* Election title */}
              <Typography
                variant="h3"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  textAlign: 'center',
                  color: '#fff'
                }}
              >
                {selectedElection.title}
              </Typography>

              {/* If election has ended or user has voted, show results */}
              {(isElectionFinished(selectedElection) || votedElectionIds.includes(selectedElection.id)) && (
                <>
                  {/* Add a check to ensure proposals are loaded */}
                  {proposals.length > 0 ? (
                    <>
                      {/* Vote count dashboard */}
                      <VoteCountDashboard
                        title={selectedElection.title}
                        candidates={selectedElection.candidates}
                        voteData={proposals}
                        totalVotes={proposals.reduce((sum, p) => sum + p.votes, 0)}
                      />


                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="#aaa">
                        Loading election results...
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Candidates section */}
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    textAlign: 'center',
                    color: isElectionFinished(selectedElection) ? '#aaa' : '#fff',
                  }}
                >
                  Select a Candidate
                </Typography>

                {/* Candidates using flexbox instead of Grid */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: 'center'
                  }}
                >
                  {selectedElection.candidates.map((candidate) => {
                    const candidateVotes = proposals.find(p => p.name === candidate.name)?.votes || 0;
                    const totalVotes = proposals.reduce((sum, p) => sum + p.votes, 0);

                    return (
                      <Box
                        key={candidate.id}
                        sx={{
                          display: 'grid',
                          gridTemplateRows: 'repeat(1, 1fr)',
                          gap: '16px',                        // Consistent, moderate gap between items
                          width: '100%',
                          maxWidth: '1200px',                 // Limit maximum width
                          mx: 'auto',                         // Center the grid
                          px: { xs: 2, sm: 3 },               // Consistent padding
                        }}
                      >
                        <CandidateCard
                          candidate={candidate}
                          isSelected={selectedCandidate?.id === candidate.id}
                          onSelect={() => {
                            if (!selectedElection.ended && !votedElectionIds.includes(selectedElection.id)) {
                              setSelectedCandidate(candidate);
                            }
                          }}
                          voteCount={candidateVotes}
                          totalVotes={totalVotes}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Submit button */}
              {!isElectionFinished(selectedElection) && !votedElectionIds.includes(selectedElection.id) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                  <CustomButton
                    typeofButton="danger"
                    onClickButton={handleBlockchainVote}
                  // disabled
                  // disabled={!selectedCandidate ? false : true} // This is critical - reactivate this!
                  >
                    {loading ? 'Processing...' : 'Submit Vote'}
                  </CustomButton>
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
