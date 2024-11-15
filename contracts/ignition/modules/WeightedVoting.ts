import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const WeightedVotingModule = buildModule("WeightedVotingModule", (m) => {
  const weightedVoting = m.contract("WeightedVoting", ["Voting Token", "VOTE"]);

  return { weightedVoting };
});

export default WeightedVotingModule; 