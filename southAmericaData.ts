import { Team, Player, DetailedPosition } from './types';

const generateStats = (detPos: DetailedPosition, ovr: number) => {
  const r = (base: number) => Math.min(99, Math.max(10, Math.round(base)));
  const stats = {
    pace: r(ovr * 0.8), shooting: r(ovr * 0.7), passing: r(ovr * 0.75), dribbling: r(ovr * 0.75),
    defending: r(ovr * 0.6), physical: r(ovr * 0.8), keeping: 10,
    crossing: r(ovr * 0.7), finishing: r(ovr * 0.7), tackling: r(ovr * 0.6),
    marking: r(ovr * 0.6), positioning: r(ovr * 0.75), strength: r(ovr * 0.8),
    stamina: r(ovr * 0.8), vision: r(ovr * 0.75), longShot: r(ovr * 0.65),
    heading: r(ovr * 0.65), reflexes: 10, handling: 10
  };

  if (detPos === 'GK') {
    stats.keeping = r(ovr * 0.95);
    stats.reflexes = r(ovr * 1.05);
    stats.handling = r(ovr * 0.9);
    stats.pace = r(40);
  } else if (['CB', 'DM'].includes(detPos)) {
    stats.defending = r(ovr * 0.95);
    stats.marking = r(ovr * 0.9);
    stats.tackling = r(ovr * 0.9);
    stats.strength = r(ovr * 0.85);
  } else if (['ST', 'LW', 'RW'].includes(detPos)) {
    stats.finishing = r(ovr * 0.95);
    stats.shooting = r(ovr * 0.9);
    stats.pace = r(ovr * 0.85);
  }
  return stats;
};

const createPlayer = (id: string, name: string, pos: Player['position'], mainPos: DetailedPosition, ovr: number, age: number, foot: 'LEFT' | 'RIGHT' | 'BOTH' = 'RIGHT'): Player => {
  const baseVal = Math.pow(ovr, 3.2) * 12 * (age < 23 ? 1.3 : age > 31 ? 0.75 : 1);
  return {
    id,
    name,
    position: pos,
    mainPosition: mainPos,
    secondaryPositions: [],
    preferredFoot: foot,
    age,
    overall: ovr,
    energy: 100,
    status: 'fit',
    yellowCards: 0,
    redCards: 0,
    marketValue: Math.round(baseVal / 1000) * 1000,
    goals: 0,
    assists: 0,
    potential: Math.min(99, ovr + (age < 22 ? 8 : 2)),
    contractRounds: 38,
    history: [],
    seasonStats: { yellowCards: 0, redCards: 0, matchesSuspended: 0 },
    stats: generateStats(mainPos, ovr)
  };
};

