import { combineReducers } from "redux";
import handleCart from "./handleCart";
import handleWallet from "./handleWallet";

const rootReducers = combineReducers({
  handleCart,
  handleWallet,
});

export default rootReducers;
