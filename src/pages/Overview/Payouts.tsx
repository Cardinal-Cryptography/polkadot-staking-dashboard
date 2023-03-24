// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaxPayoutDays } from 'consts';
import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatSize, useSize } from 'library/Graphs/Utils';
import Spinner from 'library/Headers/Spinner';
import usePayouts from 'library/Hooks/usePayouts';
import { StatusLabel } from 'library/StatusLabel';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AVERAGE_WINDOW_SIZE = 10;

export const Payouts = () => {
  const { network } = useApi();
  const { payouts, loading, hasAnyPayouts } = usePayouts(
    MaxPayoutDays + AVERAGE_WINDOW_SIZE
  );
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();
  const { t } = useTranslation('pages');

  const ref = React.useRef<HTMLDivElement>(null);

  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 306);

  const [lastRewardEra, lastRewardValue] = payouts?.[payouts.length - 1] || [];

  return (
    <>
      <div className="head">
        <h4>{t('overview.recent_payouts')}</h4>
        <h2>
          {lastRewardValue ?? 0}
          &nbsp;{network.unit}
          &nbsp;
          <span className="fiat">
            {lastRewardEra ? `Era ${lastRewardEra}` : ''}
          </span>
        </h2>
      </div>
      <div className="inner" ref={ref} style={{ minHeight }}>
        {!loading && !hasAnyPayouts && (
          <StatusLabel
            status="sync_or_setup"
            title={t('overview.not_staking')}
            topOffset="37%"
          />
        )}
        {loading && <LoadingIndicator />}
        <div
          className="graph"
          style={{
            height: `${height}px`,
            width: `${width}px`,
            position: 'absolute',
            opacity: notStaking ? 0.75 : 1,
            transition: 'opacity 0.5s',
            marginTop: '1.5rem',
          }}
        >
          <PayoutBar
            payouts={payouts.slice(AVERAGE_WINDOW_SIZE)}
            height="160px"
          />
          <div style={{ marginTop: '3rem' }}>
            <PayoutLine
              payouts={payouts}
              averageWindowSize={AVERAGE_WINDOW_SIZE}
              height="70px"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payouts;

const LoadingIndicator = styled(Spinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 2;
`;
