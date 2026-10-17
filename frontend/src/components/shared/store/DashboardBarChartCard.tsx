'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Bar } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import Card from '@/components/ui/card';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

export type Tone = 'accent' | 'success' | 'warning' | 'info' | 'danger';

const TONES = {
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
} as const;

const TONE_ORDER: Tone[] = ['accent', 'success', 'warning', 'info', 'danger'];
const readVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

const DEFAULT_COLORS = Object.fromEntries(
  TONE_ORDER.map(t => [t, TONES[t].fallback]),
) as Record<Tone, string>;

const DEFAULT_UI = {
  border: 'rgba(148,163,184,0.2)',
  muted: '#94a3b8',
};

const useChartColors = () => {
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [ui, setUi] = useState(DEFAULT_UI);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColors(
      Object.fromEntries(
        TONE_ORDER.map(t => [t, readVar(TONES[t].cssVar, TONES[t].fallback)]),
      ) as Record<Tone, string>,
    );

    setUi({
      border: readVar('--color-border', DEFAULT_UI.border),
      muted: readVar('--color-muted', DEFAULT_UI.muted),
    });
  }, []);

  return { colors, ui };
};

const pickTone = (tone: Tone | undefined, index: number): Tone =>
  tone ?? TONE_ORDER[index % TONE_ORDER.length];

export type BarSeries = {
  label: string;
  data: number[];
  tone?: Tone;
};
type BarChartCardProps = {
  title: string;
  subtitle?: string;
  labels: string[];
  series: BarSeries[];
  formatValue?: (value: number) => string;
  className?: string;
  isLoading?: boolean;   
};

const DashboardBarChartCard = ({
  title,
  subtitle,
  labels,
  series,
  formatValue = v => v.toLocaleString(),
  className,
  isLoading = false,
}: BarChartCardProps) => {
  const { colors, ui } = useChartColors();

  const rows = useMemo(
    () =>
      series.map((s, i) => ({
        ...s,
        tone: pickTone(s.tone, i),
      })),
    [series],
  );

  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels,
      datasets: rows.map(s => ({
        label: s.label,
        data: s.data,
        backgroundColor: colors[s.tone],
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 36,
      })),
    }),
    [labels, rows, colors],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: c =>
              ` ${c.dataset.label}: ${formatValue(Number(c.parsed.y))}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: ui.muted,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: ui.border,
          },
          border: {
            display: false,
            dash: [4, 4],
          },
          ticks: {
            display: false,
          },
        },
      },
    }),
    [ui, formatValue],
  );

  return (
    <Card
      className={clsx(
        'h-full transition-opacity duration-200',
        isLoading && 'animate-pulse',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4>{title}</h4>
          {subtitle && <p className="p12">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {rows.map(s => (
            <span key={s.label} className="flex items-center gap-1.5">
              <span
                className={clsx('size-2.5 rounded-full', TONES[s.tone].dot)}
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 h-56 sm:h-64 xl:h-72">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
};

export default DashboardBarChartCard;
