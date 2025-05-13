import { useState, useRef, useEffect } from "react";
import { useSyncProviders } from "../hooks/useSyncProviders";
import { formatAddress } from "../utils";
import { Button, Box, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { BrowserProvider, ethers } from 'ethers';
import { useWallet } from "./WalletProvider";

export const DiscoverWalletProviders = () => {
  // Use the wallet context directly
  const {
    account,
    setAccount,
    setProvider,
    setSigner,
    walletName,
    disconnectWallet
  } = useWallet();

  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail | null>(null);
  const providers = useSyncProviders();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Set selected wallet from persisted wallet name if available
  useEffect(() => {
    if (walletName && providers.length > 0 && !selectedWallet) {
      const matchingWallet = providers.find(p => p.info.name === walletName);
      if (matchingWallet) {
        setSelectedWallet(matchingWallet);
      }
    }
  }, [providers, walletName, selectedWallet]);

  // Handle dropdown open
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle dropdown close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Redirect to How It Works page
  const handleRedirect = () => {
    window.location.href = "/how-it-works";
  };

  // Connect to selected wallet
  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    try {
      const ethereumProvider = providerWithInfo.provider;

      const accounts: string[] | undefined = (await ethereumProvider
        .request({ method: "eth_requestAccounts" })
        .catch(console.error)) as string[] | undefined;

      if (accounts?.[0]) {
        setSelectedWallet(providerWithInfo);

        // Create ethers provider and signer
        const ethersProvider = new BrowserProvider(ethereumProvider);
        setProvider(ethersProvider);

        const ethersSigner = await ethersProvider.getSigner();
        setSigner(ethersSigner);

        // Set the account address and wallet name
        setAccount(accounts[0]);

        handleClose();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    disconnectWallet();
    setSelectedWallet(null);
    handleClose();
  };

  return (
    <>
      {providers.length > 0 ? (
        // Dropdown for wallet selection
        <Box>
          <Button
            onClick={handleClick}
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: account ? 'rgba(46, 196, 182, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: account ? 'rgba(46, 196, 182, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
              },
            }}
            endIcon={<ArrowDropDownIcon />}
          >
            {account ? (
              <>
                {selectedWallet && (
                  <Avatar
                    src={selectedWallet.info.icon}
                    alt={selectedWallet.info.name}
                    sx={{ width: 20, height: 20, mr: 1 }}
                  />
                )}
                {formatAddress(account)}
              </>
            ) : (
              <>
                <AccountBalanceWalletIcon sx={{ mr: 0.5 }} />
                Connect Wallet
              </>
            )}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }
            }}
          >
            {account ? (
              // If wallet connected - show disconnect option
              <MenuItem onClick={handleDisconnect} sx={{ minWidth: 200 }}>
                <Typography sx={{ color: '#f44336' }}>Disconnect Wallet</Typography>
              </MenuItem>
            ) : (
              // Show available wallets
              providers.map((provider: EIP6963ProviderDetail) => (
                <MenuItem
                  key={provider.info.uuid}
                  onClick={() => handleConnect(provider)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    minWidth: 200
                  }}
                >
                  <Avatar src={provider.info.icon} alt={provider.info.name} sx={{ width: 24, height: 24 }} />
                  <Typography>{provider.info.name}</Typography>
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
      ) : (
        // Button for when no wallets are detected
        <Button
          onClick={handleRedirect}
          sx={{
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
            },
          }}
        >
          <AccountBalanceWalletIcon sx={{ mr: 0.5 }} />
          Get Wallet
        </Button>
      )}
    </>
  );
};
