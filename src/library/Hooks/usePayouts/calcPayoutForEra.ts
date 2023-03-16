import BN from 'bn.js';
import { DECIMALS } from './consts';
import { EraData } from './types';

const TEN_POW_DECIMALS = new BN(10).pow(new BN(DECIMALS));
const TOTAL_ERA_REWARDS = new BN('73922').mul(TEN_POW_DECIMALS);

export default (eraData: EraData, validatorId: string) => {
  const validatorDataInEra = eraData.perValidator[validatorId];
  if (!validatorDataInEra) return undefined;

  const { totalStake: eraTotalStake } = eraData;
  const {
    ownStake,
    totalStake: validatorTotalStake,
    commission,
  } = validatorDataInEra;
  if (!ownStake || !validatorTotalStake || !commission) return undefined;

  // Multiplying some parts by 10^DECIMALS to divide by 10^DECIMALS later on in order to compensate for the commission multiplication (10^DECIMALS * 10^DECIMALS)
  const numerator = ownStake
    .mul(TEN_POW_DECIMALS)
    .add(validatorTotalStake.sub(ownStake).mul(commission))
    .mul(TOTAL_ERA_REWARDS);
  const denominator = eraTotalStake.mul(TEN_POW_DECIMALS);

  return azeroToTazero(
    parseInt(numerator.toString(), 10) / parseInt(denominator.toString(), 10)
  );
};

const azeroToTazero = (value: number) => value / 10 ** DECIMALS;
