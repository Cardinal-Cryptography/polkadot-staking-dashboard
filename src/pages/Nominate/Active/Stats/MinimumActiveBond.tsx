// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useStaking } from 'contexts/Staking';
import { Number } from 'library/StatBoxList/Number';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';

export const MinimumActiveBondStatBox = () => {
  const { network } = useApi();
  const { staking } = useStaking();
  const { t } = useTranslation('pages');

  const params = {
    label: t('nominate.minimum_active_bond'),
    value: planckBnToUnit(staking.minNominatorBond, network.units),
    unit: network.unit,
    helpKey: 'Bonding',
  };

  return <Number {...params} />;
};

export default MinimumActiveBondStatBox;
