import { useWriteContract, useSimulateContract, useAccount, useChainId } from 'wagmi';
import { Button } from '@mui/material';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { useEffect } from 'react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { configReown } from '../wagmi';

export function ClaimButton() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    
    const { data: claimData, isError: claimIsError } = useSimulateContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: 'claim',
        query: {
            enabled: isConnected,
        }
    });

    const { writeContract: claim, isPending: claimIsPending, isSuccess: claimIsSuccess, data: txHash } = useWriteContract();

    useEffect(() => {
        if (claimIsSuccess && txHash) {
            // Wait for transaction to be confirmed
            waitForTransactionReceipt(configReown, { 
                hash: txHash,
                confirmations: 1
            })
                .then(() => {
                    window.dispatchEvent(new Event('tokensClaimed'));
                })
                .catch(console.error);
        }
    }, [claimIsSuccess, txHash]);

    const handleClaimClick = () => {
        if (!isConnected || !claimData) {
            return;
        }
        claim(claimData.request);
    };

    return (
        <Button 
            variant="contained"
            disabled={!isConnected || claimIsPending || claimIsError}
            onClick={handleClaimClick}
            fullWidth
        >
            {claimIsPending ? 'Complete In Wallet' : 'Claim Tokens'}
        </Button>
    );
} 