export const DEFAULT_CATEGORY = 'emojis';

export interface CatEntry {
  key: string;
  label: string;
  icon: string;
  iconImg?: string;
  difficulty: 'easy' | 'normal' | 'hard';
  levelRange: [number, number];
}

export const CATEGORIES: CatEntry[] = [
  {
    key: 'emojis',
    label: 'Emojis',
    icon: '',
    iconImg: 'categorias/emojis/cool.svg',
    difficulty: 'easy',
    levelRange: [1, 3],
  },
  {
    key: 'mario',
    label: 'Mario',
    icon: '',
    iconImg: 'categorias/mario/m.svg',
    difficulty: 'easy',
    levelRange: [1, 3],
  },
  {
    key: 'frameworks',
    label: 'Frameworks',
    icon: '⚙',
    difficulty: 'normal',
    levelRange: [3, 4],
  },
  {
    key: 'tools',
    label: 'Herramientas',
    icon: '🛠',
    difficulty: 'normal',
    levelRange: [3, 4],
  },
  {
    key: 'pokers',
    label: 'Pokers',
    icon: '',
    iconImg: 'categorias/pokers/par.svg',
    difficulty: 'hard',
    levelRange: [4, 6],
  },
  {
    key: 'dices',
    label: 'Dados',
    icon: '',
    iconImg: 'categorias/dices/azul-6.svg',
    difficulty: 'hard',
    levelRange: [4, 6],
  },
  {
    key: 'lenguages',
    label: 'Lenguajes',
    icon: '💻',
    difficulty: 'hard',
    levelRange: [4, 6],
  },
];

export const getLevelRange = (cat: string): [number, number] =>
  CATEGORIES.find((c) => c.key === cat)?.levelRange ?? [0, 0];
