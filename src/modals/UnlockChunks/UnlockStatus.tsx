import { formatDuration, intervalToDuration } from 'date-fns';
import { useApi } from '../../contexts/Api';
import { useSessionEra } from '../../contexts/SessionEra';

type Props = {
  unbondingEra: number;
  activeEra: number;
};

/**
 * This component is as atomic as possible, since it's using the frequently
 * rerendering "useSessionEra()" hook.
 */
const UnlockStatus = ({ unbondingEra, activeEra }: Props) => {
  const left = unbondingEra - activeEra;
  const { eraTimeLeft } = useSessionEra();
  const {
    consts: { expectedEraTime },
  } = useApi();

  const timeToUnbondInMs =
    left <= 0 ? 0 : (left - 1) * expectedEraTime + eraTimeLeft * 1000;

  const formattedTimeToUnbond = formatDuration(
    intervalToDuration({ start: 0, end: timeToUnbondInMs }),
    {
      format: ['days', 'hours', 'minutes', 'seconds'],
      delimiter: ', ',
    }
  );

  const message =
    left <= 0
      ? 'Unlocked'
      : `Unlocks in approx. ${formattedTimeToUnbond} (after era ${unbondingEra}, i.e. in ${left} era${
          left > 1 ? 's' : ''
        })`;

  return <h4>{message}</h4>;
};

export default UnlockStatus;
