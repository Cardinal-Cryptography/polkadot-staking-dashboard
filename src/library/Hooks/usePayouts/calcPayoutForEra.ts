import BN from 'bn.js';
import { DECIMALS } from './consts';
import { EraData } from './types';

const TEN_POW_DECIMALS = new BN(10).pow(new BN(DECIMALS));
const TOTAL_ERA_REWARDS = new BN('73922').mul(TEN_POW_DECIMALS);

export default (eraData: EraData, userId: string) =>
  calcValidatorPayout(eraData, userId) + calcNominatorPayout(eraData, userId);

const calcValidatorPayout = (eraData: EraData, validatorId: string) => {
  const validatorData = eraData.perValidator[validatorId];
  if (!validatorData) return 0;

  const { totalStake: eraTotalStake } = eraData;
  const {
    ownStake,
    totalStake: validatorTotalStake,
    commission,
  } = validatorData;
  if (!ownStake || !validatorTotalStake || !commission) return 0;

  /**
   * The following is a formula for rewards calculation
   * (https://docs.alephzero.org/aleph-zero/validate/elections-and-rewards-math)
   * transformed so that there's a minimal number of divisions in order to
   * limit floating point error.
   */
  const numerator = ownStake
    /**
     * Multiplying some parts by 10^DECIMALS to divide by 10^DECIMALS later on in order to
     * compensate for the cumulated order of magnitude caused by commission
     * multiplication (10^DECIMALS * 10^DECIMALS)
     */
    .mul(TEN_POW_DECIMALS)
    .add(validatorTotalStake.sub(ownStake).mul(commission))
    .mul(TOTAL_ERA_REWARDS);
  const denominator = eraTotalStake.mul(TEN_POW_DECIMALS);
  return azeroToTazero(
    parseInt(numerator.toString(), 10) / parseInt(denominator.toString(), 10)
  );
};

const calcNominatorPayout = (eraData: EraData, nominatorId: string) =>
  Object.values(eraData.perValidator).reduce((sum, validatorData) => {
    const nominationWithinValidator = validatorData?.nominatorsStakes?.find(
      (nominatorStake) => nominatorStake.nominatorId === nominatorId
    );

    if (!nominationWithinValidator) return sum;

    const numerator = nominationWithinValidator.value
      .mul(TEN_POW_DECIMALS.sub(validatorData?.commission || new BN(0))) // (1 - commission)
      .mul(TOTAL_ERA_REWARDS);
    const denominator = eraData.totalStake
      // Dividing by 10^DECIMALS to compensate for the commission multiplication (10^DECIMALS * 10^DECIMALS)
      .mul(TEN_POW_DECIMALS);

    const rewardPerValidator = azeroToTazero(
      parseInt(numerator.toString(), 10) / parseInt(denominator.toString(), 10)
    );

    return sum + rewardPerValidator;
  }, 0);

const azeroToTazero = (value: number) => value / 10 ** DECIMALS;
