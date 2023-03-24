// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface BondedProps {
  active: number;
  unlocking: number;
  unlocked: number;
  inactive: boolean;
  free: number;
}

export interface PayoutBarProps {
  payouts: [number, number][];
  height: string;
}

export interface PayoutLineProps {
  payouts: [number, number][];
  averageWindowSize: number;
  height: string;
  background?: string;
}

export interface StatPieProps {
  value: number;
  value2: number;
}

export interface CardHeaderWrapperProps {
  withAction?: boolean;
  padded?: boolean;
}

export interface CardWrapperProps {
  noPadding?: boolean;
  transparent?: boolean;
  height?: string | number;
  flex?: boolean;
}

export interface GraphWrapperProps {
  transparent?: boolean;
  noMargin?: boolean;
  flex?: boolean;
}
