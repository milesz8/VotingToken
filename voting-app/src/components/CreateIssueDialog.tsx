import * as React from 'react';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Fab, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { ClaimButton } from './ClaimButton';
import { useQueryClient } from '@tanstack/react-query';

interface IssueFormData {
  issueDesc: string;
  quorum: string;
}

function useIssueCreation() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<IssueFormData>({ issueDesc: '', quorum: '5' });
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { error, writeContract, isPending, data: writeContractData } = useWriteContract();
  const { isSuccess, isPending: isPendingSuccess } = useWaitForTransactionReceipt({ 
    hash: writeContractData 
  });
  const { address } = useAccount();
  const { data: totalSupply, queryKey: totalSupplyQueryKey } = useReadContract({
    address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
    abi: weightedVoting.abi,
    functionName: "totalSupply",
  });

    useEffect(() => {
      const handleEvent = () => queryClient.invalidateQueries({ queryKey: totalSupplyQueryKey });
      
      window.addEventListener('tokensClaimed', handleEvent);
      window.addEventListener('issueCreated', handleEvent);
      window.addEventListener('voteCast', handleEvent);
      
      return () => {
          window.removeEventListener('tokensClaimed', handleEvent);
          window.removeEventListener('issueCreated', handleEvent);
          window.removeEventListener('voteCast', handleEvent);
      };
  }, [queryClient, totalSupplyQueryKey]);

  const { data: balance } = useReadContract({
    address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
    abi: weightedVoting.abi,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (error) {
      if (error.message.includes('User denied transaction')) {
        setErrorMessage('Transaction was cancelled');
      } else {
        setErrorMessage('Error creating issue. Please try again.');
        console.error('Error creating issue:', error);
      }
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({ issueDesc: '', quorum: '5' });
      setErrorMessage(null);
      setOpen(false);
      window.dispatchEvent(new Event('issueCreated'));
    }
  }, [isSuccess]);

  return {
    queryClient,
    formData,
    setFormData,
    open,
    setOpen,
    writeContract,
    isPending,
    isPendingSuccess,
    writeContractData,
    totalSupply,
    balance,
    errorMessage,
    setErrorMessage,
  };
}

export function CreateIssueDialog() {
  const { queryClient, formData, setFormData, open, setOpen, writeContract, isPending, totalSupply, balance, errorMessage, setErrorMessage, isPendingSuccess, writeContractData } = useIssueCreation();
  const { address, isConnected } = useAccount();
  const { data: hasClaimedData, queryKey: hasClaimedQueryKey } = useReadContract({
    address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
    abi: weightedVoting.abi,
    functionName: "hasClaimed",
    args: isConnected ? [address] : undefined,
    query: { enabled: !!isConnected }
  });

  useEffect(() => {
    const handleTokenClaimed = () => {
      queryClient.invalidateQueries({ queryKey: hasClaimedQueryKey });
    };
    window.addEventListener('tokensClaimed', handleTokenClaimed);
    return () => {
      window.removeEventListener('tokensClaimed', handleTokenClaimed);
    };
  }, [queryClient, hasClaimedQueryKey]);

  const isQuorumValid = totalSupply ? BigInt(formData.quorum) <= (totalSupply as bigint) : true;

  const hasEnoughTokens = balance ? (balance as bigint) >= BigInt(5) : false;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.issueDesc || !formData.quorum) return;
    
    writeContract({
      address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
      abi: weightedVoting.abi,
      functionName: "createIssue",
      args: [formData.issueDesc, BigInt(formData.quorum)],
    });
  };

  return (
    <React.Fragment>
      <Fab color="primary" size="small" aria-label="add" onClick={() => setOpen(true)}>
        <AddIcon />
      </Fab>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>
          {!isConnected
            ? 'Connect Wallet First' 
            : !hasClaimedData 
              ? 'Claim Tokens First' 
              : !hasEnoughTokens
                ? 'Insufficient Balance'
                : 'Create Issue Cost: ◎5'}
        </DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Box sx={{ color: 'error.main', mb: 2 }}>
              {errorMessage}
            </Box>
          )}
          {!isConnected ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
              <p>You need to connect your wallet first.</p>
              <ConnectButton />
            </Box>
          ) : !hasClaimedData ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <p>You need to claim tokens first.</p>
              <ClaimButton />
            </Box>
          ) : !hasEnoughTokens ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <p>You need at least ◎5 to create an issue. Current balance: ◎{balance?.toString() ?? '0'}</p>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Issue Description"
                variant="outlined"
                value={formData.issueDesc}
                onChange={(e) => setFormData({ ...formData, issueDesc: e.target.value })}
              />
              <TextField
                fullWidth
                type="number"
                label={`Quorum (Total Supply: ${totalSupply?.toString() ?? 'Loading...'})`}
                variant="outlined"
                value={formData.quorum}
                onChange={(e) => setFormData({ ...formData, quorum: e.target.value })}
                error={!isQuorumValid}
                helperText={!isQuorumValid ? `Quorum cannot exceed total supply (${totalSupply?.toString()})` : ''}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
            setErrorMessage(null);
          }}>
            Cancel
          </Button>
          {isConnected && (hasClaimedData as boolean) && hasEnoughTokens && (
            <Button 
              type="submit" 
              disabled={isPending || !isQuorumValid || (isPendingSuccess && !!writeContractData)}
            >
              {isPending ? 'Creating...' : isPendingSuccess && !!writeContractData ? 'Processing...' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}