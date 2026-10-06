'use client';

import { Doughnut } from 'react-chartjs-2';
import { useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip);
import Card from '@/components/ui/card';
import clsx from 'clsx';

type Tone = 'accent' | 'success' | 'warning' | 'info' | 'danger';

export type DonutItem = {
  label: string;
  value: number;
  tone?: Tone;
};

type Props = {
  title: string;
  subtitle?: string;
  totalLabel?: string;
  items: DonutItem[];
  className?: string;
  isLoading?: boolean;
};

const TONES: Record<Tone, { cssVar: string; fallback: string; dot: string }> = {
  accent: {
    cssVar: '--color-accent',
    fallback: '#0ea5e9',
    dot: 'bg-accent',
  },
  success: {
    cssVar: '--color-success',
    fallback: '#10b981',
    dot: 'bg-success',
  },
  warning: {
    cssVar: '--color-warning',
    fallback: '#f59e0b',
    dot: 'bg-warning',
  },
  info: {
    cssVar: '--color-info',
    fallback: '#8b5cf6',
    dot: 'bg-info',
  },
  danger: {
    cssVar: '--color-danger',
    fallback: '#ef4444',
    dot: 'bg-danger',
  },
};

const TONE_ORDER: Tone[] = ['accent', 'success', 'warning', 'info', 'danger'];

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

const defaultColors = Object.fromEntries(
  TONE_ORDER.map(t => [t, TONES[t].fallback]),
) as Record<Tone, string>;

const DonutChartCard = ({
  title,
  subtitle,
  totalLabel = 'Total',
  items,
  className,
  isLoading = false,
}: Props) => {
  const [colors, setColors] = useState(defaultColors);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColors(
      Object.fromEntries(
        TONE_ORDER.map(t => [t, cssVar(TONES[t].cssVar, TONES[t].fallback)]),
      ) as Record<Tone, string>,
    );
  }, []);

  const rows = useMemo(() => {
    const total = items.reduce((sum, c) => sum + c.value, 0);
    return items.map((c, i) => ({
      ...c,
      tone: c.tone ?? TONE_ORDER[i % TONE_ORDER.length],
      percent: total ? Math.round((c.value / total) * 100) : 0,
    }));
  }, [items]);

  const data = useMemo<ChartData<'doughnut'>>(
    () => ({
      labels: rows.map(c => c.label),
      datasets: [
        {
          data: rows.map(c => c.value),
          backgroundColor: rows.map(c => colors[c.tone]),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [rows, colors],
  );

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: c => ` ${c.label}: ${c.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Card
      className={clsx(
        ' transition-opacity duration-200',
        isLoading && 'animate-pulse',
        className,
      )}
    >
      <h4>{title}</h4>
      {subtitle && <p className="p12">{subtitle}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
        <div className="relative size-40 shrink-0">
          <Doughnut data={data} options={options} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <h3>100%</h3>
            <p className="p12">{totalLabel}</p>
          </div>
        </div>
        <ul className="min-w-48 flex-1 space-y-3">
          {rows.map(item => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-3 text-sm">
                <span className={`size-3 rounded-sm ${TONES[item.tone].dot}`} />
                {item.label}
              </span>
              <span className="p14">{item.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default DonutChartCard;