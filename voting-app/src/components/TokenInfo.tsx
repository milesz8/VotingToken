import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useBlockNumber, useWriteContract, useSimulateContract } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useQueryClient } from '@tanstack/react-query';
import { Paper, Typography, Button, Box } from '@mui/material';

export function TokenInfo() {
    const queryClient = useQueryClient();
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const [tokenBalance, setTokenBalance] = useState(0);

    const {
        data: claimData,
        isFetching: claimIsFetching,
        isError: claimIsError,
      } = useSimulateContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'claim',
      });

    const { writeContract: claim, isPending: claimIsPending } = useWriteContract();

    const { data: balanceData, queryKey: balanceQueryKey } = 
        useReadContract({ 
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "balanceOf",
            args: [useAccount().address]
        });

    useEffect(() => {
        if (balanceData) {
            setTokenBalance(balanceData as number);
        }
    }, [balanceData])

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: balanceQueryKey});
    }, [blockNumber])

    const handleClaimClick = () => {
        claim(claimData!.request);
      };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 400 }}>
            <Typography variant="h6" gutterBottom>
                Token Information
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                    Token Balance: {tokenBalance}
                </Typography>
            </Box>
            <Button 
                variant="contained"
                disabled={claimIsPending || claimIsError}
                onClick={handleClaimClick}
                fullWidth
            >
                {claimIsPending ? 'Complete In Wallet' : 'Claim Tokens'}
            </Button>
            <Typography 
                color={claimIsError ? "error" : "info"} 
                sx={{ mt: 2 }}
            >
                {claimIsError ? 'Unable to claim tokens.' : 'Claim your tokens!'}
            </Typography>
        </Paper>
    );
}