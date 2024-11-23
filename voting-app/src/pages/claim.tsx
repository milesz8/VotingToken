import { Typography, Grid } from '@mui/material';
import { TokenInfo } from '../components/TokenInfo';

export default function Claim() {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom align="center">
          Claim Your Tokens
        </Typography>
        <TokenInfo />
      </Grid>
    </Grid>
  );
} 