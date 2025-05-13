import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BrowserProvider, ethers } from 'ethers';

// Define the context type
type WalletContextType = {
  provider: BrowserProvider | null;
  setProvider: (provider: BrowserProvider | null) => void;
  signer: ethers.Signer | null;
  setSigner: (signer: ethers.Signer | null) => void;
  account: string;
  setAccount: (account: string) => void;
  walletName: string;
  disconnectWallet: () => void;
};

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Custom hook for using the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Storage keys
const STORAGE_KEYS = {
  ACCOUNT: 'blockchain_voting_account',
  WALLET_NAME: 'blockchain_voting_wallet_name',
};

// Props type
type WalletProviderProps = {
  children: ReactNode;
};

// Wallet Provider component
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string>('');
  const [walletName, setWalletName] = useState<string>('');

  // Disconnect wallet and clear storage
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount('');
    setWalletName('');
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT);
    localStorage.removeItem(STORAGE_KEYS.WALLET_NAME);
  };

  // Function to listen for account changes
  const setupAccountsChangedListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // User switched accounts
          setAccount(accounts[0]);
          localStorage.setItem(STORAGE_KEYS.ACCOUNT, accounts[0]);

          // We need to update the signer for the new account
          if (provider) {
            const updateSigner = async () => {
              try {
                const newSigner = await provider.getSigner();
                setSigner(newSigner);
              } catch (err) {
                console.error("Failed to get signer after account change:", err);
              }
            };
            updateSigner();
          }
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Reload the page on chain change as recommended by MetaMask
        window.location.reload();
      });
    }
  };

  // Effect to try auto-reconnect on startup
  useEffect(() => {
    const init = async () => {
      // Check if we have a stored account
      const storedAccount = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
      const storedWalletName = localStorage.getItem(STORAGE_KEYS.WALLET_NAME);

      if (!storedAccount || !window.ethereum) return;

      try {
        // Attempt to reconnect
        const ethereumProvider = window.ethereum;

        // We don't prompt the user for permission if just refreshing
        // Just check if the accounts array includes our stored account
        const accounts = await ethereumProvider.request({ method: 'eth_accounts' });

        if (accounts.includes(storedAccount)) {
          // We're still connected to the same account
          const ethersProvider = new BrowserProvider(ethereumProvider);
          setProvider(ethersProvider);

          const ethersSigner = await ethersProvider.getSigner();
          setSigner(ethersSigner);

          setAccount(storedAccount);
          if (storedWalletName) setWalletName(storedWalletName);

          // Setup listeners for account/chain changes
          setupAccountsChangedListener();
        } else {
          // The stored account is no longer available
          disconnectWallet();
        }
      } catch (error) {
        console.error("Failed to auto-reconnect wallet:", error);
        disconnectWallet();
      }
    };

    init();
  }, []);

  // Persisting the account and wallet name when they change
  useEffect(() => {
    if (account) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT, account);
    }
  }, [account]);

  useEffect(() => {
    if (walletName) {
      localStorage.setItem(STORAGE_KEYS.WALLET_NAME, walletName);
    }
  }, [walletName]);

  const value = {
    provider,
    setProvider,
    signer,
    setSigner,
    account,
    setAccount,
    walletName,
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};