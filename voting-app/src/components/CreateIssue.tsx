import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export function CreateIssue() {
    const { error: createIssueIsError, writeContract: createIssue, isPending: createIssueIsPending, data: createIssueHash } = useWriteContract();
    const [issueDesc, setIssueDesc] = useState('');
    const [quorum, setQuorum] = useState('');
    const { address } = useAccount();
    const { data: hasClaimedData } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: "hasClaimed",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    const { isSuccess: createIssueSuccess } = useWaitForTransactionReceipt({
        hash: createIssueHash,
    });

    useEffect(() => {
        if (createIssueIsError) {
            console.error('Error creating issue:', createIssueIsError);
        }
    }, [createIssueIsError]);

    useEffect(() => {
        if (createIssueSuccess) {
            setIssueDesc('');
            setQuorum('');
            window.dispatchEvent(new Event('issueCreated'));
        }
    }, [createIssueSuccess]);

    const handleCreateIssueClick = () => {
        if (!issueDesc || !quorum) return;
        
        createIssue({
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "createIssue",
            args: [issueDesc, BigInt(quorum)],
        });
    }

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {!hasClaimedData ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You need to claim your tokens before creating an issue.
                    </Typography>
                    <Link href="/claim" passHref>
              <Button color="inherit">Go to Claim Page</Button>
            </Link>
                </Box>
            ) : (
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Issue Description"
                        variant="outlined"
                        value={issueDesc}
                        onChange={(e) => setIssueDesc(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Quorum"
                        variant="outlined"
                        value={quorum}
                        onChange={(e) => setQuorum(e.target.value)}
                    />
                    <Button 
                        variant="contained"
                        onClick={handleCreateIssueClick}
                        disabled={createIssueIsPending}
                    >
                        {createIssueIsPending ? 'Creating...' : 'Create Issue'}
                    </Button>
                </Box>
            )}
        </Paper>
    );
}