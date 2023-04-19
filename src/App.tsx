// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemesProvider } from 'contexts/Themes';
import { i18next } from 'locale';
import Providers from 'Providers';
import { I18nextProvider } from 'react-i18next';

const App = () => (
  <I18nextProvider i18n={i18next}>
    <ThemesProvider>
      <Providers />
    </ThemesProvider>
  </I18nextProvider>
);

export default App;
