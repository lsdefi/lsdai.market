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
  gun: Gun(),
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
