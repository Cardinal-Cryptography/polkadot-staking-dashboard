import { ApiPromise } from '@polkadot/api';
import BN from 'bn.js';
import { DECIMALS } from './consts';
import { EraData } from './types';

/**
 * Warning: Lots of "ts-ignore"s due to incorrect api library's types.
 */
export default (api: ApiPromise, era: number) =>
  Promise.all([
    api.query.staking.erasRewardPoints(era).then((rp) =>
      // @ts-expect-error TS2339: Contrary to the TS error, "individual" does exist
      [...rp.individual.entries()].map(([rawValidatorId, rawPoints]) => ({
        validatorId: rawValidatorId.toString(),
        rewardPoints: rawPoints.toBn(),
      }))
    ),
    api.query.staking.erasStakers.entries(era).then((stakers) =>
      stakers.map(
        ([
          {
            args: [, rawValidatorId],
          },
          // @ts-expect-error TS2339: Contrary to the TS error, "others", "own" and "total" do exist
          { others: nominators, own, total },
        ]) => ({
          validatorId: rawValidatorId.toString(),
          // @ts-expect-error TS7031: Not fixing types in here since we cast in right after
          nominatorsStakes: nominators.map(({ who, value }) => ({
            nominatorId: who.toString(),
            value: value.toBn(),
          })),
          ownStake: own.toBn(),
          totalStake: total.toBn(),
        })
      )
    ),
    api.query.staking.erasValidatorPrefs.entries(era).then((commissions) =>
      commissions.map(
        ([
          {
            args: [, rawValidatorId],
          },
          // @ts-expect-error TS2339: Contrary to the TS error, "commission" does exist
          { commission: rawCommission },
        ]) => ({
          validatorId: rawValidatorId.toString(),
          // Multiply by 10^(DECIMALS - 9), because "commission" is returned in "Perbil"
          commission: rawCommission
            .toBn()
            .mul(new BN(10).pow(new BN(DECIMALS - 9))),
        })
      )
    ),
  ]).then(([allRewardPoints, allStakes, allCommissions]) => {
    const perValidatorData: EraData['perValidator'] = {};

    allRewardPoints.forEach(({ validatorId, rewardPoints }) => {
      perValidatorData[validatorId] = {
        ...perValidatorData[validatorId],
        rewardPoints,
      };
    });

    allStakes.forEach(({ validatorId, ...stakes }) => {
      perValidatorData[validatorId] = {
        ...perValidatorData[validatorId],
        ...stakes,
      };
    });

    allCommissions.forEach(({ validatorId, commission }) => {
      perValidatorData[validatorId] = {
        ...perValidatorData[validatorId],
        commission,
      };
    });

    return {
      perValidator: perValidatorData,
      totalStake: Object.values(perValidatorData).reduce(
        (acc, validatorDataInEra) => {
          const totalStake = validatorDataInEra?.totalStake;

          return totalStake ? acc.add(totalStake) : acc;
        },
        new BN(0)
      ),
      totalRewardPoints: Object.values(perValidatorData).reduce(
        (acc, validatorDataInEra) => {
          const rewardPoints = validatorDataInEra?.rewardPoints;

          return rewardPoints ? acc.add(rewardPoints) : acc;
        },
        new BN(0)
      ),
    };
  });
