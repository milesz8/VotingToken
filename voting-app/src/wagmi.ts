import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  baseSepolia
} from 'wagmi/chains';

import { createConfig, http } from 'wagmi'

export const configReown = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '6e721d47365cbcbcbac5e8f4e455d54a',
  chains: (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [baseSepolia] : [base]),
  ssr: true,
  pollingInterval: 30_000,
});

const configQuickNode = createConfig({
  chains: (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [baseSepolia] : [base]),
  ssr: true,
  transports: {
    [baseSepolia.id]: http('https://quiet-crimson-friday.base-sepolia.quiknode.pro/c04fb0df701339421b04c4cc59785ddba5b284ee'),
    [base.id]: http('TODO'),
  },
  pollingInterval: 30_000,
});