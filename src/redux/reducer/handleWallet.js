const initialState = {
  isConnected: false,
  userAddress: null,
  userBalance: null,
  currentNetwork: null,
  isConnecting: false,
  error: null,
  transactions: [],
};

const handleWallet = (state = initialState, action) => {
  switch (action.type) {
    case "WALLET_CONNECT_START":
      return {
        ...state,
        isConnecting: true,
        error: null,
      };

    case "WALLET_CONNECT_SUCCESS":
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        userAddress: action.payload.address,
        userBalance: action.payload.balance,
        currentNetwork: action.payload.network,
        error: null,
      };

    case "WALLET_CONNECT_FAILURE":
      return {
        ...state,
        isConnecting: false,
        error: action.payload,
      };

    case "WALLET_DISCONNECT":
      return {
        ...initialState,
      };

    case "WALLET_UPDATE_BALANCE":
      return {
        ...state,
        userBalance: action.payload,
      };

    case "WALLET_UPDATE_NETWORK":
      return {
        ...state,
        currentNetwork: action.payload,
      };

    case "WALLET_ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    default:
      return state;
  }
};

export default handleWallet;
