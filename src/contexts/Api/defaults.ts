// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
import BN from 'bn.js';
import { NETWORKS } from 'config/networks';
import {
  APIConstants,
  APIContextInterface,
  ConnectionStatus,
} from 'contexts/Api/types';
import { NetworkName } from 'types';

const isNetworkName = (value: unknown): value is NetworkName =>
  Object.values<unknown>(NetworkName).includes(value);

const defaultNetworkName =
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_DISABLE_MAINNET !== '1'
    ? NetworkName.AlephZero
    : NetworkName.AlephZeroTestnet;

const cachedNetworkName = localStorage.getItem('network');

if (!isNetworkName(cachedNetworkName)) {
  localStorage.setItem('network', defaultNetworkName);
}

export const initialNetworkName = isNetworkName(cachedNetworkName)
  ? cachedNetworkName
  : defaultNetworkName;

export const consts: APIConstants = {
  bondDuration: 0,
  maxNominations: 0,
  sessionsPerEra: 0,
  maxNominatorRewardedPerValidator: 0,
  historyDepth: new BN(0),
  maxElectingVoters: 0,
  expectedBlockTime: 0,
  expectedEraTime: 0,
  existentialDeposit: new BN(0),
  poolsPalletId: stringToU8a('0'),
};

export const defaultApiContext: APIContextInterface = {
  fetchDotPrice: () => {},
  // eslint-disable-next-line
  switchNetwork: async (_network, _isLightClient) => {
    await new Promise((resolve) => resolve(null));
  },
  api: null,
  consts,
  isLightClient: false,
  isReady: false,
  status: ConnectionStatus.Disconnected,
  network: NETWORKS[initialNetworkName],
};
