/*
 * Warning: lots of type assertions due to mistyped api library.
 */
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { round } from 'Utils';
import asyncSequenceMap from './asyncSequenceMap';
import calcPayoutForEra from './calcPayoutForEra';
import fetchDataForEra from './fetchDataForEra';
import { EraData } from './types';

type ValidatorsData = {
  [era: number]: EraData;
};

type ContextType = {
  validatorsDataCache: ValidatorsData;
  updateValidatorsDataCache: (patch: ValidatorsData) => void;
};

const Context = React.createContext<ContextType>({} as ContextType);

/**
 * Calculates payouts (aka rewards) based on stake data fetched from
 * the chain. The data is aggressively cached, as it's historical and
 * immutable. The returned values are in TAZERO (AZERO / 10^12).
 *
 * @param lastNEras Fetch last "lastNEras" eras, starting from the first
 * finished one (the one behind the active one)
 */
export default (lastNEras: number) => {
  const { validatorsDataCache, updateValidatorsDataCache } =
    useContext(Context);
  const { activeAccount } = useConnect();
  const { api } = useApi();

  const {
    metrics: {
      activeEra: { index: activeEra },
    },
  } = useNetworkMetrics();

  const { selectedErasDataFromCache, erasMissingInCache } = useMemo(
    () =>
      [...new Array(Math.min(lastNEras, activeEra || 0))]
        .map((_, i) => activeEra - i - 1)
        .reduce<{
          selectedErasDataFromCache: typeof validatorsDataCache;
          erasMissingInCache: number[];
        }>(
          (acc, eraIndex) => {
            const eraCache = validatorsDataCache[eraIndex];
            if (eraCache)
              return {
                ...acc,
                selectedErasDataFromCache: {
                  ...acc.selectedErasDataFromCache,
                  [eraIndex]: eraCache,
                },
              };
            return {
              ...acc,
              erasMissingInCache: [...acc.erasMissingInCache, eraIndex],
            };
          },
          { selectedErasDataFromCache: {}, erasMissingInCache: [] }
        ),
    [activeEra, lastNEras] // Deliberately not putting "validatorsDataCache" in deps since we don't want its change to trigger recalc
  );

  const [validatorsData, setValidatorsData] = useState<
    typeof validatorsDataCache | undefined
  >(erasMissingInCache.length ? {} : selectedErasDataFromCache);

  const [loading, setLoading] = useState(
    !api || !activeEra || erasMissingInCache.length > 0
  );

  useEffect(() => {
    if (!api || !activeEra || !erasMissingInCache.length) return;

    // Fetch eras in sequence to not jam the bandwidth
    asyncSequenceMap(erasMissingInCache, (missingEra: number) =>
      fetchDataForEra(api, missingEra)
    ).then((fetchedErasData) => {
      const cachePatch = erasMissingInCache.reduce(
        (acc, eraIndex, i) => ({
          ...acc,
          [eraIndex]: fetchedErasData[i],
        }),
        {}
      );

      // fill the cache for later...
      updateValidatorsDataCache(cachePatch);
      // ...and update the local state for current calculations
      setValidatorsData({
        ...selectedErasDataFromCache,
        ...cachePatch,
      });

      setLoading(false);
    });
  }, [api, activeEra, erasMissingInCache, selectedErasDataFromCache]);

  const payouts = useMemo(() => {
    if (!validatorsData || !activeAccount) return [];

    return [...new Array(lastNEras)]
      .map((_, i) => activeEra - i - 1)
      .reduce<[eraIndex: number, payout: number][]>((acc, eraIndex) => {
        const validatorsDataInEra = validatorsData[eraIndex];
        if (!validatorsDataInEra) return acc;

        const payoutForEra = calcPayoutForEra(
          validatorsDataInEra,
          activeAccount
        );
        return [[eraIndex, round(payoutForEra, 2)] as [number, number], ...acc];
      }, []);
  }, [validatorsData, activeAccount]);

  const hasAnyPayouts = Object.values(payouts || {}).some((payout) => payout);

  return {
    loading,
    payouts,
    hasAnyPayouts: !hasAnyPayouts && loading ? undefined : hasAnyPayouts,
  };
};

export const PayoutsCacheProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [validatorsDataCache, updateValidatorsDataCache] = useReducer<
    (state: ValidatorsData, patch: ValidatorsData) => ValidatorsData
  >((state, patch) => ({ ...state, ...patch }), {});

  return (
    <Context.Provider
      value={{ validatorsDataCache, updateValidatorsDataCache }}
    >
      {children}
    </Context.Provider>
  );
};
