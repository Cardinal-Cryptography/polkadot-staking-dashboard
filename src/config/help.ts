// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpItems } from 'contexts/Help/types';

export const HELP_CONFIG: HelpItems = [
  {
    key: 'overview',
    definitions: [
      'Dashboard Tips',
      'Total Nominators',
      'Active Nominators',
      'Your Balance',
      'Reserve Balance',
      'Network Stats',
      'Inflation',
      'Historical Rewards Rate',
      'Supply Staked',
    ],
    external: [
      [
        'dashboard_basics',
        'https://docs.alephzero.org/aleph-zero/dashboard/dashboard-basics',
        'docs.alephzero.org',
      ],
      [
        'how_to_start',
        'https://docs.alephzero.org/aleph-zero/stake/how-to-start-staking-with-the-aleph-zero-dashboard',
        'docs.alephzero.org',
      ],
    ],
  },
  {
    key: 'nominate',
    definitions: [
      'Nomination Status',
      'Stash and Controller Accounts',
      'Controller Account Eligibility',
      'Bonding',
      'Active Bond Threshold',
      'Reward Destination',
      'Nominating',
      'Nominations',
    ],
    external: [],
  },
  {
    key: 'pools',
    definitions: [
      'Nomination Pools',
      'Active Pools',
      'Minimum Join Bond',
      'Minimum Create Bond',
      'Pool Membership',
      'Bonded in Pool',
      'Pool Rewards',
      'Pool Roles',
    ],
    external: [],
  },
  {
    key: 'validators',
    definitions: [
      'Validator',
      'Active Validator',
      'Average Commission',
      'Era',
      'Epoch',
      'Era Points',
      'Self Stake',
      'Nominator Stake',
      'Commission',
      'Over Subscribed',
      'Blocked Nominations',
    ],
    external: [],
  },
  {
    key: 'payouts',
    definitions: ['Payout', 'Last Era Payout', 'Payout History'],
    external: [],
  },
  {
    key: 'community',
    definitions: [],
    external: [],
  },
];
