// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import Identicon from 'library/Identicon';
import { Title } from 'library/Modal/Title';
import {
  StatWrapper,
  ValidatorMetricsStatsWrapper,
} from 'library/Modal/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { PaddingWrapper } from 'modals/Wrappers';
import { clipAddress, humanNumber, planckBnToUnit, rmCommas } from 'Utils';

export const ValidatorMetrics = () => {
  const {
    network: { units, unit },
  } = useApi();
  const { config } = useModal();
  const { address, identity } = config;
  const { eraStakers } = useStaking();
  const { stakers } = eraStakers;

  // is the validator in the active era
  const validatorInEra =
    stakers.find((s: any) => s.address === address) || null;

  let ownStake = new BN(0);
  let otherStake = new BN(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;

    others.forEach((o: any) => {
      otherStake = otherStake.add(new BN(rmCommas(o.value)));
    });
    if (own) {
      ownStake = new BN(rmCommas(own));
    }
  }

  const stats = [
    {
      label: 'Self Stake',
      value: `${humanNumber(planckBnToUnit(ownStake, units))} ${unit}`,
      help: 'Self Stake',
    },
    {
      label: 'Nominator Stake',
      value: `${humanNumber(planckBnToUnit(otherStake, units))} ${unit}`,
      help: 'Nominator Stake',
    },
  ];
  return (
    <>
      <Title title="Validator Metrics" />
      <div className="header">
        <Identicon value={address} size={33} />
        <h2>
          &nbsp;&nbsp;
          {identity === null ? clipAddress(address) : identity}
        </h2>
      </div>

      <PaddingWrapper horizontalOnly>
        <ValidatorMetricsStatsWrapper>
          {stats.map(
            (s: { label: string; value: string; help: string }, i: number) => (
              <StatWrapper key={`metrics_stat_${i}`}>
                <div className="inner">
                  <h4>
                    {s.label} <OpenHelpIcon helpKey={s.help} />
                  </h4>
                  <h2>{s.value}</h2>
                </div>
              </StatWrapper>
            )
          )}
        </ValidatorMetricsStatsWrapper>
      </PaddingWrapper>
    </>
  );
};

export default ValidatorMetrics;
