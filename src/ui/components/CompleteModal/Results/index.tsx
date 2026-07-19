import { memo } from 'react';
import type { PlayerResult } from '@/core/types';
import Multi from './Tables/Multi';
import Single from './Tables/Single';

interface Props {
  results: PlayerResult[];
  isMulti: boolean;
}

const ResultsTable = memo(({ results, isMulti }: Props) =>
  isMulti ? <Multi results={results} /> : <Single result={results[0]} />
);

export default ResultsTable;
