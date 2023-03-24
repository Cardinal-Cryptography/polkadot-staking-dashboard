import BN from 'bn.js';

export type EraData = {
  perValidator: {
    [validatorId: string]:
      | Partial<{
          // As verified empirically, each of the following data pieces can be absent when fetched, hence "Partial<>"
          rewardPoints: BN;
          nominatorsStakes: {
            nominatorId: string;
            value: BN;
          }[];
          ownStake: BN;
          totalStake: BN;
          commission: BN;
        }>
      | undefined;
  };
  totalEraRewardPoints: BN;
  totalAwardedRewardPoints: BN;
};
