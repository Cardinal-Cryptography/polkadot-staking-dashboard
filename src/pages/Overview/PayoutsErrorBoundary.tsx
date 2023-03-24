import { Component, ReactElement } from 'react';
import styled from 'styled-components';

export default class PayoutsErrorBoundary extends Component<{
  children: ReactElement;
}> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Info>There was a problem calculating payouts.</Info>;
    }

    return this.props.children;
  }
}

const Info = styled.h4`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`;
