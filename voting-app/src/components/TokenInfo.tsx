import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useBlockNumber, useWriteContract, useSimulateContract } from 'wagmi';
import contractData from '../deployments/FEWeightedVoting.json';
import { useQueryClient } from '@tanstack/react-query';

export function TokenInfo() {
    const queryClient = useQueryClient();
    const { data: blockNumber } = useBlockNumber({ watch: true });
    const [tokenBalance, setTokenBalance] = useState(0);

    const {
        data: claimData,
        isFetching: claimIsFetching,
        isError: claimIsError,
      } = useSimulateContract({
        address: contractData.address as `0x${string}`,
        abi: contractData.abi,
        functionName: 'claim',
      });

    const { writeContract: claim, isPending: claimIsPending } = useWriteContract();

    const { data: balanceData, queryKey: balanceQueryKey } = 
        useReadContract({ 
            address: contractData.address as `0x${string}`,
            abi: contractData.abi,
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
        <div>
          <p>{claimIsFetching.toString()}</p>
          <p>{'Token Balance: ' + tokenBalance}</p>
          <button disabled={claimIsPending || claimIsError} onClick={handleClaimClick}>
            {claimIsPending ? 'Complete In Wallet' : 'Claim Tokens'}
          </button>
          <p>{claimIsError ? 'Unable to claim tokens.' : 'Claim your tokens!'} </p>
        </div>
    );
}