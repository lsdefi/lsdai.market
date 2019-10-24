import Fortmatic from 'fortmatic';
import Gun from 'gun/gun';
import Portis from '@portis/web3';
import React from 'react';
import Squarelink from 'squarelink';
import Torus from '@toruslabs/torus-embed';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Connect from 'web3connect';

import { render } from 'react-dom';

import App from './App';

const props = {
  address: '',
  contractAddresses: {
    airswap: '0x8fd3121013a07c57f0d69646e86e7a4880b467b7',
    cDai: '0xf5dce57282a584d2746faf1593d3121fcac444dc',
    dai: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
    longD: '0x19225ba45478e63167ed9ff48430304a55be8e7e',
    shortD: '0xb57cf064b34ebee00826769130b5ae9730f698d7',
  },
  gun: Gun(['http://bot3.lsd.dmvt.io']),
  makerAddress: '0xfac1a9c3a6e8ce4b8f95c97c13d231101b026362',
  max256: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  network: 'mainnet',
  providerOptions: {
    fortmatic: {
      package: Fortmatic,
      options: { key: 'pk_live_EA9CF7F2EB1B24DA' },
    },
    portis: {
      package: Portis,
      options: { id: '98fe2b9c-a9cb-446b-b20d-c963b81ccc7c' },
    },
    squarelink: {
      provider: Squarelink,
      options: { id: '5d7e561c6032c2798999' },
    },
    torus: {
      package: Torus, // required
      options: {
        buildEnv: 'production', // optional
        buttonPosition: 'bottom-left', // optional
        enableLogging: false, // optional
        showTorusButton: true, // optional
      },
    },
    walletConnect: {
      package: WalletConnectProvider,
      options: { infuraId: '8752c18dec9d449ea6e9412e6e0ee3ff' },
    },
  },
  signer: undefined,
};

window.props = props;

const { network, providerOptions } = props;

props.web3Connect = new Web3Connect.Core({ network, providerOptions });

render(<App {...props} />, document.getElementById('App'));
