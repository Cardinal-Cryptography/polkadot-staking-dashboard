import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { SessionEraContext } from '../../contexts/SessionEra';
import UnlockStatus from './UnlockStatus';

test("says it's unlocked if unbonding has passed", () => {
  const activeEra = 2;
  const unbondingEra = activeEra - 1;

  const screen = render(
    <UnlockStatus unbondingEra={unbondingEra} activeEra={activeEra} />
  );

  expect(screen.getByText('Unlocked')).toBeInTheDocument();
});

describe('outputs time to unbond if unbonding has not yet passed', () => {
  const activeEra = 2;
  const unbondingEra = activeEra + 1;
  const renderWithProvider = (
    element: ReactElement,
    params: { eraTimeLeft: number }
  ) =>
    render(
      // @ts-expect-error We only care about a subset of the "value" object in this test
      <SessionEraContext.Provider value={params}>
        {element}
      </SessionEraContext.Provider>
    );

  test.each([
    {
      eraTimeLeft: 1,
      expectedText: 'Unlocks in approx. 1 second (after era 3, i.e. in 1 era)',
      label: 'a second',
    },
    {
      eraTimeLeft: 60,
      expectedText: 'Unlocks in approx. 1 minute (after era 3, i.e. in 1 era)',
      label: 'a minute',
    },
    {
      eraTimeLeft: 1.5 * 60,
      expectedText:
        'Unlocks in approx. 1 minute, 30 seconds (after era 3, i.e. in 1 era)',
      label: '1.5 minute',
    },
    {
      eraTimeLeft: 60 * 60,
      expectedText: 'Unlocks in approx. 1 hour (after era 3, i.e. in 1 era)',
      label: 'an hour',
    },
    {
      eraTimeLeft: 1.5 * 60 * 60,
      expectedText:
        'Unlocks in approx. 1 hour, 30 minutes (after era 3, i.e. in 1 era)',
      label: '1.5 hour',
    },
    {
      eraTimeLeft: 24 * 60 * 60,
      expectedText: 'Unlocks in approx. 1 day (after era 3, i.e. in 1 era)',
      label: 'a day',
    },
    {
      eraTimeLeft: 1.5 * 31 * 23 * 61 * 59,
      expectedText:
        'Unlocks in approx. 13 days, 13 hours, 12 minutes, 10 seconds (after era 3, i.e. in 1 era)',
      label: 'around 1.5 month',
    },
  ])('for $label', ({ eraTimeLeft, expectedText }) => {
    const screen = renderWithProvider(
      <UnlockStatus unbondingEra={unbondingEra} activeEra={activeEra} />,
      { eraTimeLeft }
    );

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
