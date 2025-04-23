import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import './votingPage.css';
import Navbar from '../../components/navbar';

type Candidate = {
  id: number;
  name: string;
  image: string;
};

type Election = {
  id: number;
  title: string;
  candidates: Candidate[];
};

export default function VotingPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [votedElectionIds, setVotedElectionIds] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/elections'); // Replace with your actual API endpoint
        if (!response.ok) throw new Error('Failed to fetch elections');
        const data = [
          {
            id: 1,
            title: 'Presidential Election',
            candidates: [
              {
                id: 1,
                name: 'Alice Johnson',
                image: '/candidate1.jpg',
              },
              {
                id: 2,
                name: 'Bob Smith',
                image: '/candidate2.jpg',
              },
              {
                id: 3,
                name: 'Alice Johnson',
                image: '/candidate1.jpg',
              },
              {
                id: 4,
                name: 'Bob Smith',
                image: '/candidate2.jpg',
              },
            ],
          },
          {
            id: 2,
            title: 'District Election',
            candidates: [
              {
                id: 1,
                name: 'Abdurrahman Johnson',
                image: '/candidate1.jpg',
              },
              {
                id: 2,
                name: 'Youssef Smith',
                image: '/candidate2.jpg',
              },
            ],
          },
        ];

        setElections(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleSubmit = () => {
    if (selectedElection && selectedCandidate) {
      if (votedElectionIds.includes(selectedElection.id)) {
        setMessage('You have already voted in this election.');
        return;
      }

      // Optionally: POST vote to server here

      setMessage(
        `✅ You voted for ${selectedCandidate.name} in the ${selectedElection.title}.`
      );
      setVotedElectionIds([...votedElectionIds, selectedElection.id]);
      setSelectedElection(null);
      setSelectedCandidate(null);
    } else {
      setMessage('⚠️ Please select a candidate before submitting.');
    }
  };

  if (loading) return <div className="loading">Loading elections...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="voting-container">
        <Navbar />
        <h1 className="voting-title">🗳️ Ongoing Elections</h1>

        {!selectedElection ? (
          <ul className="election-list">
            {elections.map((election) => {
              const alreadyVoted = votedElectionIds.includes(election.id);
              return (
                <li
                  key={election.id}
                  className={`election-item ${
                    alreadyVoted ? 'election-voted' : 'election-active'
                  }`}
                  onClick={() => {
                    if (!alreadyVoted) {
                      setSelectedElection(election);
                      setMessage('');
                    }
                  }}
                >
                  <div className="election-title">{election.title}</div>
                  {alreadyVoted && (
                    <div className="election-note">You already voted</div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="space-y-6">
            <div className="back-button">
              <Button
                typeofButton="info"
                onClickButton={() => {
                  setSelectedElection(null);
                  setSelectedCandidate(null);
                  setMessage('');
                }}
              >
                ←
              </Button>
            </div>

            <div>
              <h2 className="candidates-heading">
                Candidates for{' '}
                <span className="text-blue-600">{selectedElection.title}</span>
              </h2>
            </div>

            <ul className="candidates-container">
              {selectedElection.candidates.map((candidate) => (
                <li
                  key={candidate.id}
                  className={`candidate-card ${
                    selectedCandidate?.id === candidate.id
                      ? 'candidate-selected'
                      : 'candidate-default'
                  }`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <img
                    src={candidate.image || 'https://via.placeholder.com/150'}
                    alt={candidate.name}
                    className="candidate-image"
                  />
                  <div className="candidate-name">{candidate.name}</div>
                </li>
              ))}
            </ul>

            <div className="submit-button-wrapper">
              <Button typeofButton="danger" onClickButton={handleSubmit}>
                Submit Vote
              </Button>
            </div>

            {message && (
              <div
                className={`message ${
                  message.includes('✅') ? 'message-success' : 'message-warning'
                }`}
              >
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
