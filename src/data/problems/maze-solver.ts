import { Problem } from '@/types/problem';

export const mazeSolverProblem: Problem = {
  slug: 'maze-solver',
  title: 'Maze Pathfinder',
  difficulty: 'Medium',
  category: 'Graphs',
  description: 'Implement a pathfinding algorithm to solve a 2D maze.',
  totalDurationMinutes: 45,
  aiBugInstructions: 'Introduce an off-by-one error in bounds checking.',
  phases: [
    {
      id: 1,
      name: 'Exploration',
      durationMinutes: 10,
      aiAccessEnabled: false,
      guideContent: '# Exploration\\nReview the grid structure.',
      tasks: ['Read code']
    },
    {
      id: 2,
      name: 'Implementation',
      durationMinutes: 20,
      aiAccessEnabled: true,
      guideContent: '# Implementation\\nImplement BFS.',
      tasks: ['Write BFS']
    },
    {
      id: 3,
      name: 'Optimization',
      durationMinutes: 15,
      aiAccessEnabled: true,
      guideContent: '# Optimization\\nOptimize to A*.',
      tasks: ['Implement A*']
    }
  ],
  testCases: [],
  files: [
    {
      name: 'maze.py',
      path: 'src/maze.py',
      readOnly: false,
      content: '# Placeholder for maze logic'
    }
  ]
};
