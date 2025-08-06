import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const dispatch = useDispatch();
  const walletState = useSelector(
    (state) =>
      state.handleWallet || {
        isConnected: false,
        userAddress: null,
        userBalance: null,
        currentNetwork: null,
        isConnecting: false,
        error: null,
        transactions: [],
      }
  );

  // Network configurations
  const networks = {
    1: "Ethereum Mainnet",
    3: "Ropsten Testnet",
    4: "Rinkeby Testnet",
    5: "Goerli Testnet",
    137: "Polygon Mainnet",
    80001: "Polygon Mumbai",
    56: "BSC Mainnet",
    97: "BSC Testnet",
    42161: "Arbitrum One",
    421613: "Arbitrum Goerli",
  };

  // Initialize wallet connection on app load
  useEffect(() => {
    checkWalletConnection();
    setupEventListeners();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.log("No previous wallet connection found");
      }
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== walletState.userAddress) {
      connectWallet();
    }
  };

  const handleChainChanged = (chainId) => {
    const networkName =
      networks[parseInt(chainId, 16)] || `Chain ID: ${parseInt(chainId, 16)}`;
    dispatch({
      type: "WALLET_UPDATE_NETWORK",
      payload: networkName,
    });
    toast.success(`Network changed to ${networkName}`);
    // Refresh balance for new network
    if (walletState.isConnected) {
      updateBalance();
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error(
        "MetaMask is not installed! Please install MetaMask to continue."
      );
      return;
    }

    dispatch({ type: "WALLET_CONNECT_START" });

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];

      // Get balance using basic web3 approach
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      // Convert balance from wei to eth
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(
        4
      );

      // Get network
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const networkName =
        networks[parseInt(chainId, 16)] || `Chain ID: ${parseInt(chainId, 16)}`;

      dispatch({
        type: "WALLET_CONNECT_SUCCESS",
        payload: {
          address,
          balance: balanceInEth,
          network: networkName,
        },
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      dispatch({
        type: "WALLET_CONNECT_FAILURE",
        payload: error.message,
      });
      throw error;
    }
  };

  const disconnectWallet = () => {
    dispatch({ type: "WALLET_DISCONNECT" });
  };

  const updateBalance = async () => {
    if (walletState.userAddress) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [walletState.userAddress, "latest"],
        });
        const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(
          4
        );
        dispatch({
          type: "WALLET_UPDATE_BALANCE",
          payload: balanceInEth,
        });
      } catch (error) {
        console.error("Failed to update balance:", error);
      }
    }
  };

  const value = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    updateBalance,
    networks,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
