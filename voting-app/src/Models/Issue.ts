interface Issue {
    voters: string[];
    issueDesc: string;
    votesFor: bigint;
    votesAgainst: bigint;
    votesAbstain: bigint;
    totalVotes: bigint;
    quorum: bigint;
    passed: boolean;
    closed: boolean;
  }