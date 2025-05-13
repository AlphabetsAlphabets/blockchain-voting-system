export type Candidate = {
  id: number;
  name: string;
  image: string;
  votes?: number;
};

export type Election = {
  id: number;
  title: string;
  candidates: Candidate[];
  address?: string;
  ended?: boolean;
  startTime?: number;
  endTime?: number;
  allowedVoters?: string[];
};

export type Proposal = {
  name: string;
  votes: number;
};
