import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract, useSimulateContract } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
    const { address } = useAccount();
    const [isTokensClaimed, setIsTokensClaimed] = useState(false);
    const { data: hasClaimedData } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: "hasClaimed",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });
    useEffect(() => {
        setIsTokensClaimed(!!hasClaimedData);
    }, [hasClaimedData]);
    const { isConnected } = useAccount();
    const {
        data: claimData,
        isError: claimIsError,
      } = useSimulateContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'claim',
        query: {
            enabled: isConnected,
        }
      });
    const { writeContract: claim, isPending: claimIsPending } = useWriteContract();
    const handleClaimClick = () => {
        if (!isConnected || !claimData) {
            return;
        }
        claim(claimData.request);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {!isTokensClaimed ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You need to claim your tokens before creating an issue.
                    </Typography>
                    {!isConnected ? (
                        <ConnectButton />
                    ) : (
                        <Button 
                            variant="contained"
                            disabled={isTokensClaimed || claimIsPending || claimIsError}
                            onClick={handleClaimClick}
                            fullWidth
                        >
                            {claimIsPending ? 'Complete In Wallet' : 'Claim Tokens'}
                        </Button>
                    )}
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