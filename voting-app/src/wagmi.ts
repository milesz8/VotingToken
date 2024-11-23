import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  baseSepolia
} from 'wagmi/chains';

import { createConfig, http } from 'wagmi'

const QUICKNODE_BASE_SEPOLIA_URL = process.env.NEXT_PUBLIC_QUICKNODE_BASE_SEPOLIA_URL;
const QUICKNODE_BASE_URL = process.env.NEXT_PUBLIC_QUICKNODE_BASE_URL;

export const configReown = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '6e721d47365cbcbcbac5e8f4e455d54a',
  chains: (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [baseSepolia] : [base]),
  ssr: true,
  pollingInterval: 30_000,
});

export const configQuickNode = createConfig({
  chains: (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [baseSepolia] : [base]),
  ssr: true,
  transports: {
    [baseSepolia.id]: http(QUICKNODE_BASE_SEPOLIA_URL),
    [base.id]: http(QUICKNODE_BASE_URL),
  },
  pollingInterval: 30_000,
});