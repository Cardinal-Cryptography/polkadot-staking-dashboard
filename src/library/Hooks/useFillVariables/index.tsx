// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { capitalizeFirstLetter, planckToUnit } from '@polkadot-cloud/utils';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolsConfig } from 'contexts/Pools/PoolsConfig';
import type { AnyJson, NetworkName } from 'types';

const networkToFirstYearInflation: Partial<Record<NetworkName, string>> = {
  'Aleph Zero': '27M',
  'Aleph Zero Testnet': '1000M',
};

export const useFillVariables = () => {
  const { network, consts } = useApi();
  const { stats } = usePoolsConfig();
  const {
    maxNominations,
    maxNominatorRewardedPerValidator,
    existentialDeposit,
  } = consts;
  const { minJoinBond, minCreateBond } = stats;
  const { metrics } = useNetworkMetrics();
  const { azeroCap, minimumActiveStake } = metrics;

  const fillVariables = (d: AnyJson, keys: string[]) => {
    const fields: AnyJson = Object.entries(d).filter(([k]: any) =>
      keys.includes(k)
    );
    const transformed = Object.entries(fields).map(
      ([, [key, val]]: AnyJson) => {
        const varsToValues = [
          [
            '{AZERO_CAP}',
            azeroCap
              .shiftedBy(-(consts.chainDecimals + 6))
              .toFormat({ suffix: 'M' }),
          ],
          [
            '{INFLATION_FIRST_YEAR}',
            networkToFirstYearInflation[network.name] ?? '-M',
          ],
          ['{NETWORK_UNIT}', network.unit],
          ['{NETWORK_NAME}', capitalizeFirstLetter(network.name)],
          [
            '{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}',
            maxNominatorRewardedPerValidator.toString(),
          ],
          ['{MAX_NOMINATIONS}', maxNominations.toString()],
          [
            '{MIN_ACTIVE_STAKE}',
            planckToUnit(minimumActiveStake, network.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_JOIN_BOND}',
            planckToUnit(minJoinBond, network.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{MIN_POOL_CREATE_BOND}',
            planckToUnit(minCreateBond, network.units)
              .decimalPlaces(3)
              .toFormat(),
          ],
          [
            '{EXISTENTIAL_DEPOSIT}',
            planckToUnit(existentialDeposit, network.units).toFormat(),
          ],
        ];

        for (const varToVal of varsToValues) {
          if (val.constructor === Array) {
            val = val.map((_d) => _d.replaceAll(varToVal[0], varToVal[1]));
          } else {
            val = val.replaceAll(varToVal[0], varToVal[1]);
          }
        }
        return [key, val];
      }
    );

    return {
      ...d,
      ...Object.fromEntries(transformed),
    };
  };

  return {
    fillVariables,
  };
};
