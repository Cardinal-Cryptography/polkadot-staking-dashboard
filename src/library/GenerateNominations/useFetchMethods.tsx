// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useValidators } from 'contexts/Validators';
import { Validator } from 'contexts/Validators/types';
import { useValidatorFilters } from 'library/Hooks/useValidatorFilters';
import { shuffle } from 'Utils';

export const useFetchMehods = () => {
  const { validators } = useValidators();
  const { applyFilter } = useValidatorFilters();
  let { favoritesList } = useValidators();
  if (favoritesList === null) {
    favoritesList = [];
  }

  const rawBatchKey = 'validators_browse';

  const fetch = (method: string) => {
    let nominations: any[];
    switch (method) {
      case 'Display All':
        nominations = fetchAll();
        break;
      case 'From Favorites':
        nominations = fetchFavorites();
        break;
      case 'Random Validator':
        nominations = addRandomValidator();
        break;
      default:
        nominations = [];
    }
    return nominations;
  };

  const fetchFavorites = () => {
    let _favs: Array<Validator> = [];

    if (favoritesList?.length) {
      _favs = favoritesList;
    }
    return _favs;
  };

  const fetchAll = () => {
    return validators;
  };

  const addRandomValidator = () => {
    let _nominations = Object.assign(validators);

    _nominations = applyFilter(
      null,
      ['all_commission', 'blocked_nominations', 'missing_identity'],
      _nominations,
      rawBatchKey
    );

    // take one validator
    const validator = shuffle(_nominations).slice(0, 1)[0] || null;

    if (validator) {
      return [validator];
    }
    return [];
  };

  return { fetch };
};
