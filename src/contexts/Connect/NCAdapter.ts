import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';

let adapter: NightlyConnectAdapter | undefined;

export const getNCAdapter = async () => {
  try {
    if (adapter) return adapter;
    adapter = await NightlyConnectAdapter.build(
      {
        appMetadata: {
          name: 'NC TEST AlephZero',
          description: 'Nightly Connect Test',
          icon: 'https://docs.nightly.app/img/logo.png',
          additionalInfo: 'Courtesy of Nightly Connect team',
        },
        network: 'AlephZero',
      },
      {}
    );

    return adapter;
  } catch (error) {
    adapter = undefined;
    return undefined;
  }
};
