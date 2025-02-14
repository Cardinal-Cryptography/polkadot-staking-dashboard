// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SelectorButtonWrapper } from './Wrappers';

export const SelectorButton = ({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon: React.FunctionComponent<
    React.ComponentProps<'svg'> & { title?: string }
  >;
  onClick: () => void;
}) => {
  return (
    <SelectorButtonWrapper>
      <div>
        <button type="button" onClick={onClick}>
          <Icon className="icon" />
          {label}
        </button>
      </div>
    </SelectorButtonWrapper>
  );
};
