// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronCircleRight,
  faHeart,
  faTimes,
  faUserEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useValidators } from 'contexts/Validators';
import { LargeItem } from 'library/Filter/LargeItem';
import { SelectableWrapper } from 'library/List';
import { ValidatorList } from 'library/ValidatorList';
import { Wrapper } from 'pages/Overview/NetworkSats/Wrappers';
import { useEffect, useRef, useState } from 'react';
import {
  GenerateNominationsInnerProps,
  Nominations,
} from '../SetupSteps/types';
import { useFetchMehods } from './useFetchMethods';
import { GenerateOptionsWrapper } from './Wrappers';

export const GenerateNominations = (props: GenerateNominationsInnerProps) => {
  // functional props
  const setters = props.setters ?? [];
  const defaultNominations = props.nominations;
  const { batchKey, stepsSetup } = props;

  const { openModalWith } = useModal();
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { setTargets } = useStaking();
  const { removeValidatorMetaBatch, validators, meta } = useValidators();
  const { fetch: fetchFromMethod } = useFetchMehods();

  let { favoritesList } = useValidators();
  if (favoritesList === null) {
    favoritesList = [];
  }
  // store the method of fetching validators
  const [method, setMethod] = useState<string | null>(null);

  // store whether validators are being fetched
  const [fetching, setFetching] = useState<boolean>(false);

  // store the currently selected set of nominations
  const [nominations, setNominations] = useState(defaultNominations);

  // store the height of the container
  const [height, setHeight] = useState<number | null>(null);

  // ref for the height of the container
  const heightRef = useRef<HTMLDivElement>(null);

  const rawBatchKey = 'validators_browse';

  // update nominations on account switch
  useEffect(() => {
    if (nominations !== defaultNominations) {
      removeValidatorMetaBatch(batchKey);
      setNominations([...defaultNominations]);
    }
  }, [activeAccount]);

  // refetch if fetching is triggered
  useEffect(() => {
    if (!isReady || !validators.length) {
      return;
    }

    // wait for validator meta data to be fetched
    const batch = meta[rawBatchKey];
    if (batch === undefined) {
      return;
    }
    if (batch.stake === undefined) {
      return;
    }

    if (fetching) {
      fetchNominationsForMethod();
    }
  });

  // reset fixed height on window size change
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  const resizeCallback = () => {
    setHeight(null);
  };

  // fetch nominations based on method
  const fetchNominationsForMethod = () => {
    if (method) {
      const _nominations = fetchFromMethod(method);
      // update component state
      setNominations([..._nominations]);
      setFetching(false);
    }
  };

  const updateSetters = (_nominations: Nominations) => {
    for (const s of setters) {
      const { current, set } = s;
      const callable = current?.callable ?? false;
      let _current;

      if (!callable) {
        _current = current;
      } else {
        _current = current.fn();
      }
      const _set = {
        ..._current,
        nominations: _nominations,
      };
      set(_set);
    }
  };

  // function for clearing nomination list
  const clearNominations = () => {
    setMethod(null);
    removeValidatorMetaBatch(batchKey);
    setNominations([]);
    updateSetters([]);
  };

  // accumulate generation methods
  const methods = [
    {
      title: 'Display All',
      subtitle: 'List all validators.',
      icon: faUserEdit as IconProp,
      onClick: () => {
        setMethod('Display All');
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
        setFetching(true);
      },
    },
    {
      title: 'From Favorites',
      subtitle: 'Choose one of your favorite validators.',
      icon: faHeart as IconProp,
      onClick: () => {
        setMethod('From Favorites');
        removeValidatorMetaBatch(batchKey);
        setNominations([]);
        setFetching(true);
      },
    },
  ];

  const defaultFilters = {
    includes: ['active'],
    excludes: ['all_commission', 'blocked_nominations', 'missing_identity'],
  };

  const validatorAction = {
    text: 'Nominate',
    iconLeft: faChevronCircleRight as IconProp,
    onClick: (validator: any) => {
      setTargets({ nominations: [validator] });
      openModalWith('Nominate', {}, 'small');
    },
  };

  const validatorOnSelectAction = (validator: any) => {
    setTargets({ nominations: [validator] });
    updateSetters([validator]);
  };

  return (
    <>
      {method && (
        <SelectableWrapper>
          <button type="button" onClick={() => clearNominations()}>
            <FontAwesomeIcon icon={faTimes as IconProp} />
            {method}
          </button>

          {['Active Low Commission', 'Optimal Selection'].includes(
            method || ''
          ) && (
            <button
              type="button"
              onClick={() => {
                // set a temporary height to prevent height snapping on re-renders.
                setHeight(heightRef?.current?.clientHeight || null);
                setTimeout(() => setHeight(null), 200);
                removeValidatorMetaBatch(batchKey);
                setFetching(true);
              }}
            >
              Re-Generate
            </button>
          )}
        </SelectableWrapper>
      )}
      <Wrapper
        style={{
          height: height ? `${height}px` : 'auto',
          marginTop: method ? '1rem' : 0,
        }}
      >
        <div>
          {!isReadOnlyAccount(activeAccount) && !method && (
            <>
              <GenerateOptionsWrapper>
                {methods.map((m: any, n: number) => (
                  <LargeItem
                    key={`gen_method_${n}`}
                    title={m.title}
                    subtitle={m.subtitle}
                    icon={m.icon}
                    transform="grow-2"
                    active={false}
                    onClick={m.onClick}
                  />
                ))}
              </GenerateOptionsWrapper>
            </>
          )}
        </div>

        {fetching ? (
          <></>
        ) : (
          <>
            {isReady && method !== null && (
              <div
                ref={heightRef}
                style={{
                  width: '100%',
                }}
              >
                <ValidatorList
                  bondType="stake"
                  validators={nominations}
                  batchKey={batchKey}
                  defaultFilters={defaultFilters}
                  validatorAction={!stepsSetup && validatorAction}
                  validatorOnSelectAction={validatorOnSelectAction}
                  allowMoreCols
                  allowFilters
                  allowSearch
                  pagination
                  selectable={stepsSetup}
                  selectActive={stepsSetup}
                  selectToggleable={false}
                  allowListFormat={false}
                />
              </div>
            )}
          </>
        )}
      </Wrapper>
    </>
  );
};

export default GenerateNominations;
