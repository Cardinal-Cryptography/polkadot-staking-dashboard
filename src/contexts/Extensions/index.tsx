// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { EXTENSIONS } from 'config/extensions';
import {
  Extension,
  ExtensionsContextInterface,
} from 'contexts/Extensions/types';
import React, { useEffect, useRef, useState } from 'react';
import { setStateWithRef } from 'Utils';
import { defaultExtensionsContext } from './defaults';

export const ExtensionsContext =
  React.createContext<ExtensionsContextInterface>(defaultExtensionsContext);

export const useExtensions = () => React.useContext(ExtensionsContext);

export const ExtensionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // store the installed extensions in state
  const [extensions, setExtensions] = useState<Array<Extension> | null>(null);

  // store whether extensions have been fetched
  const [extensionsFetched, setExtensionsFetched] = useState(false);

  // store each extension's status in state.
  const [extensionsStatus, setExtensionsStatus] = useState<{
    [key: string]: string;
  }>({});
  const extensionsStatusRef = useRef(extensionsStatus);

  // initialise extensions.
  useEffect(() => {
    if (!extensions) {
      // timeout for initialising injectedWeb3
      setTimeout(() => setExtensions(getInstalledExtensions()), 200);
    }
  });

  const setExtensionStatus = (id: string, status: string) => {
    setStateWithRef(
      Object.assign(extensionsStatusRef.current, {
        [id]: status,
      }),
      setExtensionsStatus,
      extensionsStatusRef
    );
  };

  const getInstalledExtensions = () => {
    if (!('injectedWeb3' in window && window.injectedWeb3)) return [];

    const { injectedWeb3 } = window;
    if (!isRecord(injectedWeb3)) return [];

    return EXTENSIONS.flatMap((extension) => {
      const extensionId = extension.id;
      if (!(extensionId in injectedWeb3)) return [];

      const extensionConfig = injectedWeb3[extensionId];
      if (!isInjectedExtensionConfig(extensionConfig)) return [];

      return [
        {
          ...extension,
          ...extensionConfig,
        },
      ];
    });
  };

  return (
    <ExtensionsContext.Provider
      value={{
        extensions: extensions ?? [],
        setExtensionStatus,
        extensionsStatus: extensionsStatusRef.current,
        extensionsFetched,
        setExtensionsFetched,
        setExtensions,
      }}
    >
      {children}
    </ExtensionsContext.Provider>
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isInjectedExtensionConfig = (value: unknown): value is Extension =>
  isRecord(value) && 'enable' in value && 'version' in value;
