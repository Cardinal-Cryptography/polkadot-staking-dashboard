// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BN, BN_MILLION } from '@polkadot/util';
import { DefaultParams } from 'consts';
import { ReactComponent as AzeroIconSVG } from 'img/a0_icon.svg';
import { ReactComponent as AzeroInlineSVG } from 'img/a0_inline.svg';
import { ReactComponent as AzeroLogoSVG } from 'img/a0_logo.svg';
import type { Networks } from 'types';

export const NetworkList: Networks = {};

if (import.meta.env.VITE_DISABLE_MAINNET !== '1') {
  const alephZero = {
    name: 'Aleph Zero',
    endpoints: {
      rpc: 'wss://ws.azero.dev',
      lightClient: null,
    },
    namespace: '',
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
      pending: {
        light: 'rgb(0, 204, 171, 0.33)',
        dark: 'rgb(0, 204, 171, 0.33)',
      },
    },
    unit: 'AZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      token: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'AZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
    defaultFeeReserve: 0.1,
  } as const;

  NetworkList[alephZero.name] = alephZero;
}

if (import.meta.env.VITE_DISABLE_TESTNET !== '1') {
  const alephZeroTestnet = {
    name: 'Aleph Zero Testnet',
    endpoints: {
      rpc: 'wss://ws.test.azero.dev',
      lightClient: null,
    },
    namespace: '',
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
      pending: {
        light: 'rgb(0, 204, 171, 0.33)',
        dark: 'rgb(0, 204, 171, 0.33)',
      },
    },
    unit: 'TZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      token: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'TZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
    defaultFeeReserve: 0.1,
  } as const;

  NetworkList[alephZeroTestnet.name] = alephZeroTestnet;
}
if (import.meta.env.VITE_ENABLE_CUSTOM_NETWORK === '1') {
  const azeroCustom = {
    name: 'Aleph Zero Custom',
    endpoints: {
      rpc: import.meta.env.VITE_CUSTOM_WS_ADDRESS ?? '',
      lightClient: null,
    },
    namespace: '',
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
      pending: {
        light: 'rgb(0, 204, 171, 0.33)',
        dark: 'rgb(0, 204, 171, 0.33)',
      },
    },
    unit: 'CZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      token: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'CZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
    defaultFeeReserve: 0.1,
  } as const;

  NetworkList[azeroCustom.name] = azeroCustom;
}

if (import.meta.env.VITE_DISABLE_DEVNET !== '1') {
  const azeroDevnet = {
    name: 'Aleph Zero Devnet',
    endpoints: {
      rpc: 'wss://ws.dev.azero.dev',
      lightClient: null,
    },
    namespace: '',
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
      pending: {
        light: 'rgb(0, 204, 171, 0.33)',
        dark: 'rgb(0, 204, 171, 0.33)',
      },
    },
    unit: 'DZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      token: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'DZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
    defaultFeeReserve: 0.1,
  } as const;

  NetworkList[azeroDevnet.name] = azeroDevnet;
}

if (import.meta.env.MODE === 'development') {
  const azeroLocal = {
    name: 'Aleph Zero Local',
    endpoints: {
      rpc: 'ws://localhost:9944',
      lightClient: null,
    },
    namespace: '',
    colors: {
      primary: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      secondary: {
        light: '#00eac7',
        dark: '#00eac7',
      },
      stroke: {
        light: '#00ccab',
        dark: '#00ccab',
      },
      transparent: {
        light: 'rgba(0, 204, 171, .5)',
        dark: 'rgba(0, 204, 171, .5)',
      },
      pending: {
        light: 'rgb(0, 204, 171, 0.33)',
        dark: 'rgb(0, 204, 171, 0.33)',
      },
    },
    unit: 'LZERO',
    units: 12,
    ss58: 42,
    brand: {
      icon: AzeroIconSVG,
      token: AzeroIconSVG,
      logo: {
        svg: AzeroLogoSVG,
        width: '8.5rem',
      },
      inline: {
        svg: AzeroInlineSVG,
        size: '1.2rem',
      },
    },
    api: {
      unit: 'LZERO',
      priceTicker: 'DOTUSDT', // this is for compatibility with binance endpoint, it's pinged for current token value, but we don't display that value
    },
    params: {
      ...DefaultParams,
      stakeTarget: 0.5,
      yearlyInflationInTokens: BN_MILLION.mul(new BN(30)).toNumber(),
    },
    defaultFeeReserve: 0.1,
  } as const;

  NetworkList[azeroLocal.name] = azeroLocal;
}
