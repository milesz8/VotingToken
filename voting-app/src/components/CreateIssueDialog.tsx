import * as React from 'react';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box, Fab, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { ClaimButton } from './ClaimButton';

interface IssueFormData {
  issueDesc: string;
  quorum: string;
}

function useIssueCreation() {
  const [formData, setFormData] = useState<IssueFormData>({ issueDesc: '', quorum: '100' });
  const [open, setOpen] = useState(false);

  const { error, writeContract, isPending, data: hash } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (error) console.error('Error creating issue:', error);
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({ issueDesc: '', quorum: '100' });
      setOpen(false);
      window.dispatchEvent(new Event('issueCreated'));
    }
  }, [isSuccess]);

  return {
    formData,
    setFormData,
    open,
    setOpen,
    writeContract,
    isPending,
  };
}

export function CreateIssueDialog() {
  const { formData, setFormData, open, setOpen, writeContract, isPending } = useIssueCreation();
  const { address, isConnected } = useAccount();
  const [isTokensClaimed, setIsTokensClaimed] = useState(false);

  const { data: hasClaimedData } = useReadContract({
    address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
    abi: weightedVoting.abi,
    functionName: "hasClaimed",
    args: isConnected ? [address] : undefined,
    query: { enabled: !!isConnected }
  });

  useEffect(() => {
    setIsTokensClaimed(!!hasClaimedData);
  }, [hasClaimedData]);

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
            : !isTokensClaimed 
              ? 'Claim Tokens First' 
              : 'Create Issue'}
        </DialogTitle>
        <DialogContent>
          {!isConnected ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
              <p>You need to connect your wallet first.</p>
              <ConnectButton />
            </Box>
          ) : !isTokensClaimed ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <p>You need to claim tokens first.</p>
              <ClaimButton />
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
                label="Quorum"
                variant="outlined"
                value={formData.quorum}
                onChange={(e) => setFormData({ ...formData, quorum: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          {isConnected && isTokensClaimed && (
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}