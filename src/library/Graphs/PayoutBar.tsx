// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  BarElement,
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
import { Bar } from 'react-chartjs-2';
import {
  defaultThemes,
  networkColors,
  networkColorsTransparent,
} from 'theme/default';
import { humanNumber } from 'Utils';
import { PayoutBarProps } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const PayoutBar = ({ height, payouts }: PayoutBarProps) => {
  const { mode } = useTheme();
  const { name, unit } = useApi().network;
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const { membership } = usePoolMemberships();

  const notStaking = !isSyncing && inSetup() && !membership;

  // determine color for payouts
  const colorPayouts = notStaking
    ? networkColorsTransparent[`${name}-${mode}`]
    : networkColors[`${name}-${mode}`];

  const data = {
    labels: payouts.map(([era]) => era),
    datasets: [
      {
        label: 'Payout',
        data: payouts.map(([, payout]) => payout),
        borderColor: colorPayouts,
        backgroundColor: colorPayouts,
        pointRadius: 0,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.4,
    maxBarThickness: 13,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          autoSkip: true,
        },
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 10,
          },
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
      title: {
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
          label: (context: any) => `${humanNumber(context.parsed.y)} ${unit}`,
        },
      },
    },
  };

  return (
    <div
      style={{
        height: height || 'auto',
      }}
    >
      <Bar options={options} data={data} />
    </div>
  );
};

export default PayoutBar;
