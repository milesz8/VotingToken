// index.tsx
import { Typography, Paper, Grid } from '@mui/material';
import { ConnectionWindow } from '../components/ConnectionWindow';

export default function Home() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Voting dApp
          </Typography>
          <Typography variant="body1">
            Connect your wallet to participate in decentralized voting
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <ConnectionWindow />
      </Grid>
    </Grid>
  );
}
