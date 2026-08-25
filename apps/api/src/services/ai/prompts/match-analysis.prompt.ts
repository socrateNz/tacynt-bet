import type { MatchDetail, TeamMatchStats } from '@tacynt/shared';

export const MATCH_ANALYSIS_PROMPT_VERSION = 'sports-analysis-v1';

const SYSTEM_INSTRUCTION = `Tu es Tacynt AI, l'analyste sportif de la plateforme Tacynt Bet.

Regles strictes :
- Analyse UNIQUEMENT les donnees fournies dans le message utilisateur. N'invente jamais de statistique, de blessure, de composition, de resultat ou de cote.
- Si une information n'est pas disponible dans les donnees fournies, ecris exactement "data_unavailable" plutot que de la deviner.
- Pour chaque pronostic, choisis UNIQUEMENT un couple (market, selection) parmi la liste "MARCHES DISPONIBLES" fournie. N'invente jamais de marche ou de selection.
- Ne calcule et n'indique jamais de cote toi-meme : le backend s'en charge.
- Le score de confiance (0-100) est une estimation statistique, jamais une certitude. N'utilise jamais des formulations comme "pari sur", "gain garanti", "100% fiable" ou "victoire certaine".
- Reponds uniquement avec un objet JSON conforme au schema fourni, en francais.`;

function formatStats(stats: TeamMatchStats, label: string): string {
  return [
    `${label} (10 derniers matchs) :`,
    `- Victoires/Nuls/Defaites : ${stats.wins}/${stats.draws}/${stats.losses}`,
    `- Buts marques/encaisses : ${stats.goalsFor}/${stats.goalsAgainst}`,
    `- Clean sheets : ${stats.cleanSheets}`,
    `- Forme recente (plus recent en premier) : ${stats.form.join(', ') || 'data_unavailable'}`,
    `- Taux over 2.5 (saison) : ${stats.overRate ?? 'data_unavailable'}%`,
    `- Taux BTTS (saison) : ${stats.bttsRate ?? 'data_unavailable'}%`,
  ].join('\n');
}

export function buildMatchAnalysisPrompt(match: MatchDetail): {
  systemInstruction: string;
  prompt: string;
} {
  const availableMarkets = match.odds
    .map((market) => `${market.market} : ${market.selections.map((s) => s.selection).join(', ')}`)
    .join('\n');

  const headToHead = match.headToHead.length
    ? match.headToHead
        .map((entry) => `- ${entry.homeTeam} ${entry.homeScore}-${entry.awayScore} ${entry.awayTeam}`)
        .join('\n')
    : 'data_unavailable';

  const absencesFor = (side: 'HOME' | 'AWAY') => {
    const list = match.absences.filter((absence) => absence.side === side);
    return list.length > 0 ? list.map((a) => `${a.player} (${a.type})`).join(', ') : 'Aucune absence signalee';
  };

  const prompt = `MATCH
${match.homeTeam.name} (domicile) vs ${match.awayTeam.name} (exterieur)
Competition : ${match.competition.name}
Coup d'envoi : ${match.kickoffAt}
${match.venue ? `Stade : ${match.venue}` : ''}

STATISTIQUES
${formatStats(match.homeStats, match.homeTeam.name)}

${formatStats(match.awayStats, match.awayTeam.name)}

CONFRONTATIONS DIRECTES
${headToHead}

ABSENCES
${match.homeTeam.name} : ${absencesFor('HOME')}
${match.awayTeam.name} : ${absencesFor('AWAY')}

MARCHES DISPONIBLES (choisis uniquement parmi ces couples market/selection)
${availableMarkets || 'data_unavailable'}

Produis une analyse structuree de ce match : resume, facteurs favorables, facteurs de risque, niveau de confiance global, niveau de risque global, et 2 a 4 pronostics parmi les marches disponibles ci-dessus.`;

  return { systemInstruction: SYSTEM_INSTRUCTION, prompt };
}
