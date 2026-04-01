import { Team, Player, NewsItem, StaffMember, Infrastructure } from '../types';
import { formatCurrency, clamp } from './gameState';

export interface NewsGeneratorInput {
  round: number;
  season: number;
  teams: Team[];
  userTeamId: string | null;
  matchHistory: any[];
  hiredStaff: StaffMember[];
  infrastructure: Infrastructure;
  isWindowOpen: boolean;
}

export interface NewsGeneratorOutput {
  news: NewsItem[];
  youthProspect: Player | null;
  moralChanges: { teamId: string; delta: number }[];
}

export function generateRoundNews(input: NewsGeneratorInput): NewsGeneratorOutput {
  const { round, season, teams, userTeamId, matchHistory, hiredStaff, infrastructure, isWindowOpen } = input;
  const userTeam = teams.find(t => t.id === userTeamId);
  const newsList: NewsItem[] = [];
  const moralChanges: { teamId: string; delta: number }[] = [];
  let youthProspect: Player | null = null;

  const pickUserStar = () => {
    if (!userTeam) return null;
    const roster = userTeam.roster.slice().sort((a, b) => b.overall - a.overall);
    return roster[0] ?? null;
  };

  // 1) Fan Reactions
  if (matchHistory.length > 0 && userTeam) {
    const userMatches = matchHistory.filter((m: any) => m.isUserMatch).slice(0, 3);
    if (userMatches.length === 3) {
      const wins = userMatches.filter((m: any) => (m.homeTeamName === userTeam.name && m.homeScore > m.awayScore) || (m.awayTeamName === userTeam.name && m.awayScore > m.homeScore)).length;
      const losses = userMatches.filter((m: any) => (m.homeTeamName === userTeam.name && m.homeScore < m.awayScore) || (m.awayTeamName === userTeam.name && m.awayScore < m.homeScore)).length;

      if (wins === 3 && Math.random() > 0.6) {
        newsList.push({
          id: Math.random().toString(36), round,
          title: 'Torcida: "O Campeão Voltou!"',
          body: 'A fase é espetacular! Torcedores organizaram um mosaico 3D no estádio e alguns tatuaram seu rosto. Moral em alta.',
          category: 'MORAL', isRead: false, impactText: 'Moral +5'
        });
        moralChanges.push({ teamId: userTeam.id, delta: 5 });
      } else if (losses === 3 && Math.random() > 0.6) {
        newsList.push({
          id: Math.random().toString(36), round,
          title: 'Protesto: Muro Pichado',
          body: 'Torcedores picharam o muro do CT: "Acabou a paz!". Pipoca foi atirada no ônibus da delegação. O clima é tenso.',
          category: 'MORAL', isRead: false, impactText: 'Moral -10',
        });
        moralChanges.push({ teamId: userTeam.id, delta: -10 });
      }
    }
  }

  // 2) Sponsorship
  if (Math.random() > 0.75 && userTeam) {
    const sponsors = ['Bet do Zé', 'Cerveja Local', 'Construtora', 'Rede de Farmácias', 'App de Entrega'];
    const sponsor = sponsors[Math.floor(Math.random() * sponsors.length)];
    const offer = 40000 + Math.floor(Math.random() * 90000);
    newsList.push({
      id: Math.random().toString(36), round,
      title: `Patrocínio Relâmpago (${sponsor})`,
      body: `A diretoria recebeu uma proposta de patrocínio pontual. O acordo rende R$ ${(offer / 1000).toFixed(0)}k, mas a torcida pode reclamar do "excesso de propaganda".`,
      category: 'FINANCE', isRead: false,
      choices: [
        { label: `Aceitar (R$ ${(offer / 1000).toFixed(0)}k)`, impact: { funds: offer, moral: -2, newsText: "Caixa reforçado. Parte da arquibancada chiou." } },
        { label: 'Recusar', impact: { moral: 2, newsText: "Postura conservadora. A torcida valorizou a tradição." } },
      ],
    });
  }

  // 3) Post-match commentary
  if (matchHistory.length > 0 && Math.random() > 0.55 && userTeam) {
    const last = matchHistory.find((m: any) => m.isUserMatch);
    if (last) {
      const won = (last.homeTeamName === userTeam.name && last.homeScore > last.awayScore) || (last.awayTeamName === userTeam.name && last.awayScore > last.homeScore);
      newsList.push({
        id: Math.random().toString(36), round,
        title: won ? 'Crítica: "Time competitivo!"' : 'Crítica: "Faltou repertório…"',
        body: won
          ? 'Colunistas elogiaram a intensidade e a leitura de jogo. A torcida quer sequência.'
          : 'A imprensa cobrou mais variações táticas e questionou a postura do time em momentos decisivos.',
        category: 'BOARD', isRead: false,
        impactText: won ? '+Moral leve' : '-Moral leve',
      });
      moralChanges.push({ teamId: userTeam.id, delta: won ? 1 : -1 });
    }
  }

  // 4) Staff Reports
  if (userTeam && hiredStaff.length > 0) {
    const coach = hiredStaff.find(s => s.type === 'COACH');
    const physio = hiredStaff.find(s => s.type === 'PHYSIO');
    const scout = hiredStaff.find(s => s.type === 'SCOUT');

    if (coach && Math.random() < 0.3) {
      const youngsters = userTeam.roster.filter(p => p.age <= 23).sort((a, b) => b.trainingProgress - a.trainingProgress);
      const starlet = youngsters[0];
      if (starlet) {
        newsList.push({
          id: Math.random().toString(36), round,
          title: `Relatório: ${coach.name} (Auxiliar)`,
          body: `Seu auxiliar ${coach.name} destaca a evolução de ${starlet.name}. "O garoto está treinando muito bem e logo deve atingir um novo patamar."`,
          category: 'TRAINING', isRead: false, impactText: 'Confiança +3'
        });
      }
    }

    if (physio && Math.random() < 0.3) {
      const tired = userTeam.roster.filter(p => p.energy < 75 && userTeam?.lineup.includes(p.id));
      if (tired.length > 0) {
        const p = tired[0];
        newsList.push({
          id: Math.random().toString(36), round,
          title: `Médico: Alerta de Fadiga`,
          body: `O fisioterapeuta ${physio.name} avisa que ${p.name} está com níveis de energia perigosos. "Risco iminente de lesão muscular se for a campo."`,
          category: 'MEDICAL', isRead: false, impactText: 'Risco de Lesão'
        });
      }
    }

    if (scout && Math.random() < 0.25) {
      const others = teams.flatMap(t => t.id !== userTeamId ? t.roster : []);
      const hiddenGem = others.filter(p => p.potential > 85 && p.age < 22)[0];
      if (hiddenGem) {
        newsList.push({
          id: Math.random().toString(36), round,
          title: `Scout: "Pérolas Escondidas"`,
          body: `Seu olheiro ${scout.name} encontrou um talento promissor em outro clube: ${hiddenGem.name} (Potencial ${hiddenGem.potential}). Vale a pena observar!`,
          category: 'MARKET', isRead: false, impactText: 'Dica de Ouro'
        });
      }
    }

    // Youth discovery
    const scoutOfficeBonus = (infrastructure.scout - 1) * 0.15;
    const discoveryChance = 0.2 + (scout ? 0.15 : 0) + scoutOfficeBonus;

    if (Math.random() < discoveryChance) {
      const firstNames = ['Kaio', 'Vinícius', 'Rayan', 'Endrick', 'Estevão', 'Léo', 'Kauã', 'Breno', 'Arthur', 'Igor'];
      const lastNames = ['Junior', 'Pires', 'Silva', 'Santos', 'Oliveira', 'Costa', 'Moura', 'Ribeiro', 'Vieira', 'Souza'];
      const positions: Player['position'][] = ['GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];

      const newProspect: Player = {
        id: `youth_${Math.random().toString(36).substr(2, 9)}`,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        position: positions[Math.floor(Math.random() * positions.length)],
        age: 15 + Math.floor(Math.random() * 3),
        overall: 45 + Math.floor(Math.random() * 12),
        potential: 78 + Math.floor(Math.random() * 15),
        energy: 100,
        isYouth: true,
        status: 'fit',
        yellowCards: 0,
        redCards: 0,
        trainingProgress: 0,
        marketValue: 50000,
        goals: 0,
        assists: 0,
        contractRounds: 0,
        history: [],
        seasonStats: { yellowCards: 0, redCards: 0, matchesSuspended: 0 },
        stats: { pace: 60, shooting: 55, passing: 58, dribbling: 60, defending: 50, physical: 55, keeping: 40 }
      } as Player;

      youthProspect = newProspect;

      newsList.push({
        id: Math.random().toString(36), round,
        title: `Academia: Nova Promessa!`,
        body: `Nosso departamento de captação encontrou um jovem talento em um torneio regional: ${newProspect.name} (${newProspect.position}, ${newProspect.age} anos). Ele já está treinando na nossa Academia de Base.`,
        category: 'MARKET', isRead: false, impactText: 'Joia Descoberta'
      });
    }
  }

  // 5) Player news
  if (Math.random() > 0.55 && userTeam) {
    const star = pickUserStar();
    if (star) {
      const rumor = Math.random() > 0.5;
      newsList.push({
        id: Math.random().toString(36), round,
        title: rumor ? `Rumor: ${star.name} na mira` : `${star.name} em alta`,
        body: rumor
          ? `Um clube tradicional sondou o empresário de ${star.name}. A diretoria vai segurar ou ouvir propostas?`
          : `${star.name} virou assunto nas rádios: "jogador decisivo". O vestiário sente o impacto.`,
        category: rumor ? 'MARKET' : 'MORAL', isRead: false,
        choices: rumor
          ? [
            { label: 'Blindar (moral +2 / caixa -20k)', impact: { funds: -20000, moral: 2, newsText: 'A diretoria fez um agrado e o elenco fechou com o projeto.' } },
            { label: 'Deixar rolar (moral -1)', impact: { moral: -1, newsText: 'Os boatos continuam e o ambiente fica mais tenso.' } },
          ]
          : undefined,
      });
    }
  }

  // 6) Transfer Sagas
  if (isWindowOpen && Math.random() > 0.82 && userTeam) {
    const star = pickUserStar();
    if (star) {
      const wealthyClubs = teams.filter(t => t.id !== userTeamId && (t.financeStatus === 'Rico' || t.division === 1));
      const buyer = wealthyClubs[Math.floor(Math.random() * wealthyClubs.length)];
      if (buyer) {
        const offerValue = Math.round((star.marketValue * (1.2 + Math.random() * 0.4)) / 1000) * 1000;
        newsList.push({
          id: Math.random().toString(36), round,
          title: `OFERTA OFICIAL: ${star.name}`,
          body: `O ${buyer.name} enviou uma proposta de ${formatCurrency(offerValue)} por ${star.name}. A diretoria está sob pressão: vender o craque ou manter o projeto?`,
          category: 'MARKET', isRead: false,
          choices: [
            {
              label: `Vender (${formatCurrency(offerValue)})`,
              impact: { playerId: star.id, sellValue: offerValue, moral: -8, newsText: `Negócio fechado. ${star.name} deixa o clube. A torcida está furiosa, mas o caixa está reforçado.` }
            },
            {
              label: 'Recusar Proposta',
              impact: { moral: 4, newsText: `Proposta rejeitada! "Dinheiro não compra tudo", diz a nota oficial. A torcida ovaciona a diretoria.` }
            },
          ],
        });
      }
    }
  }

  // 7) Transfer window alerts
  if (round === 1 || round === 6 || round === 10 || round === 15) {
    const openNow = (round >= 1 && round <= 5) || (round >= 10 && round <= 14);
    newsList.push({
      id: Math.random().toString(36), round,
      title: openNow ? 'Janela aberta: telefone não para' : 'Janela fechada: foco no campo',
      body: openNow
        ? 'Empresários ligando o tempo todo. A pressão aumenta para reforçar o elenco.'
        : 'Sem negociações oficiais. Agora é ponto e treino.',
      category: 'MARKET', isRead: false,
    });
  }

  // 8) World Cup flavor
  if (season === 2026) {
    if (round === 10) newsList.push({ id: Math.random().toString(36), round, title: 'Copa 2026: Olheiros no Estádio', body: 'A comissão técnica da Seleção enviou olheiros para observar destaques do campeonato. Todos querem uma vaga na Copa!', category: 'BOARD', isRead: false });
    if (round === 18) newsList.push({ id: Math.random().toString(36), round, title: 'Pausa para a Copa Aproxima-se', body: 'O calendário ficará apertado devido ao Mundial nos EUA. Prepare o elenco para a maratona.', category: 'BOARD', isRead: false });
  }

  // 9) Ensure at least 1 news per round
  if (newsList.length === 0) {
    newsList.push({
      id: Math.random().toString(36), round,
      title: 'Bastidores do CT',
      body: 'Treino fechado. A comissão prepara ajustes finos para a próxima rodada.',
      category: 'HEALTH', isRead: false,
    });
  }

  return { news: newsList, youthProspect, moralChanges };
}
