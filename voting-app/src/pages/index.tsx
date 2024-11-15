// index.tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectionWindow } from '../components/ConnectionWindow';
import { IssueList } from '../components/IssueList';
import { TokenInfo } from '../components/TokenInfo';
import { CreateIssue } from '../components/CreateIssue';
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ConnectButton />
        <ConnectionWindow />
        <TokenInfo />
        <CreateIssue />
        <IssueList />
      </main>
    </div>
  );
};

export default Home;
