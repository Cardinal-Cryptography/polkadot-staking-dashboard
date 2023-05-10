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

/**
 * Checking values of "NETWORKS" instead of "NetworkName", because they're not
 * compatible between runtime (the former) and compile time (the latter), the former
 * having less fields defined and being the only safe one to use. This is obviously
 * a wrong types problem, but fixing these types requires a bigger refactor.
 */
const isValidConfiguredNetworkName = (value: unknown): value is NetworkName =>
  Object.keys(NETWORKS).includes(value as string);

const defaultNetworkName =
  process.env.NODE_ENV === 'production' &&
  isValidConfiguredNetworkName(NetworkName.AlephZero)
    ? NetworkName.AlephZero
    : NetworkName.AlephZeroTestnet;

const cachedNetworkName = localStorage.getItem('network');

export const initialNetworkName = isValidConfiguredNetworkName(
  cachedNetworkName
)
  ? cachedNetworkName
  : defaultNetworkName;

if (cachedNetworkName !== initialNetworkName) {
  localStorage.setItem('network', initialNetworkName);
}

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
