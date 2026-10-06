'use client';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Card from '@/components/ui/card';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type ScriptableContext,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

export type Tone = 'accent' | 'success' | 'warning' | 'info' | 'danger';

export type LineSeries = {
  label: string;
  data: number[];
  tone?: Tone;
  filled?: boolean;
  dashed?: boolean;
};

type Props = {
  title: string;
  subtitle?: string;
  labels: string[];
  series: LineSeries[];
  formatValue?: (value: number) => string;
  className?: string;
  isLoading?: boolean;
};

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

const DEFAULT_COLORS = Object.fromEntries(
  TONE_ORDER.map(t => [t, TONES[t].fallback]),
) as Record<Tone, string>;

const DEFAULT_UI = {
  border: 'rgba(148,163,184,0.2)',
  muted: '#94a3b8',
};

const readVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
  fallback;

const withAlpha = (color: string, alpha: number) => {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0');

    return `${color}${a}`;
  }

  return `color-mix(in srgb, ${color} ${Math.round(
    alpha * 100,
  )}%, transparent)`;
};

const defaultFormat = (v: number) => v.toLocaleString();

const pickTone = (tone: Tone | undefined, index: number): Tone =>
  tone ?? TONE_ORDER[index % TONE_ORDER.length];

const DashboardSalesChart = ({
  title,
  subtitle,
  labels,
  series,
  formatValue = defaultFormat,
  className,
  isLoading = false,
}: Props) => {
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

  const rows = useMemo(
    () =>
      series.map((s, i) => ({
        ...s,
        tone: pickTone(s.tone, i),
      })),
    [series],
  );

  const { data, options } = useMemo(() => {
    const data: ChartData<'line'> = {
      labels,
      datasets: rows.map(s => {
        const color = colors[s.tone];

        return {
          label: s.label,
          data: s.data,
          borderColor: color,
          borderWidth: s.dashed ? 2 : 2.5,
          borderDash: s.dashed ? [6, 4] : [],
          pointBackgroundColor: color,
          pointRadius: s.dashed ? 0 : 3,
          pointHoverRadius: s.dashed ? 4 : 5,
          tension: 0,
          fill: !!s.filled,

          backgroundColor: (ctx: ScriptableContext<'line'>) => {
            const { chart } = ctx;

            if (!s.filled || !chart.chartArea) {
              return 'transparent';
            }
            const g = chart.ctx.createLinearGradient(
              0,
              chart.chartArea.top,
              0,
              chart.chartArea.bottom,
            );
            g.addColorStop(0, withAlpha(color, 0.25));
            g.addColorStop(1, withAlpha(color, 0));
            return g;
          },
        };
      }),
    };

    const options: ChartOptions<'line'> = {
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
    };

    return { data, options };
  }, [labels, rows, colors, ui, formatValue]);

  return (
    <Card
      className={clsx(
        'h-full transition-opacity duration-150',
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
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

export default DashboardSalesChart;