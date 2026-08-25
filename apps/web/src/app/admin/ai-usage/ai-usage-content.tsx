'use client';

import { AdminGuard } from '@/features/admin/components/admin-guard';
import { AdminNav } from '@/features/admin/components/admin-nav';
import { AiUsageBreakdown } from '@/features/admin/components/ai-usage-breakdown';
import { AiUsageChart } from '@/features/admin/components/ai-usage-chart';

function AdminAiUsageBody() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usage IA</h1>
        <p className="text-muted-foreground text-sm">Consommation et cout estime des appels Gemini.</p>
      </div>

      <AdminNav />

      <AiUsageBreakdown />
      <AiUsageChart />
    </div>
  );
}

export function AdminAiUsageContent() {
  return (
    <AdminGuard>
      <AdminAiUsageBody />
    </AdminGuard>
  );
}
