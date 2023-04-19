// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import BN from 'bn.js';
import { NETWORKS } from 'config/networks';
import {
  ApiEndpoints,
  FallbackBondingDuration,
  FallbackExpectedBlockTime,
  FallbackExpectedEraTime,
  FallbackMaxElectingVoters,
  FallbackMaxNominations,
  FallbackNominatorRewardedPerValidator,
  FallbackSessionsPerEra,
} from 'consts';
import {
  APIConstants,
  APIContextInterface,
  ConnectionStatus,
} from 'contexts/Api/types';
import React, { useEffect, useState } from 'react';
import { AnyApi, Network, NetworkName } from 'types';
import * as defaults from './defaults';

const DEFAULT_NETWORK_NAME =
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_DISABLE_MAINNET !== '1'
    ? NetworkName.AlephZero
    : NetworkName.AlephZeroTestnet;

export const APIContext = React.createContext<APIContextInterface>(
  defaults.defaultApiContext
);

export const useApi = () => React.useContext(APIContext);

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
  // provider instance state
  // "provider"'s usage is added in a pending PR: https://github.com/Cardinal-Cryptography/aleph-zero-dashboard/pull/36
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [provider, setProvider] = useState<WsProvider | ScProvider | null>(
    null
  );

  // api instance state
  const [api, setApi] = useState<ApiPromise | null>(null);

  const [network, setNetwork] = useState(() => {
    // Accessing local storage in a useState initializer function to not repeat this blocking operation with every render
    const cache = localStorage.getItem('network');

    const cachedNetworkName = isNetworkName(cache)
      ? cache
      : DEFAULT_NETWORK_NAME;

    return {
      name: cachedNetworkName,
      meta: NETWORKS[cachedNetworkName],
    };
  });

  // constants state
  const [consts, setConsts] = useState<APIConstants>(defaults.consts);

  // connection status state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.Disconnected
  );

  const [isLightClient, setIsLightClient] = useState<boolean>(
    !!localStorage.getItem('isLightClient')
  );

  useEffect(() => {
    connect(network.name, isLightClient);
  }, []);

  const recreateApi = async (_provider: WsProvider | ScProvider) => {
    const _api = new ApiPromise({ provider: _provider });
    await _api.isReady;

    // constants
    const promises = [
      _api.consts.staking.bondingDuration,
      _api.consts.staking.maxNominations,
      _api.consts.staking.sessionsPerEra,
      _api.consts.staking.maxNominatorRewardedPerValidator,
      _api.consts.balances.existentialDeposit,
      _api.consts.staking.historyDepth,
      _api.consts.nominationPools.palletId,
    ];

    // fetch constants
    const _consts: AnyApi = await Promise.all(promises);

    // format constants
    const bondDuration = _consts[0]
      ? Number(_consts[0].toString())
      : FallbackBondingDuration;

    const maxNominations = _consts[1]
      ? Number(_consts[1].toString())
      : FallbackMaxNominations;

    const sessionsPerEra = _consts[2]
      ? Number(_consts[2].toString())
      : FallbackSessionsPerEra;

    const maxNominatorRewardedPerValidator = _consts[3]
      ? Number(_consts[3].toString())
      : FallbackNominatorRewardedPerValidator;

    const maxElectingVoters = FallbackMaxElectingVoters;

    const expectedBlockTime = FallbackExpectedBlockTime;

    const expectedEraTime = FallbackExpectedEraTime;

    const existentialDeposit = _consts[4]
      ? new BN(_consts[4].toString())
      : new BN(0);

    let historyDepth;
    if (_consts[5] !== undefined) {
      historyDepth = new BN(_consts[5].toString());
    } else {
      historyDepth = await _api.query.staking.historyDepth();
      historyDepth = new BN(historyDepth.toString());
    }

    const poolsPalletId = _consts[6] ? _consts[6].toU8a() : new Uint8Array(0);

    setApi(_api);
    setConsts({
      bondDuration,
      maxNominations,
      sessionsPerEra,
      maxNominatorRewardedPerValidator,
      historyDepth,
      maxElectingVoters,
      expectedBlockTime,
      expectedEraTime,
      poolsPalletId,
      existentialDeposit,
    });
  };

  // connect function sets provider and updates active network.
  const connect = async (
    networkName: NetworkName,
    _isLightClient?: boolean
  ) => {
    setConnectionStatus(ConnectionStatus.Connecting);

    const nodeEndpoint: Network = NETWORKS[networkName];
    const { endpoints } = nodeEndpoint;

    let _provider: WsProvider | ScProvider;
    if (_isLightClient && endpoints.lightClient) {
      _provider = new ScProvider(endpoints.lightClient);
      await _provider.connect();
    } else {
      _provider = new WsProvider(endpoints.rpc);
    }
    provider?.disconnect(); // Disconnect the previous provider - no need to wait for it, can be done in the background

    setNetwork({
      name: networkName,
      meta: NETWORKS[networkName],
    });

    setProvider(_provider);

    _provider.on('connected', () => {
      setConnectionStatus(ConnectionStatus.Connected);
    });
    _provider.on('error', () => {
      setConnectionStatus(ConnectionStatus.Disconnected);
    });

    recreateApi(_provider);
  };

  const switchNetwork = async (
    _network: NetworkName,
    _isLightClient: boolean
  ) => {
    localStorage.setItem('isLightClient', _isLightClient ? 'true' : '');
    localStorage.setItem('network', String(_network));
    setIsLightClient(_isLightClient);

    if (api) {
      await api.disconnect();
      setApi(null);
    }

    await connect(_network, _isLightClient);
  };

  // handles fetching of DOT price and updates context state.
  const fetchDotPrice = async () => {
    const urls = [
      `${ApiEndpoints.priceChange}${NETWORKS[network.name].api.priceTicker}`,
    ];
    const responses = await Promise.all(
      urls.map((u) => fetch(u, { method: 'GET' }))
    );
    const texts = await Promise.all(responses.map((res) => res.json()));
    const _change = texts[0];

    if (
      _change.lastPrice !== undefined &&
      _change.priceChangePercent !== undefined
    ) {
      const price: string = (Math.ceil(_change.lastPrice * 100) / 100).toFixed(
        2
      );
      const change: string = (
        Math.round(_change.priceChangePercent * 100) / 100
      ).toFixed(2);

      return {
        lastPrice: price,
        change,
      };
    }
    return null;
  };

  return (
    <APIContext.Provider
      value={{
        fetchDotPrice,
        switchNetwork,
        api,
        consts,
        isReady:
          connectionStatus === ConnectionStatus.Connected && api !== null,
        network: network.meta,
        status: connectionStatus,
        isLightClient,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

const isNetworkName = (value: unknown): value is NetworkName =>
  Object.values<unknown>(NetworkName).includes(value);
