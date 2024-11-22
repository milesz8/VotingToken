import { useAccount } from 'wagmi';
import { Paper, Typography, Box } from '@mui/material';
import { CircularProgress } from '@mui/material';

export function ConnectionWindow() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Wallet Connection
      </Typography>
      <Box sx={{ mt: 2 }}>
        {isConnecting && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>
              Connecting wallet...
            </Typography>
          </Box>
        )}
        {isConnected && (
          <Box>
            <Typography color="success.main" gutterBottom>
              Connected
            </Typography>
            <Typography variant="body2">
              Address: {formatAddress(address)}
            </Typography>
          </Box>
        )}
        {isDisconnected && (
          <Typography color="error.main">
            Please connect your wallet to access the voting system
          </Typography>
        )}
      </Box>
    </Paper>
  );
}