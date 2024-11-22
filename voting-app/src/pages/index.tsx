// index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectionWindow } from '../components/ConnectionWindow';
import { IssueList } from '../components/IssueList';
import { TokenInfo } from '../components/TokenInfo';
import { CreateIssue } from '../components/CreateIssue';
import { Grid2, Stack } from '@mui/material';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Grid2 container spacing={6} sx={{ width: '100%' }}>
            <Grid2 size={2}>
              <Stack direction="column" spacing={2}>
                <ConnectButton />
                <ConnectionWindow />
              </Stack>
            </Grid2>
            <Grid2 size={2}>
                <TokenInfo />
            </Grid2>
            <Grid2 size={2}>
                <CreateIssue />
            </Grid2>
        </Grid2>

        <IssueList />
      </main>
    </div>
  );
};

export default Home;
