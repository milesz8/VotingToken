import { useAccount } from 'wagmi';

export function ConnectionWindow() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="connection-window">
      <h2>Wallet Connection</h2>
      <div className="connection-status">
        {isConnecting && (
          <p className="connecting">
            Connecting wallet...
          </p>
        )}
        {isConnected && (
          <div>
            <p className="connected">Connected</p>
            <p className="address">Address: {formatAddress(address)}</p>
          </div>
        )}
        {isDisconnected && (
          <p className="disconnected">
            Please connect your wallet to access the voting system
          </p>
        )}
      </div>
    </div>
  );
}