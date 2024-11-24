import { useReadContract, useWriteContract, useBlockNumber, useWaitForTransactionReceipt } from 'wagmi';
import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import {
  Paper,
  Typography,
  Button,
  Grid2,
  ButtonGroup,
  Box,
} from '@mui/material';
import { Issue } from '../Models/Issue';
import { CreateIssueDialog } from './CreateIssueDialog';
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

    const {
        data: issuesData,
        queryKey: issuesQueryKey,
    } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'getAllIssues',
    });

    useEffect(() => {
        if (triggerRead) {
            setTriggerRead(false);
            queryClient.invalidateQueries({ queryKey: issuesQueryKey });
        }
    }, [blockNumber, queryClient, triggerRead, issuesQueryKey]);

    useEffect(() => {
        if (issuesData) {
          const issuesList = issuesData as Issue[];
          console.log('issuesList', issuesList);
          setIssues(issuesList);
        }
      }, [issuesData]);

    const { writeContract: vote, isPending: voteIsPending, data: voteHash } = useWriteContract();

    const { isSuccess: voteSuccess } = useWaitForTransactionReceipt({
        hash: voteHash,
    });

    useEffect(() => {
        if (voteSuccess) {
            setTriggerRead(true);
        }
    }, [voteSuccess]);

    const handleVote = (issueId: number, voteType: Vote) => {
        vote({
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "vote",
            args: [BigInt(issueId), BigInt(voteType)],
        });
    };

    useEffect(() => {
        const handleIssueCreated = () => {
            setTriggerRead(true);
        };

        window.addEventListener('issueCreated', handleIssueCreated);
        return () => window.removeEventListener('issueCreated', handleIssueCreated);
    }, []);

    function renderIssues() {
        return issues.map((issue) => (
            <Grid2 size={12} key={issue.issueDesc}>
                <Paper elevation={3} sx={{ p: 1, mb: 1 }}>
                    <Grid2 container>
                        <Grid2 size={6}>
                            <Typography variant="h6">
                                {issue.issueDesc}
                            </Typography>
                        </Grid2>
                        <Grid2 size={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                        </Grid2>
                    </Grid2>
                </Paper>
            </Grid2>
        ));
    }

    return (
        <Paper elevation={0} sx={{ p: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    All Issues
                </Typography>
                <CreateIssueDialog />
            </Box>
            <Grid2 container>
                {renderIssues()}
            </Grid2>
        </Paper>
    );
}