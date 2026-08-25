'use client';

import { MARKET_TYPES, RISK_LEVELS, type MarketType, type RiskLevel } from '@tacynt/config';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MARKET_LABELS, RISK_LABELS } from '@/lib/betting-labels';

const ALL_VALUE = 'all';

export interface PredictionFiltersValue {
  market?: MarketType;
  risk?: RiskLevel;
  upcomingOnly: boolean;
}

export function PredictionFilters({
  value,
  onChange,
}: {
  value: PredictionFiltersValue;
  onChange: (value: PredictionFiltersValue) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={value.market ?? ALL_VALUE}
        onValueChange={(next) =>
          onChange({ ...value, market: next === ALL_VALUE ? undefined : (next as MarketType) })
        }
      >
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue placeholder="Marche" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Tous les marches</SelectItem>
          {MARKET_TYPES.map((market) => (
            <SelectItem key={market} value={market}>
              {MARKET_LABELS[market] ?? market}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.risk ?? ALL_VALUE}
        onValueChange={(next) =>
          onChange({ ...value, risk: next === ALL_VALUE ? undefined : (next as RiskLevel) })
        }
      >
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="Risque" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Tous les risques</SelectItem>
          {RISK_LEVELS.map((risk) => (
            <SelectItem key={risk} value={risk}>
              {RISK_LABELS[risk] ?? risk}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant={value.upcomingOnly ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange({ ...value, upcomingOnly: !value.upcomingOnly })}
      >
        A venir uniquement
      </Button>
    </div>
  );
}
