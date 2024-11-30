import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import weightedVoting from '../../../contracts/ignition/deployments/chain-84532/artifacts/WeightedVotingModule#WeightedVoting.json';
import deployedAddresses from '../../../contracts/ignition/deployments/chain-84532/deployed_addresses.json';
import { Vote } from '../Models/Vote';
import { Issue } from '../Models/Issue';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Box } from '@mui/material';
import { ClaimButton } from './ClaimButton';

export function VoteDialog({ issue }: { issue: Issue }) {
    const [open, setOpen] = React.useState(false);
    const { address, isConnected } = useAccount();
    const { data: hasClaimedData } = useReadContract({
        address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
        abi: weightedVoting.abi,
        functionName: "hasClaimed",
        args: isConnected ? [address] : undefined,
        query: { enabled: !!isConnected }
    });
    const { 
        writeContract: vote,
        isPending: voteIsPending,
        isSuccess: voteSuccess
    } = useWriteContract();

    React.useEffect(() => {
        if (voteSuccess) {
            window.dispatchEvent(new Event('voteCast'));
            setOpen(false);
        }
    }, [voteSuccess]);

    const handleVote = (voteType: Vote) => {
        vote({
            address: deployedAddresses['WeightedVotingModule#WeightedVoting'] as `0x${string}`,
            abi: weightedVoting.abi,
            functionName: "vote",
            args: [BigInt(issue.id), BigInt(voteType)],
        });
    };

    return (
        <>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setOpen(true)}
            >
                Vote
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="vote-dialog-title"
                aria-describedby="vote-dialog-description"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="vote-dialog-title">
                    {!isConnected 
                        ? 'Connect Wallet First' 
                        : !hasClaimedData 
                            ? 'Claim Tokens First' 
                            : 'Cast Your Vote'}
                </DialogTitle>
                <DialogContent>
                    {!isConnected ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                            <DialogContentText>You need to connect your wallet first.</DialogContentText>
                            <ConnectButton />
                        </Box>
                    ) : !hasClaimedData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <DialogContentText>You need to claim tokens first.</DialogContentText>
                            <ClaimButton />
                        </Box>
                    ) : (
                        <>
                            <DialogContentText id="vote-dialog-description">
                                <strong>Please select your voting position for issue:</strong>
                            </DialogContentText>
                            <DialogContentText sx={{ pl: 2, my: 2 }}>
                                "{issue.issueDesc}"
                            </DialogContentText>
                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {!!isConnected && !!hasClaimedData && (
                            <>
                                <Button
                                    onClick={() => handleVote(Vote.FOR)}
                                    color="success"
                                    variant="contained"
                                    disabled={voteIsPending}
                                >
                                    {voteIsPending ? 'Voting...' : 'Vote For'}
                                </Button>
                                <Button
                                    onClick={() => handleVote(Vote.AGAINST)}
                                    color="error"
                                    variant="contained"
                                    disabled={voteIsPending}
                                >
                                    {voteIsPending ? 'Voting...' : 'Vote Against'}
                                </Button>
                                <Button
                                    onClick={() => handleVote(Vote.ABSTAIN)}
                                    color="info"
                                    variant="contained"
                                    disabled={voteIsPending}
                                >
                                    {voteIsPending ? 'Voting...' : 'Abstain'}
                                </Button>
                            </>
                        )}
                    </Box>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}