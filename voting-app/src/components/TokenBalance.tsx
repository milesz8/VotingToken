import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useBlockNumber } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const TokenValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  animation: `${pulseAnimation} 2s infinite ease-in-out`,
}));

export function TokenBalance() {
    const queryClient = useQueryClient();
    const [tokenBalance, setTokenBalance] = useState(0);
    const { address } = useAccount();
    const theme = useTheme();
    const isAboveSmall = useMediaQuery(theme.breakpoints.up('sm'));

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
        const handleEvent = () => queryClient.invalidateQueries({ queryKey: balanceQueryKey });
        
        window.addEventListener('tokensClaimed', handleEvent);
        window.addEventListener('issueCreated', handleEvent);
        window.addEventListener('voteCast', handleEvent);
        
        return () => {
            window.removeEventListener('tokensClaimed', handleEvent);
            window.removeEventListener('issueCreated', handleEvent);
            window.removeEventListener('voteCast', handleEvent);
        };
    }, [queryClient, balanceQueryKey]);

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

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 2 
            }}>
                {isAboveSmall && (
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                        Balance:
                    </Typography>
                )}
                <TokenValue variant="h6">
                    <CountUp 
                        end={tokenBalance} 
                        duration={1} 
                        separator="," 
                        decimals={0}
                        preserveValue={true}
                        prefix="◎ "
                    />
                </TokenValue>
            </Box>
        </Box>
    );
}