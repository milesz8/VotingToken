import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Fab } from '@mui/material';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import AddIcon from '@mui/icons-material/Add';

export function CreateIssueDialog() {
  const [open, setOpen] = useState(false);
  const [issueDesc, setIssueDesc] = useState('');
  const [quorum, setQuorum] = useState('');

  const { error: createIssueIsError, writeContract: createIssue, isPending: createIssueIsPending, data: createIssueHash } = useWriteContract();

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
      setOpen(false);
      window.dispatchEvent(new Event('issueCreated'));
    }
  }, [createIssueSuccess]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!issueDesc || !quorum) return;

    createIssue({
      address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
      abi: weightedVoting.abi,
      functionName: "createIssue",
      args: [issueDesc, BigInt(quorum)],
    });
  };

  const { address, isConnected } = useAccount();
  const [isTokensClaimed, setIsTokensClaimed] = useState(false);
  const { data: hasClaimedData } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: "hasClaimed",
        args: isConnected ? [address] : undefined,
        query: {
            enabled: !!isConnected,
        }
    });
    useEffect(() => {
        setIsTokensClaimed(!!hasClaimedData);
    }, [hasClaimedData]);

  return (
    <React.Fragment>
      <Fab color="primary" size="small" aria-label="add" onClick={() => setOpen(true)}>
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Create Issue</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={createIssueIsPending}>
            {createIssueIsPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}