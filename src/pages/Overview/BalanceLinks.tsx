// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert, Separator } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { NetworkNameEnum } from 'types';
import { MoreWrapper } from './Wrappers';

export const BalanceLinks = () => {
  const { t } = useTranslation('pages');
  const { name } = useApi().network;
  const { activeAccount } = useConnect();
  const networkNameDomainPart = name.toLocaleLowerCase().replaceAll(' ', '');

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${networkNameDomainPart}.subscan.io/account/${activeAccount}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Subscan"
          marginRight
          disabled={name !== NetworkNameEnum.AlephZero}
        />
      </section>
    </MoreWrapper>
  );
};
