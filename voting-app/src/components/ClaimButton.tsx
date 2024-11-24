import { useWriteContract, useSimulateContract, useAccount } from 'wagmi';
import { Button } from '@mui/material';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';

export function ClaimButton() {
    const { isConnected } = useAccount();
    
    const { data: claimData, isError: claimIsError } = useSimulateContract({
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