export const SOUTH_AMERICAN_FOREIGN_CLUBS: Omit<Team, 'instructions'>[] = [
  {
    id: 'boca-juniors',
    name: 'Boca Juniors',
    shortName: 'BOC',
    city: 'Buenos Aires',
    logoColor1: 'from-blue-700',
    logoColor2: 'to-yellow-500',
    logoUrl: '/logos/boca.svg',
    attack: 88,
    defense: 86,
    roster: [
      createPlayer('boc-1', 'Sergio Romero', 'GOL', 'GK', 81, 37),
      createPlayer('boc-2', 'Leandro Brey', 'GOL', 'GK', 75, 21),
      createPlayer('boc-3', 'Marcos Rojo', 'ZAG', 'CB', 80, 34, 'LEFT'),
      createPlayer('boc-4', 'Cristian Lema', 'ZAG', 'CB', 78, 34),
      createPlayer('boc-5', 'Aaron Anselmino', 'ZAG', 'CB', 79, 19),
      createPlayer('boc-6', 'Luis Advíncula', 'LAT', 'RB', 82, 34),
      createPlayer('boc-7', 'Lautaro Blanco', 'LAT', 'LB', 79, 25, 'LEFT'),
      createPlayer('boc-8', 'Pol Fernández', 'VOL', 'DM', 79, 32),
      createPlayer('boc-9', 'Cristian Medina', 'MEI', 'CM', 82, 22),
      createPlayer('boc-10', 'Kevin Zenón', 'MEI', 'AM', 83, 23, 'LEFT'),
      createPlayer('boc-11', 'Tomas Belmonte', 'VOL', 'DM', 78, 26),
      createPlayer('boc-12', 'Edinson Cavani', 'ATA', 'ST', 86, 37, 'RIGHT'),
      createPlayer('boc-13', 'Miguel Merentiel', 'ATA', 'ST', 84, 28),
      createPlayer('boc-14', 'Exequiel Zeballos', 'ATA', 'LW', 80, 22),
      createPlayer('boc-15', 'Milton Giménez', 'ATA', 'ST', 78, 27)
    ],
    lineup: ['boc-1', 'boc-6', 'boc-3', 'boc-5', 'boc-7', 'boc-8', 'boc-9', 'boc-10', 'boc-14', 'boc-12', 'boc-13'],
    formation: '4-3-3',
    style: 'Ofensivo',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 88,
    division: 1, stadiumCapacity: 54000, stadiumName: 'La Bombonera', socioCount: 300000
  },
  {
    id: 'river-plate',
    name: 'River Plate',
    shortName: 'RIV',
    city: 'Buenos Aires',
    logoColor1: 'from-red-600',
    logoColor2: 'to-white',
    logoUrl: '/logos/river.svg',
    attack: 90,
    defense: 88,
    roster: [
      createPlayer('riv-1', 'Franco Armani', 'GOL', 'GK', 83, 37),
      createPlayer('riv-2', 'Jeremías Ledesma', 'GOL', 'GK', 79, 31),
      createPlayer('riv-3', 'Germán Pezzella', 'ZAG', 'CB', 83, 33),
      createPlayer('riv-4', 'Paulo Díaz', 'ZAG', 'CB', 82, 29),
      createPlayer('riv-5', 'Landro González Pirez', 'ZAG', 'CB', 78, 32),
      createPlayer('riv-6', 'Fabricio Bustos', 'LAT', 'RB', 80, 28),
      createPlayer('riv-7', 'Marcos Acuña', 'LAT', 'LB', 84, 32, 'LEFT'),
      createPlayer('riv-8', 'Matias Kranevitter', 'VOL', 'DM', 78, 31),
      createPlayer('riv-9', 'Nacho Fernández', 'MEI', 'CM', 82, 34, 'LEFT'),
      createPlayer('riv-10', 'Manuel Lanzini', 'MEI', 'AM', 81, 31),
      createPlayer('riv-11', 'Claudio Echeverri', 'MEI', 'AM', 83, 18),
      createPlayer('riv-12', 'Franco Mastantuono', 'MEI', 'AM', 82, 17, 'LEFT'),
      createPlayer('riv-13', 'Miguel Borja', 'ATA', 'ST', 86, 31),
      createPlayer('riv-14', 'Facundo Colidio', 'ATA', 'LW', 81, 24),
      createPlayer('riv-15', 'Pablo Solari', 'ATA', 'RW', 81, 23)
    ],
    lineup: ['riv-1', 'riv-6', 'riv-3', 'riv-4', 'riv-7', 'riv-8', 'riv-9', 'riv-11', 'riv-15', 'riv-13', 'riv-14'],
    formation: '4-3-3',
    style: 'Ofensivo',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 90,
    division: 1, stadiumCapacity: 84000, stadiumName: 'MÂS Monumental', socioCount: 350000
  },
  {
    id: 'penarol',
    name: 'Peñarol',
    shortName: 'PEN',
    city: 'Montevideo',
    logoColor1: 'from-yellow-400',
    logoColor2: 'to-black',
    logoUrl: '/logos/penarol.svg',
    attack: 84,
    defense: 83,
    roster: [
      createPlayer('pen-1', 'Washington Aguerre', 'GOL', 'GK', 80, 31),
      createPlayer('pen-2', 'Javier Méndez', 'ZAG', 'CB', 79, 29),
      createPlayer('pen-3', 'Guzmán Rodríguez', 'ZAG', 'CB', 78, 24),
      createPlayer('pen-4', 'Pedro Milans', 'LAT', 'RB', 76, 22),
      createPlayer('pen-5', 'Lucas Hernández', 'LAT', 'LB', 77, 31, 'LEFT'),
      createPlayer('pen-6', 'Damían García', 'VOL', 'DM', 80, 20),
      createPlayer('pen-7', 'Eduardo Darias', 'MEI', 'CM', 79, 26),
      createPlayer('pen-8', 'Gastón Ramírez', 'MEI', 'AM', 79, 33, 'LEFT'),
      createPlayer('pen-9', 'Leonardo Sequeira', 'ATA', 'RW', 78, 29),
      createPlayer('pen-10', 'Jaime Báez', 'ATA', 'LW', 79, 29),
      createPlayer('pen-11', 'Maximiliano Silvera', 'ATA', 'ST', 82, 26),
      createPlayer('pen-12', 'Facundo Batista', 'ATA', 'ST', 77, 25)
    ],
    lineup: ['pen-1', 'pen-4', 'pen-2', 'pen-3', 'pen-5', 'pen-6', 'pen-7', 'pen-8', 'pen-9', 'pen-11', 'pen-10'],
    formation: '4-2-3-1',
    style: 'Equilibrado',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85,
    division: 1, stadiumCapacity: 40000, stadiumName: 'Campeón del Siglo', socioCount: 65000
  },
  {
    id: 'nacional-uru',
    name: 'Nacional',
    shortName: 'NAC',
    city: 'Montevideo',
    logoColor1: 'from-blue-600',
    logoColor2: 'to-white',
    logoUrl: '/logos/nacional.svg',
    attack: 83,
    defense: 82,
    roster: [
      createPlayer('nac-1', 'Luis Mejía', 'GOL', 'GK', 80, 33),
      createPlayer('nac-2', 'Sebastian Coates', 'ZAG', 'CB', 82, 33),
      createPlayer('nac-3', 'Diego Polenta', 'ZAG', 'CB', 78, 32, 'LEFT'),
      createPlayer('nac-4', 'Leandro Lozano', 'LAT', 'RB', 78, 25),
      createPlayer('nac-5', 'Gabriel Báez', 'LAT', 'LB', 76, 29),
      createPlayer('nac-6', 'Christian Oliva', 'VOL', 'DM', 78, 28),
      createPlayer('nac-7', 'Lucas Sanabria', 'MEI', 'CM', 80, 20),
      createPlayer('nac-8', 'Mauricio Pereyra', 'MEI', 'AM', 80, 34, 'LEFT'),
      createPlayer('nac-9', 'Antonio Galeano', 'ATA', 'RW', 77, 24),
      createPlayer('nac-10', 'Alexis Castro', 'MEI', 'CM', 78, 29),
      createPlayer('nac-11', 'Gonzalo Carneiro', 'ATA', 'ST', 81, 28),
      createPlayer('nac-12', 'Federico Santander', 'ATA', 'ST', 77, 33)
    ],
    lineup: ['nac-1', 'nac-4', 'nac-2', 'nac-3', 'nac-5', 'nac-6', 'nac-7', 'nac-8', 'nac-9', 'nac-11', 'nac-10'],
    formation: '4-3-3',
    style: 'Equilibrado',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 84,
    division: 1, stadiumCapacity: 34000, stadiumName: 'Gran Parque Central', socioCount: 60000
  },
  {
    id: 'ldu-quito',
    name: 'LDU Quito',
    shortName: 'LDU',
    city: 'Quito',
    logoColor1: 'from-white',
    logoColor2: 'to-red-600',
    logoUrl: '/logos/ldu.svg',
    attack: 83,
    defense: 83,
    roster: [
      createPlayer('ldu-1', 'Alexander Domínguez', 'GOL', 'GK', 81, 37),
      createPlayer('ldu-2', 'Ricardo Adé', 'ZAG', 'CB', 82, 34),
      createPlayer('ldu-3', 'Richard Mina', 'ZAG', 'CB', 78, 25),
      createPlayer('ldu-4', 'José Quintero', 'LAT', 'RB', 80, 34),
      createPlayer('ldu-5', 'Leonel Quiñónez', 'LAT', 'LB', 78, 30, 'LEFT'),
      createPlayer('ldu-6', 'Ezequiel Piovi', 'VOL', 'DM', 82, 31),
      createPlayer('ldu-7', 'Lucas Cornejo', 'MEI', 'CM', 76, 20),
      createPlayer('ldu-8', 'Jhojan Julio', 'MEI', 'AM', 81, 26),
      createPlayer('ldu-9', 'Lisandro Alzugaray', 'ATA', 'RW', 80, 34, 'LEFT'),
      createPlayer('ldu-10', 'Alex Arce', 'ATA', 'ST', 84, 29),
      createPlayer('ldu-11', 'Michael Estrada', 'ATA', 'ST', 80, 28)
    ],
    lineup: ['ldu-1', 'ldu-4', 'ldu-2', 'ldu-3', 'ldu-5', 'ldu-6', 'ldu-7', 'ldu-8', 'ldu-9', 'ldu-10', 'ldu-11'],
    formation: '4-4-2',
    style: 'Ofensivo',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 86,
    division: 1, stadiumCapacity: 41000, stadiumName: 'Rodrigo Paz Delgado', socioCount: 30000
  },
  {
    id: 'independiente-del-valle',
    name: 'Independiente del Valle',
    shortName: 'IDV',
    city: 'Sangolquí',
    logoColor1: 'from-blue-800',
    logoColor2: 'to-black',
    logoUrl: '/logos/idv.svg',
    attack: 83,
    defense: 82,
    roster: [
      createPlayer('idv-1', 'Moisés Ramírez', 'GOL', 'GK', 80, 23),
      createPlayer('idv-2', 'Mateo Carabajal', 'ZAG', 'CB', 80, 27),
      createPlayer('idv-3', 'Richard Schunke', 'ZAG', 'CB', 81, 32),
      createPlayer('idv-4', 'Matías Fernández', 'LAT', 'RB', 78, 29),
      createPlayer('idv-5', 'Beder Caicedo', 'LAT', 'LB', 77, 32, 'LEFT'),
      createPlayer('idv-6', 'Cristian Zabala', 'VOL', 'DM', 79, 26),
      createPlayer('idv-7', 'Jordy Alcívar', 'MEI', 'CM', 79, 25),
      createPlayer('idv-8', 'Junior Sornoza', 'MEI', 'AM', 83, 30, 'RIGHT'),
      createPlayer('idv-9', 'Renato Ibarra', 'ATA', 'RW', 80, 33),
      createPlayer('idv-10', 'Keny Arroyo', 'ATA', 'LW', 80, 18, 'LEFT'),
      createPlayer('idv-11', 'Jeison Medina', 'ATA', 'ST', 81, 29)
    ],
    lineup: ['idv-1', 'idv-4', 'idv-2', 'idv-3', 'idv-5', 'idv-6', 'idv-7', 'idv-8', 'idv-9', 'idv-11', 'idv-10'],
    formation: '4-3-3',
    style: 'Ofensivo',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85,
    division: 1, stadiumCapacity: 12000, stadiumName: 'Banco Guayaquil', socioCount: 15000
  },
  {
    id: 'olimpia',
    name: 'Olimpia',
    shortName: 'OLI',
    city: 'Asunción',
    logoColor1: 'from-white',
    logoColor2: 'to-black',
    logoUrl: '/logos/olimpia.svg',
    attack: 81,
    defense: 81,
    roster: [
      createPlayer('oli-1', 'Gastón Olveira', 'GOL', 'GK', 81, 31),
      createPlayer('oli-2', 'Junior Barreto', 'ZAG', 'CB', 78, 26),
      createPlayer('oli-3', 'Manuel Capasso', 'ZAG', 'CB', 77, 28),
      createPlayer('oli-4', 'César Olmedo', 'LAT', 'RB', 76, 21),
      createPlayer('oli-5', 'Facundo Zabala', 'LAT', 'LB', 77, 25, 'LEFT'),
      createPlayer('oli-6', 'Richard Ortiz', 'VOL', 'DM', 80, 34, 'LEFT'),
      createPlayer('oli-7', 'Alex Franco', 'MEI', 'CM', 77, 23),
      createPlayer('oli-8', 'Rodney Redes', 'MEI', 'AM', 78, 24),
      createPlayer('oli-9', 'Derlis González', 'ATA', 'LW', 81, 30),
      createPlayer('oli-10', 'Lucas Pratto', 'ATA', 'ST', 79, 36),
      createPlayer('oli-11', 'Hugo Adrián Benítez', 'ATA', 'ST', 76, 25)
    ],
    lineup: ['oli-1', 'oli-4', 'oli-2', 'oli-3', 'oli-5', 'oli-6', 'oli-7', 'oli-8', 'oli-9', 'oli-10', 'oli-11'],
    formation: '4-4-2',
    style: 'Equilibrado',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 82,
    division: 1, stadiumCapacity: 22000, stadiumName: 'Manuel Ferreira', socioCount: 30000
  },
  {
    id: 'colo-colo',
    name: 'Colo-Colo',
    shortName: 'COL',
    city: 'Santiago',
    logoColor1: 'from-white',
    logoColor2: 'to-black',
    logoUrl: '/logos/colocolo.svg',
    attack: 82,
    defense: 81,
    roster: [
      createPlayer('col-1', 'Brayan Cortés', 'GOL', 'GK', 81, 29),
      createPlayer('col-2', 'Maximilliano Falcón', 'ZAG', 'CB', 80, 27),
      createPlayer('col-3', 'Alan Saldivia', 'ZAG', 'CB', 78, 22),
      createPlayer('col-4', 'Oscar Opazo', 'LAT', 'RB', 77, 33),
      createPlayer('col-5', 'Erick Wiemberg', 'LAT', 'LB', 77, 29, 'LEFT'),
      createPlayer('col-6', 'Esteban Pavez', 'VOL', 'DM', 79, 34),
      createPlayer('col-7', 'Arturo Vidal', 'MEI', 'CM', 83, 37),
      createPlayer('col-8', 'Leonardo Gil', 'MEI', 'CM', 79, 33, 'LEFT'),
      createPlayer('col-9', 'Carlos Palacios', 'MEI', 'AM', 82, 24),
      createPlayer('col-10', 'Javier Correa', 'ATA', 'ST', 80, 31),
      createPlayer('col-11', 'Lucas Cepeda', 'ATA', 'LW', 79, 21, 'LEFT')
    ],
    lineup: ['col-1', 'col-4', 'col-2', 'col-3', 'col-5', 'col-6', 'col-7', 'col-9', 'col-11', 'col-10', 'col-8'],
    formation: '4-3-3',
    style: 'Ofensivo',
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 84,
    division: 1, stadiumCapacity: 47000, stadiumName: 'Monumental David Arellano', socioCount: 50000
  }
];
