import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const configReown = getDefaultConfig({
  appName: 'Voting dApp',
  projectId: '29da4dea30c342341a92df5239a25d2a',
  chains: [base],
  ssr: true,
  pollingInterval: 30_000,
});
