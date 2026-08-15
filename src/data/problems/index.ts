import { Problem } from '@/types/problem';
import { cardGameProblem } from './card-game';
import { mazeSolverProblem } from './maze-solver';
import { parkingLotProblem } from './parking-lot';
import { logParserProblem } from './log-parser';
import { taskSchedulerProblem } from './task-scheduler';

const problems: Record<string, Problem> = {
  'card-game': cardGameProblem,
  'maze-solver': mazeSolverProblem,
  'parking-lot': parkingLotProblem,
  'log-parser': logParserProblem,
  'task-scheduler': taskSchedulerProblem,
};

export function getProblem(slug: string): Problem | undefined {
  return problems[slug];
}

export function getAllProblems(): Problem[] {
  return Object.values(problems);
}

export function getAllProblemSlugs(): string[] {
  return Object.keys(problems);
}
