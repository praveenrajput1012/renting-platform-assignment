import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWallet } from '../utils/WalletContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const { 
        isConnected, 
        userAddress, 
        userBalance, 
        currentNetwork, 
        connectWallet, 
        disconnectWallet,
        isConnecting 
    } = useWallet();

    const [showWalletDropdown, setShowWalletDropdown] = useState(false);

    const handleWalletAction = async () => {
        if (isConnected) {
            await disconnectWallet();
            toast.success('Wallet disconnected');
        } else {
            try {
                await connectWallet();
                toast.success('Wallet connected successfully!');
            } catch (error) {
                toast.error('Failed to connect wallet');
            }
        }
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatBalance = (balance) => {
        if (!balance) return '0.0000';
        return parseFloat(balance).toFixed(4);
    };

    const getNetworkColor = (network) => {
        const colors = {
            'Ethereum Mainnet': 'text-primary',
            'Polygon Mainnet': 'text-purple',
            'BSC Mainnet': 'text-warning',
            'Arbitrum One': 'text-info',
            default: 'text-secondary'
        };
        return colors[network] || colors.default;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> 
                    🛒 Ecommerce
                </NavLink>
                <button 
                    className="navbar-toggler mx-2" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    
                    <div className="buttons text-center d-flex align-items-center">
                        {/* Wallet Connection Section */}
                        {isConnected ? (
                            <div className="dropdown me-2">
                                <button 
                                    className="btn btn-success dropdown-toggle d-flex align-items-center" 
                                    type="button" 
                                    id="walletDropdown" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false"
                                    onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                                >
                                    <i className="fa fa-wallet me-1"></i>
                                    <span className="d-none d-md-inline">
                                        {formatAddress(userAddress)}
                                    </span>
                                    <span className="d-md-none">
                                        Wallet
                                    </span>
                                </button>
                                <ul className={`dropdown-menu ${showWalletDropdown ? 'show' : ''}`} aria-labelledby="walletDropdown">
                                    <li className="dropdown-item-text">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Address:</small>
                                            <code className="small">{formatAddress(userAddress)}</code>
                                        </div>
                                    </li>
                                    <li className="dropdown-item-text">
                                        <div className="d-flex flex-column">
                                            <small className="text-muted">Balance:</small>
                                            <span className="fw-bold text-success">
                                                {formatBalance(userBalance)} ETH
                                            </span>
                                        </div>
                                    </li>
                                    {currentNetwork && (
                                        <li className="dropdown-item-text">
                                            <div className="d-flex flex-column">
                                                <small className="text-muted">Network:</small>
                                                <span className={`small fw-bold ${getNetworkColor(currentNetwork)}`}>
                                                    {currentNetwork}
                                                </span>
                                            </div>
                                        </li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button 
                                            className="dropdown-item text-danger" 
                                            onClick={handleWalletAction}
                                        >
                                            <i className="fa fa-sign-out-alt me-1"></i>
                                            Disconnect
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <button 
                                className="btn btn-outline-primary me-2 d-flex align-items-center" 
                                onClick={handleWalletAction}
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-1" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa fa-wallet me-1"></i>
                                        <span className="d-none d-md-inline">Connect Wallet</span>
                                        <span className="d-md-none">Wallet</span>
                                    </>
                                )}
                            </button>
                        )}

                        {/* Existing buttons */}
                        <NavLink to="/login" className="btn btn-outline-dark me-2">
                            <i className="fa fa-sign-in-alt me-1"></i> 
                            <span className="d-none d-md-inline">Login</span>
                        </NavLink>
                        <NavLink to="/register" className="btn btn-outline-dark me-2">
                            <i className="fa fa-user-plus me-1"></i> 
                            <span className="d-none d-md-inline">Register</span>
                        </NavLink>
                        <NavLink to="/cart" className="btn btn-outline-dark position-relative">
                            <i className="fa fa-shopping-cart me-1"></i> 
                            <span className="d-none d-md-inline">Cart</span>
                            {state.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {state.length}
                                    <span className="visually-hidden">items in cart</span>
                                </span>
                            )}
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;