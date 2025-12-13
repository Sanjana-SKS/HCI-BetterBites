'use client';

import Link from 'next/link';

type KPI = {
  label: string;
  value: string | number;
};
const kpis: KPI[] = [
  { label: 'Total Items', value: 8 },
  { label: 'Donation Rate', value: '75%' },
  { label: 'Avg Quantity', value: 22 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-food-pattern px-8 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between rounded-lg bg-card px-8 py-6 shadow">
          <h1 className="text-2xl font-semibold">Hi, Alex</h1>
          <Link href="/log-surplus-item">
            <button className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
              + Add Donation
             </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {kpis.map(kpi => (
            <div
              key={kpi.label}
              className="rounded-lg bg-purple-200 px-6 py-8 shadow"
            >
                <div className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </div>
              <div className="mt-2 text-3xl font-bold">
                {kpi.value}
            </div>
            </div>
          ))}
       </div>
      </div>
    </div>
  );
}
