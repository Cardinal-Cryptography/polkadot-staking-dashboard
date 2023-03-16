// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useApi } from 'contexts/Api';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  defaultThemes,
  networkColors,
  networkColorsSecondary,
} from 'theme/default';
import { humanNumber, round } from 'Utils';
import { PayoutLineProps } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutLine = ({
  payouts,
  average,
  height,
  background,
}: PayoutLineProps) => {
  const graphablePayouts = payouts.slice(average); // Leave out oldest "average" values for the average window
  const { mode } = useTheme();
  const { name, unit } = useApi().network;
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership: poolMembership } = usePoolMemberships();
  const averageValues = useMemo(
    () =>
      payouts.length < average
        ? []
        : payouts
            .map(([, payout]) => payout)
            .reduce<number[]>((acc, _, i, arr) => {
              if (i < average - 1) return acc;

              return [
                ...acc,
                round(
                  arr
                    .slice(i - average + 1, i + 1)
                    .reduce<number>((sum, v) => sum + (v || 0), 0),
                  2
                ),
              ];
            }, []),
    [payouts]
  );

  const notStaking = !isSyncing && inSetup() && !poolMembership;
  const poolingOnly = !isSyncing && inSetup() && poolMembership !== null;

  // determine color for payouts
  const color = notStaking
    ? networkColors[`${name}-${mode}`]
    : !poolingOnly
    ? networkColors[`${name}-${mode}`]
    : networkColorsSecondary[`${name}-${mode}`];

  // configure graph options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 30,
          autoSkip: true,
        },
      },
      y: {
        ticks: {
          display: false,
          beginAtZero: false,
        },
        border: {
          display: false,
        },
        grid: {
          color: defaultThemes.graphs.grid[mode],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: defaultThemes.graphs.tooltip[mode],
        titleColor: defaultThemes.text.invert[mode],
        bodyColor: defaultThemes.text.invert[mode],
        bodyFont: {
          weight: '600',
        },
        callbacks: {
          title: () => [],
          label: (context: any) => ` ${humanNumber(context.parsed.y)} ${unit}`,
        },
        intersect: false,
        interaction: {
          mode: 'nearest',
        },
      },
    },
  };

  const data = {
    labels: graphablePayouts.map(([era]) => era),
    datasets: [
      {
        label: 'Payout',
        data: averageValues,
        borderColor: color,
        backgroundColor: color,
        pointStyle: undefined,
        pointRadius: 0,
        borderWidth: 2.3,
      },
    ],
  };

  return (
    <>
      <h5 className="secondary">
        {average > 1 ? `${average} Day Average` : null}
      </h5>
      <div
        className="graph_line"
        style={{
          height: height || 'auto',
          background: background || 'none',
        }}
      >
        <Line options={options} data={data} />
      </div>
    </>
  );
};

export default PayoutLine;
