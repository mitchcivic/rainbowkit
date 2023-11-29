import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import {Chain, getDefaultWallets, RainbowKitProvider, Wallet} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {createWalletClient, Hex, http} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    goerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
import { MockConnector } from 'wagmi/connectors/mock';
import { ethers, providers } from 'ethers';
export declare type TransactionRequest = providers.TransactionRequest;

const wallet = ethers.Wallet.createRandom();
const privateKey = wallet.privateKey;

class CustomConnector extends MockConnector {
    constructor() {
        super({
            chains: [goerli],
            options: {
                walletClient: createWalletClient({
                    chain: goerli,
                    account: privateKeyToAccount(privateKey as Hex),
                    transport: http(),
                }),
            },

        });
    }

    async signTransaction(transactionRequest: TransactionRequest) {
        // Your mock implementation for signTransaction
        console.log('Mock signTransaction called', transactionRequest);
        return 'mocked-transaction-signature';
    }

    async signMessage(message: string) {
        // Your mock implementation for signMessage
        console.log('Mock signMessage called', message);
        return 'mocked-message-signature';
    }
}

export interface MyWalletOptions {
    chains: Chain[];
}

export const myCustomWallet = ({ chains }: MyWalletOptions): Wallet => ({
    id: 'my-custom-wallet',
    name: 'My Custom Wallet',
    iconUrl: 'https://my-image.xyz',
    iconBackground: '#0c2f78',
    createConnector: () => {
        const connector = new CustomConnector();

        return {
            connector,
            // You can customize mobile, qrCode, extension as per your requirement
            // ...
        };
    },
});


// Use CustomConnector in your application configuration
const customConnector = new CustomConnector();

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        zora,
        ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [goerli] : []),
    ],
    [publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: 'RainbowKit demo',
    projectId: 'YOUR_PROJECT_ID',
    chains,
});

const wagmiConfig = createConfig({
    connectors: [customConnector],
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <App />
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
