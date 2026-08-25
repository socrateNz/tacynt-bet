import { render, screen } from '@testing-library/react';
import { Sparkles } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('renders the label and value', () => {
    render(<StatCard label="Analyses IA" value={42} icon={Sparkles} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Analyses IA')).toBeInTheDocument();
  });

  it('renders a string value as-is (e.g. a percentage or currency)', () => {
    render(<StatCard label="Taux de reussite" value="57%" icon={Sparkles} />);
    expect(screen.getByText('57%')).toBeInTheDocument();
  });
});
