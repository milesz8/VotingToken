import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AppBar, Toolbar, Container, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Voting dApp
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Link href="/" passHref>
              <Button color="inherit">Home</Button>
            </Link>
            <Link href="/issues" passHref>
              <Button color="inherit">Issues</Button>
            </Link>
            <Link href="/claim" passHref>
              <Button color="inherit">Claim</Button>
            </Link>
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