import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';

export function CreateIssue() {
    const { error: createIssueIsError, writeContract: createIssue, isPending: createIssueIsPending, data: createIssueHash } = useWriteContract();
    const [issueDesc, setIssueDesc] = useState('');
    const [quorum, setQuorum] = useState('');

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
        </Paper>
    );
}