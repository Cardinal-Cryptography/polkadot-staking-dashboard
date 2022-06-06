// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Toggle } from 'types';
import {
  AssistantContextInterface,
  AssistantDefinition,
  AssistantItem,
} from 'types/assistant';
import { ASSISTANT_CONFIG } from 'config/assistant';

export const AssistantContext =
  React.createContext<AssistantContextInterface | null>(null);

export const useAssistant = () => React.useContext(AssistantContext);

interface Props {
  children: React.ReactNode;
}

interface State {
  open: Toggle;
  page: string;
  innerDefinition: AssistantDefinition;
  activeSection: number;
  height: number;
  transition: number;
}

export class AssistantProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: Toggle.Closed,
      page: 'overview',
      innerDefinition: {
        title: '',
        description: [''],
      },
      activeSection: 0,
      height: 0,
      transition: 0,
    };
  }

  setPage = (newPage: string) => {
    this.setState({
      page: newPage,
    });
  };

  static getDefinition = (key: string, title: string) => {
    return ASSISTANT_CONFIG.find(
      (item: AssistantItem) => item.key === key
    )?.definitions?.find((item: AssistantDefinition) => item.title === title);
  };

  setInnerDefinition = (meta: AssistantDefinition) => {
    this.setState({
      innerDefinition: meta,
    });
  };

  toggle = () => {
    const { open } = this.state;
    this.setState({
      open: open === Toggle.Closed ? Toggle.Open : Toggle.Closed,
      transition: 0,
    });
  };

  openAssistant = () => {
    this.setState({
      open: Toggle.Open,
      transition: 0,
    });
  };

  closeAssistant = () => {
    this.setState({
      open: Toggle.Closed,
      transition: 0,
    });

    // short timeout to hide back to list
    setTimeout(() => {
      this.setState({
        ...this.state,
        activeSection: 0,
      });
    }, 150);
  };

  setActiveSection = (index: number) => {
    this.setState({
      activeSection: index,
      transition: 1,
    });
  };

  goToDefinition = (page: string, title: string) => {
    const definition: any = AssistantProvider.getDefinition(page, title);

    if (
      this.state.innerDefinition === definition &&
      this.state.open === Toggle.Open
    ) {
      this.closeAssistant();
    } else if (definition !== undefined) {
      this.setPage(page);
      this.setInnerDefinition(definition);
      this.setActiveSection(1);

      // short timeout to hide inner transition
      setTimeout(() => this.openAssistant(), 60);
    }
  };

  setAssistantHeight = (v: number) => {
    this.setState({
      ...this.state,
      height: v,
    });
  };

  render() {
    return (
      <AssistantContext.Provider
        value={{
          toggle: this.toggle,
          setPage: this.setPage,
          setInnerDefinition: this.setInnerDefinition,
          getDefinition: AssistantProvider.getDefinition,
          openAssistant: this.openAssistant,
          closeAssistant: this.closeAssistant,
          setActiveSection: this.setActiveSection,
          goToDefinition: this.goToDefinition,
          setAssistantHeight: this.setAssistantHeight,
          activeSection: this.state.activeSection,
          open: this.state.open,
          page: this.state.page,
          innerDefinition: this.state.innerDefinition,
          height: this.state.height,
          transition: this.state.transition,
        }}
      >
        {this.props.children}
      </AssistantContext.Provider>
    );
  }
}
