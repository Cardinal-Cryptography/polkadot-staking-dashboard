// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PayoutListProps {
  allowMoreCols?: boolean;
  pagination?: boolean;
  disableThrottle?: boolean;
  title?: string | null;
  payouts: [number, number][];
}
