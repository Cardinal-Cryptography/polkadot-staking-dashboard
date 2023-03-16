// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { StakingContext } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import React from 'react';
import { networkColors } from 'theme/default';
import { PayoutListProps } from '../types';
import { ItemWrapper } from '../Wrappers';
import { PayoutListProvider, usePayoutList } from './context';

export const PayoutListInner = (props: PayoutListProps) => {
  const { allowMoreCols, payouts } = props;

  const { mode } = useTheme();
  const { network } = useApi();
  const { listFormat, setListFormat } = usePayoutList();

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{props.title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={
                listFormat === 'row'
                  ? networkColors[`${network.name}-${mode}`]
                  : 'inherit'
              }
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={
                listFormat === 'col'
                  ? networkColors[`${network.name}-${mode}`]
                  : 'inherit'
              }
            />
          </button>
        </div>
      </Header>
      <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        <MotionContainer>
          {payouts
            .slice()
            .reverse()
            .filter(([, payout]) => payout)
            .map(([eraIndex, payout], index) => {
              return (
                <motion.div
                  className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                  key={`nomination_${index}`}
                  variants={{
                    hidden: {
                      y: 15,
                      opacity: 0,
                    },
                    show: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                >
                  <ItemWrapper>
                    <div className="inner">
                      <div className="row">
                        <div>
                          <div>
                            <h4 className="reward">{payout}</h4>
                          </div>
                          <div>
                            <h5>Era: {eraIndex}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ItemWrapper>
                </motion.div>
              );
            })}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const PayoutList = (props: PayoutListProps) => {
  return (
    <PayoutListProvider>
      <PayoutListShouldUpdate {...props} />
    </PayoutListProvider>
  );
};

export class PayoutListShouldUpdate extends React.Component<PayoutListProps> {
  static contextType = StakingContext;

  render() {
    return <PayoutListInner {...this.props} />;
  }
}

export default PayoutList;
