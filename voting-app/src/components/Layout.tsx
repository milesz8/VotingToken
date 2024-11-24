import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AppBar, Toolbar, Container, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { TokenBalance } from './TokenBalance';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }}>
              Voting dApp
            </Typography>
          </Link>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginLeft: 'auto' }}>
            <TokenBalance />
            <ConnectButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
} 