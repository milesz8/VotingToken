import { useReadContract, useWriteContract, useBlockNumber } from 'wagmi';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { 
  Paper, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Grid2,
  ButtonGroup,
  Box
} from '@mui/material';

enum Vote {
    FOR = 0,
    AGAINST = 1,
    ABSTAIN = 2
}

export function IssueList() {
    const queryClient = useQueryClient();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [triggerRead, setTriggerRead] = useState(false);

    const { data: blockNumber } = useBlockNumber({ watch: triggerRead });

    useEffect(() => {
        if (triggerRead) {
            setTriggerRead(false);
            queryClient.invalidateQueries({ queryKey: issuesQueryKey });
        }
    }, [blockNumber, queryClient, triggerRead]);

    const {
        data: issuesData,
        isError: issuesIsError,
        isPending: issuesIsPending,
        isLoading: issuesIsLoading,
        isFetching: issuesIsFetching,
        queryKey: issuesQueryKey,
      } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'getAllIssues',
      });

    useEffect(() => {
        if (issuesData) {
          const issuesList = issuesData as Issue[];
          console.log('issuesList', issuesList);
          setIssues(issuesList);
        }
      }, [issuesData]);

    const { writeContract: vote, isPending: voteIsPending } = useWriteContract();

    const handleVote = (issueId: number, voteType: Vote) => {
        vote({
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "vote",
            args: [BigInt(issueId), BigInt(voteType)],
        });
    };

    function renderIssues() {
        return issues.map((issue) => (
            <Grid2 size={4} key={issue.issueDesc}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {issue.issueDesc}
                        </Typography>
                        <Typography variant="body2">ID: {issue.id.toString()}</Typography>
                        <Typography variant="body2">Voters: {issue.voters.toString()}</Typography>
                        <Typography variant="body2">Votes For: {issue.votesFor.toString()}</Typography>
                        <Typography variant="body2">Votes Against: {issue.votesAgainst.toString()}</Typography>
                        <Typography variant="body2">Votes Abstain: {issue.votesAbstain.toString()}</Typography>
                        <Typography variant="body2">Required votes: {issue.quorum.toString()}</Typography>
                        <Typography variant="body2">Passed: {issue.passed.toString()}</Typography>
                    </CardContent>
                    <CardActions>
                        <ButtonGroup variant="contained" disabled={issue.closed || voteIsPending}>
                            <Button 
                                onClick={() => handleVote(issue.id, Vote.FOR)}
                                color="success"
                            >
                                {voteIsPending ? 'Voting...' : 'Vote For'}
                            </Button>
                            <Button
                                onClick={() => handleVote(issue.id, Vote.AGAINST)}
                                color="error"
                            >
                                {voteIsPending ? 'Voting...' : 'Vote Against'}
                            </Button>
                            <Button
                                onClick={() => handleVote(issue.id, Vote.ABSTAIN)}
                                color="info"
                            >
                                {voteIsPending ? 'Voting...' : 'Abstain'}
                            </Button>
                        </ButtonGroup>
                    </CardActions>
                </Card>
            </Grid2>
        ));
    }

    return (
        <Paper elevation={0} sx={{ p: 3, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                All Issues
            </Typography>
            <Grid2 container spacing={3}>
                {renderIssues()}
            </Grid2>
        </Paper>
    );
}