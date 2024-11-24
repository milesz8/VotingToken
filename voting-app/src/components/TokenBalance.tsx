import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useBlockNumber } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useQueryClient } from '@tanstack/react-query';
import { Paper, Typography, Box } from '@mui/material';

export function TokenBalance() {
    const queryClient = useQueryClient();
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const [tokenBalance, setTokenBalance] = useState(0);
    const { address } = useAccount();

    const { error: balanceIsError, data: balanceData, queryKey: balanceQueryKey } = 
        useReadContract({ 
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "balanceOf",
            args: address ? [address] : undefined,
            query: {
                enabled: !!address,
            }
        });

    useEffect(() => {
        if (balanceIsError) {
            console.error('Error getting balance:', balanceIsError);
            setTokenBalance(0);
        }
    }, [balanceIsError]);

    useEffect(() => {
        if (balanceData) {
            setTokenBalance(Number(balanceData));
        } else {
            setTokenBalance(0);
        }
    }, [balanceData]);

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: balanceQueryKey});
    }, [blockNumber, balanceQueryKey, queryClient]);

    return (
        <Typography variant="body1">
            Token Balance: {tokenBalance}
        </Typography>
    );
}