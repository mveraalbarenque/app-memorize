export const DEFAULT_CATEGORY = 'emojis';

export interface CatEntry {
  key: string;
  label: string;
  icon: string;
  iconImg?: string;
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultyGroup {
  difficulty: Difficulty;
  levelRange: [number, number];
  categories: CatEntry[];
}

export const CATEGORIES: Record<Difficulty, DifficultyGroup> = {
  easy: {
    difficulty: 'easy',
    levelRange: [1, 3],
    categories: [
      {
        key: 'emojis',
        label: 'Emojis',
        icon: '',
        iconImg: 'categorias/emojis/cool.svg',
      },
      {
        key: 'mario',
        label: 'Mario',
        icon: '',
        iconImg: 'categorias/mario/m.svg',
      },
      {
        key: 'tools',
        label: 'Herramientas',
        icon: '',
        iconImg: 'icons/tools.svg',
      },
    ],
  },
  normal: {
    difficulty: 'normal',
    levelRange: [3, 4],
    categories: [
      {
        key: 'mario',
        label: 'Mario',
        icon: '',
        iconImg: 'categorias/mario/m.svg',
      },
      {
        key: 'frameworks',
        label: 'Frameworks',
        icon: '',
        iconImg: 'icons/frameworks.svg',
      },
      {
        key: 'lenguages',
        label: 'Lenguajes',
        icon: '',
        iconImg: 'icons/languages.svg',
      },
    ],
  },
  hard: {
    difficulty: 'hard',
    levelRange: [4, 6],
    categories: [
      {
        key: 'pokers',
        label: 'Pokers',
        icon: '',
        iconImg: 'categorias/pokers/par.svg',
      },
      {
        key: 'dices',
        label: 'Dados',
        icon: '',
        iconImg: 'categorias/dices/azul-6.svg',
      },
      {
        key: 'lenguages',
        label: 'Lenguajes',
        icon: '',
        iconImg: 'icons/languages.svg',
      },
    ],
  },
};

export const ALL_CATEGORIES: CatEntry[] = Object.values(CATEGORIES).flatMap(
  (g) => g.categories
);

export const getLevelRange = (cat: string, diff?: Difficulty): [number, number] => {
  if (diff) return CATEGORIES[diff].levelRange
  for (const group of Object.values(CATEGORIES)) {
    if (group.categories.some((c) => c.key === cat)) return group.levelRange
  }
  return [0, 0]
}

export const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard'];
