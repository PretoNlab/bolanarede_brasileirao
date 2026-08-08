import { ContinentalTournamentType, Team } from './types';
import { selectBestLineupForFormation } from './engine/tacticsEngine';
import { createSouthAmericanRoster } from './southAmericanRosterFactory';

export const CONTINENTAL_2026_GROUPS: Record<ContinentalTournamentType, string[][]> = {
  LIBERTADORES: [
    ['flamengo', 'estudiantes-la-plata', 'cusco-fc', 'independiente-medellin'],
    ['nacional-uru', 'universitario-per', 'coquimbo-unido', 'deportes-tolima'],
    ['fluminense', 'bolivar', 'deportivo-la-guaira', 'independiente-rivadavia'],
    ['boca-juniors', 'cruzeiro', 'universidad-catolica', 'barcelona-sc'],
    ['penarol', 'corinthians', 'independiente-santa-fe', 'platense'],
    ['palmeiras', 'cerro-porteno', 'junior-barranquilla', 'sporting-cristal'],
    ['ldu-quito', 'lanus', 'always-ready', 'mirassol'],
    ['independiente-del-valle', 'libertad-py', 'rosario-central', 'ucv-fc'],
  ],
  SUDAMERICANA: [
    ['america-de-cali', 'tigre', 'macara', 'alianza-atletico'],
    ['atletico-mg', 'cienciano', 'puerto-cabello', 'juventud-uru'],
    ['saopaulo', 'millonarios', 'boston-river', 'ohiggins'],
    ['santos', 'san-lorenzo', 'deportivo-cuenca', 'recoleta-py'],
    ['racing-club', 'caracas', 'independiente-petrolero', 'botafogo'],
    ['gremio', 'palestino', 'montevideo-city-torque', 'deportivo-riestra'],
    ['olimpia', 'vasco', 'audax-italiano', 'barracas-central'],
    ['river-plate', 'bragantino', 'blooming', 'carabobo'],
  ],
};

type ClubSeed = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  rating: number;
};

const CLUB_SEEDS: ClubSeed[] = [
  { id: 'cusco-fc', name: 'Cusco FC', shortName: 'CUS', city: 'Cusco', rating: 76 },
  { id: 'independiente-medellin', name: 'Independiente Medellín', shortName: 'DIM', city: 'Medellín', rating: 80 },
  { id: 'coquimbo-unido', name: 'Coquimbo Unido', shortName: 'COQ', city: 'Coquimbo', rating: 77 },
  { id: 'deportes-tolima', name: 'Deportes Tolima', shortName: 'TOL', city: 'Ibagué', rating: 79 },
  { id: 'deportivo-la-guaira', name: 'Deportivo La Guaira', shortName: 'DLG', city: 'Caracas', rating: 75 },
  { id: 'independiente-rivadavia', name: 'Independiente Rivadavia', shortName: 'IRV', city: 'Mendoza', rating: 78 },
  { id: 'independiente-santa-fe', name: 'Independiente Santa Fe', shortName: 'SFE', city: 'Bogota', rating: 80 },
  { id: 'platense', name: 'Platense', shortName: 'PLA', city: 'Vicente Lopez', rating: 78 },
  { id: 'sporting-cristal', name: 'Sporting Cristal', shortName: 'SCR', city: 'Lima', rating: 80 },
  { id: 'lanus', name: 'Lanús', shortName: 'LAN', city: 'Lanús', rating: 82 },
  { id: 'always-ready', name: 'Always Ready', shortName: 'ALW', city: 'El Alto', rating: 78 },
  { id: 'rosario-central', name: 'Rosario Central', shortName: 'ROS', city: 'Rosario', rating: 81 },
  { id: 'ucv-fc', name: 'Universidad Central', shortName: 'UCV', city: 'Caracas', rating: 75 },
  { id: 'america-de-cali', name: 'América de Cali', shortName: 'AME', city: 'Cali', rating: 80 },
  { id: 'tigre', name: 'Tigre', shortName: 'TIG', city: 'Victoria', rating: 78 },
  { id: 'macara', name: 'Macará', shortName: 'MAC', city: 'Ambato', rating: 76 },
  { id: 'alianza-atletico', name: 'Alianza Atlético', shortName: 'AAT', city: 'Sullana', rating: 75 },
  { id: 'cienciano', name: 'Cienciano', shortName: 'CIE', city: 'Cusco', rating: 78 },
  { id: 'puerto-cabello', name: 'Academia Puerto Cabello', shortName: 'APC', city: 'Puerto Cabello', rating: 75 },
  { id: 'juventud-uru', name: 'Juventud', shortName: 'JUV', city: 'Las Piedras', rating: 75 },
  { id: 'boston-river', name: 'Boston River', shortName: 'BOS', city: 'Montevideo', rating: 76 },
  { id: 'ohiggins', name: "O'Higgins", shortName: 'OHI', city: 'Rancagua', rating: 77 },
  { id: 'deportivo-cuenca', name: 'Deportivo Cuenca', shortName: 'CUE', city: 'Cuenca', rating: 76 },
  { id: 'recoleta-py', name: 'Deportivo Recoleta', shortName: 'REC', city: 'Asunción', rating: 74 },
  { id: 'caracas', name: 'Caracas FC', shortName: 'CAR', city: 'Caracas', rating: 77 },
  { id: 'independiente-petrolero', name: 'Independiente Petrolero', shortName: 'INP', city: 'Sucre', rating: 75 },
  { id: 'palestino', name: 'Palestino', shortName: 'PAL', city: 'Santiago', rating: 78 },
  { id: 'montevideo-city-torque', name: 'Montevideo City Torque', shortName: 'MCT', city: 'Montevideo', rating: 77 },
  { id: 'deportivo-riestra', name: 'Deportivo Riestra', shortName: 'RIE', city: 'Buenos Aires', rating: 77 },
  { id: 'audax-italiano', name: 'Audax Italiano', shortName: 'AUD', city: 'Santiago', rating: 77 },
  { id: 'barracas-central', name: 'Barracas Central', shortName: 'BAR', city: 'Buenos Aires', rating: 77 },
  { id: 'blooming', name: 'Blooming', shortName: 'BLO', city: 'Santa Cruz', rating: 75 },
  { id: 'carabobo', name: 'Carabobo FC', shortName: 'CAB', city: 'Valencia', rating: 75 },
];

export const CONTINENTAL_2026_EXTRA_CLUBS: Team[] = CLUB_SEEDS.map((club, index) => {
  const roster = createSouthAmericanRoster(club.id, club.rating);
  if (roster.length === 0) {
    throw new Error(`Elenco continental de agosto de 2026 ausente: ${club.id}`);
  }
  return {
    id: club.id,
    name: club.name,
    shortName: club.shortName,
    city: club.city,
    logoColor1: index % 2 === 0 ? 'from-sky-700' : 'from-rose-700',
    logoColor2: index % 3 === 0 ? 'to-white' : 'to-zinc-950',
    logoUrl: `/logos/continental/${club.id}.png`,
    attack: club.rating,
    defense: club.rating,
    roster,
    lineup: selectBestLineupForFormation(roster, '4-3-3'),
    formation: '4-3-3',
    style: 'Equilibrado',
    instructions: { pressing: 'MEDIA', passing: 'MISTO', tempo: 'PADRAO' },
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    points: 0,
    moral: 75,
    division: 0,
    stadiumCapacity: 25000,
  };
});
