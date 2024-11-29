import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useReadContract, useWriteContract, useBlockNumber, useWaitForTransactionReceipt } from 'wagmi';
import {
  Paper,
  Typography,
  Button,
  Grid2,
  ButtonGroup,
  Box,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { Issue } from '../Models/Issue';
import { Vote } from '../Models/Vote';
import { CreateIssueDialog } from './CreateIssueDialog';
import IssueDetails from './IssueDetails';

const StatusIndicator = ({ passed }: { passed: boolean }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {passed ? (
            <CheckCircle color="success" />
        ) : (
            <Cancel color="error" />
        )}
        <Typography variant="body1" color={passed ? "success.main" : "error.main"}>
            {passed ? "Passed" : "Failed"}
        </Typography>
    </Box>
);

export function IssueList() {
    const queryClient = useQueryClient();
    const [triggerRead, setTriggerRead] = useState(false);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [selectedIssue, setSelectedIssue] = useState<number | null>(null);

    const { data: blockNumber } = useBlockNumber({ watch: triggerRead });

    const {
        data: issuesData,
        queryKey: issuesQueryKey,
    } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'getAllIssues',
    });

    const { 
        writeContract: vote, 
        isPending: voteIsPending, 
        data: voteHash 
    } = useWriteContract();

    const { isSuccess: voteSuccess } = useWaitForTransactionReceipt({
        hash: voteHash,
    });

    useEffect(() => {
        if (triggerRead) {
            setTriggerRead(false);
            queryClient.invalidateQueries({ queryKey: issuesQueryKey });
        }
    }, [blockNumber, queryClient, triggerRead, issuesQueryKey]);

    useEffect(() => {
        if (issuesData) {
            setIssues(issuesData as Issue[]);
        }
    }, [issuesData]);

    useEffect(() => {
        if (voteSuccess) {
            setTriggerRead(true);
        }
    }, [voteSuccess]);

    useEffect(() => {
        const handleIssueCreated = () => setTriggerRead(true);
        window.addEventListener('issueCreated', handleIssueCreated);
        return () => window.removeEventListener('issueCreated', handleIssueCreated);
    }, []);

    useEffect(() => {
        if (issues.length > 0 && selectedIssue === null) {
            setSelectedIssue(issues[0].id);
        }
    }, [issues, selectedIssue]);

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
            <Grid2 size={12} key={issue.issueDesc}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 1, 
                        mb: 1,
                        backgroundColor: selectedIssue === issue.id ? 'action.selected' : 'background.paper',
                        cursor: 'pointer'
                    }}
                    onClick={() => setSelectedIssue(issue.id)}
                >
                    <Grid2 container>
                        <Grid2 size={6}>
                            <Typography variant="h6">
                                {issue.issueDesc}
                            </Typography>
                        </Grid2>
                        <Grid2 size={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {issue.closed ? (
                                <StatusIndicator passed={issue.passed} />
                            ) : (
                                <ButtonGroup variant="contained" disabled={voteIsPending}>
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
                            )}
                        </Grid2>
                    </Grid2>
                </Paper>
            </Grid2>
        ));
    }

    return (
        <Box sx={{ 
            height: 'calc(100% - 40px)',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            mb: 4
        }}>
            {selectedIssue !== null && issues.length > 0 && 
                <IssueDetails issue={issues.find(issue => issue.id === selectedIssue)!} />}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    width: '100%', 
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden',
                    height: selectedIssue !== null ? 'calc(100% - 200px)' : '100%'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        All Issues
                    </Typography>
                    <CreateIssueDialog />
                </Box>
                <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    pr: 1,
                }}>
                    <Grid2 container>
                        {renderIssues()}
                    </Grid2>
                </Box>
            </Paper>
        </Box>
    );
}