// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useNetworkMetrics } from 'contexts/Network';
import useInflation from 'library/Hooks/useInflation';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { toFixedIfNecessary } from 'Utils';
import { InflationWrapper } from './Wrappers';

export const Inflation = () => {
  const { metrics } = useNetworkMetrics();
  const { inflation, stakedReturn } = useInflation();
  const { t } = useTranslation('pages');

  const { totalIssuance } = metrics;

  return (
    <InflationWrapper>
      <section>
        <div className="items">
          <div>
            <div className="inner">
              <h2>
                {totalIssuance.toString() === '0'
                  ? '0'
                  : toFixedIfNecessary(stakedReturn, 2)}
                %
              </h2>
              <h4>
                {t('overview.historical_rewards_rate')}{' '}
                <OpenHelpIcon helpKey="Historical Rewards Rate" />
              </h4>
            </div>
          </div>
          <div>
            <div className="inner">
              <h2>
                {totalIssuance.toString() === '0'
                  ? '0'
                  : toFixedIfNecessary(inflation, 2)}
                %
              </h2>
              <h4>
                {t('overview.inflation')} <OpenHelpIcon helpKey="Inflation" />
              </h4>
            </div>
          </div>
        </div>
      </section>
    </InflationWrapper>
  );
};
