import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AppBar, Toolbar, Container, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { TokenBalance } from './TokenBalance';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppBar position="static">
        <Toolbar sx={{ height: '64px', justifyContent: 'space-between' }}>
          <Link href="/" passHref>
            <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }}>
              Voting dApp
            </Typography>
          </Link>
          <TokenBalance />
          <ConnectButton />
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: 'calc(100vh - 96px)'
        }}
      >
        {children}
      </Container>
    </Box>
  );
} 