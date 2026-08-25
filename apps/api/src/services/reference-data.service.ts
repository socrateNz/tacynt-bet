import type { HydratedDocument } from 'mongoose';
import type { CompetitionOption } from '@tacynt/shared';

import { Competition, type ICompetition, type ISport } from '../models';

type PopulatedCompetition = Omit<HydratedDocument<ICompetition>, 'sportId'> & {
  sportId: HydratedDocument<ISport>;
};

export const referenceDataService = {
  async listCompetitions(): Promise<CompetitionOption[]> {
    const competitions = (await Competition.find()
      .populate('sportId')
      .sort({ name: 1 })) as unknown as PopulatedCompetition[];

    return competitions.map((competition) => ({
      id: competition.id,
      name: competition.name,
      slug: competition.slug,
      country: competition.country ?? undefined,
      logo: competition.logo ?? undefined,
      sport: {
        id: competition.sportId.id,
        name: competition.sportId.name,
        slug: competition.sportId.slug,
      },
    }));
  },
};
