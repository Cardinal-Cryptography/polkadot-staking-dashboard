// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  PageHeading,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { CardWrapper } from 'library/Card/Wrappers';
import { ActiveAccounts } from './ActiveAccounts';
import { BalanceChart } from './BalanceChart';
import { BalanceLinks } from './BalanceLinks';
import { NetworkStats } from './NetworkSats';
import { Payouts } from './Payouts';
import { StakeStatus } from './StakeStatus';
import PayoutsErrorBoundary from './PayoutsErrorBoundary';
import { Warning } from '../../library/Form/Warning';

export const Overview = () => {
  const { t } = useTranslation('pages');

  const PAYOUTS_HEIGHT = 380;

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      <PageRow>
        <PageHeading>
          <ActiveAccounts />
        </PageHeading>
      </PageRow>
      <Warning
        text={t(
          'On December 16th, the Mainnet decentralizes as 9 AZF nodes are replaced by community validators in the block finalization committee. If you’re staking with an AZF node, switch to a Community Validator to keep earning rewards!'
        )}
      />
      <PageRow>
        <StakeStatus />
      </PageRow>
      <PageRow>
        <RowSection secondary>
          <CardWrapper height={PAYOUTS_HEIGHT}>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </RowSection>
        <RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
            <PayoutsErrorBoundary>
              <Payouts />
            </PayoutsErrorBoundary>
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <NetworkStats />
      </PageRow>
    </>
  );
};
