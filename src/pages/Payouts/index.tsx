// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaxPayoutDays } from 'consts';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatSize, useSize } from 'library/Graphs/Utils';
import {
  CardHeaderWrapper,
  CardWrapper,
  GraphWrapper,
} from 'library/Graphs/Wrappers';
import Spinner from 'library/Headers/Spinner';
import usePayouts from 'library/Hooks/usePayouts';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import StatusLabel from 'library/StatusLabel';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageRowWrapper } from 'Wrappers';
import { PageProps } from '../types';
import { PayoutList } from './PayoutList';
import LastEraPayoutStatBox from './Stats/LastEraPayout';

const AVERAGE_WINDOW_SIZE = 10;

export const Payouts = (props: PageProps) => {
  const { t } = useTranslation();

  const { page } = props;
  const { key } = page;

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 300);

  const { loading, payouts, hasAnyPayouts } = usePayouts(
    MaxPayoutDays + AVERAGE_WINDOW_SIZE
  );
  const { fromEra, toEra } = useMemo(
    // @ts-ignore TS7031: Something's off with build config as, contrary to the error, "era"'s type is easily inferable
    () => calcErasRange(payouts.map(([era]) => era)),
    [payouts]
  );

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <StatBoxList>
        <LastEraPayoutStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <GraphWrapper>
          <CardHeaderWrapper padded>
            <h4>
              {t('payouts.payout_history', { ns: 'pages' })}
              <OpenHelpIcon helpKey="Payout History" />
            </h4>
            <h2>
              {fromEra && toEra ? (
                <>
                  {fromEra}
                  {fromEra !== toEra && <>&nbsp;-&nbsp;{toEra}</>}
                </>
              ) : (
                t('payouts.none', { ns: 'pages' })
              )}
            </h2>
          </CardHeaderWrapper>
          <div className="inner" ref={ref} style={{ minHeight }}>
            {!loading && !hasAnyPayouts && (
              <StatusLabel
                status="sync_or_setup"
                title={t('payouts.not_staking', { ns: 'pages' })}
                topOffset="30%"
              />
            )}
            {loading && <LoadingIndicator />}
            <div
              className="graph"
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                opacity: hasAnyPayouts && !loading ? 1 : 0.75,
                transition: 'opacity 0.5s',
              }}
            >
              <PayoutBar
                payouts={payouts.slice(AVERAGE_WINDOW_SIZE)}
                height="150px"
              />
              <PayoutLine
                payouts={payouts}
                averageWindowSize={AVERAGE_WINDOW_SIZE}
                height="75px"
              />
            </div>
          </div>
        </GraphWrapper>
      </PageRowWrapper>
      {payouts && hasAnyPayouts ? (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper>
            <PayoutList
              title={t('payouts.recent_payouts', { ns: 'pages' })}
              payouts={payouts}
              pagination
            />
          </CardWrapper>
        </PageRowWrapper>
      ) : (
        <></>
      )}
    </>
  );
};

export default Payouts;

const calcErasRange = (allEras: number[]) =>
  allEras.reduce(
    (acc, era) => {
      if (era < acc.fromEra) return { ...acc, fromEra: era };
      if (era > acc.toEra) return { ...acc, toEra: era };
      return acc;
    },
    { fromEra: allEras[0], toEra: allEras[0] }
  );

const LoadingIndicator = styled(Spinner)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  z-index: 2;
`;
