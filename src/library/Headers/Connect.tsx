// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug, faWallet } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useEffect, useState } from 'react';
import { getNCAdapter } from 'contexts/Connect/NCAdapter';
import { type NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';
import { type ImportedAccount } from 'contexts/Connect/types';
import { ConnectedAccount, HeadingWrapper } from './Wrappers';

export const Connect = () => {
  const { t } = useTranslation('library');
  const { accounts, forgetAccounts, selector } = useConnect();
  const { openModal } = useOverlay().modal;
  const [adapter, setAdapter] = useState<NightlyConnectAdapter>();

  useEffect(() => {
    const initAdapter = async () => {
      const a = await getNCAdapter();
      setAdapter(a);
    };

    initAdapter();
  }, []);

  return (
    <HeadingWrapper>
      <ConnectedAccount>
        {accounts.length ? (
          selector === 'nightlyConnect' ? (
            <ButtonText
              text="Disconnect"
              iconRight={faPlug}
              iconTransform="grow-1"
              onClick={async () => {
                await adapter?.disconnect();
                forgetAccounts(accounts as ImportedAccount[]);
              }}
              style={{ color: 'black', fontSize: '1.05rem' }}
            />
          ) : (
            <>
              <ButtonText
                text={t('accounts')}
                iconLeft={faWallet}
                onClick={() => {
                  openModal({ key: 'Accounts' });
                }}
                style={{ color: 'black', fontSize: '1.05rem' }}
              />
              <span />
              <ButtonText
                text=""
                iconRight={faPlug}
                iconTransform="grow-1"
                onClick={() => {
                  openModal({ key: 'Connect' });
                }}
                style={{ color: 'black', fontSize: '1.05rem' }}
              />
            </>
          )
        ) : (
          <ButtonText
            text={t('connect')}
            iconRight={faPlug}
            iconTransform="grow-1"
            onClick={() => {
              openModal({ key: 'ChooseSelector' });
            }}
            style={{ color: 'black', fontSize: '1.05rem' }}
          />
        )}
      </ConnectedAccount>
    </HeadingWrapper>
  );
};
