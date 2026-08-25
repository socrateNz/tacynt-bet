import { RISK_PROFILES, RISK_PROFILE_LABELS, type RiskProfile } from '@tacynt/config';

import { cn } from '@/lib/utils';

const PROFILE_DESCRIPTIONS: Record<RiskProfile, string> = {
  PRUDENT: 'Double chance, over/under raisonnables, confiance elevee.',
  EQUILIBRE: 'Un compromis entre confiance, cote et nombre de selections.',
  AUDACIEUX: 'Plus de variance, selections plus risquees, cotes individuelles plus elevees.',
};

export function RiskProfilePicker({
  value,
  onChange,
}: {
  value: RiskProfile;
  onChange: (value: RiskProfile) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {RISK_PROFILES.map((profile) => (
        <button
          key={profile}
          type="button"
          onClick={() => onChange(profile)}
          className={cn(
            'rounded-lg border p-4 text-left transition-colors',
            value === profile ? 'border-primary bg-accent' : 'border-border hover:bg-muted/40',
          )}
        >
          <p className="font-semibold">{RISK_PROFILE_LABELS[profile]}</p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {PROFILE_DESCRIPTIONS[profile]}
          </p>
        </button>
      ))}
    </div>
  );
}
