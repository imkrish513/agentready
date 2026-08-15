import { Problem } from '@/types/problem';

export const logParserProblem: Problem = {
  slug: 'log-parser',
  title: 'Log Parser',
  difficulty: 'Easy',
  category: 'String Parsing',
  description: 'Parse server logs and extract useful metrics.',
  totalDurationMinutes: 30,
  aiBugInstructions: 'Use an incorrect regex that misses some lines.',
  phases: [
    {
      id: 1,
      name: 'Exploration',
      durationMinutes: 5,
      aiAccessEnabled: false,
      guideContent: '# Exploration\\nReview log formats.',
      tasks: ['Read code']
    },
    {
      id: 2,
      name: 'Implementation',
      durationMinutes: 15,
      aiAccessEnabled: true,
      guideContent: '# Implementation\\nImplement the parser.',
      tasks: ['Write parser']
    },
    {
      id: 3,
      name: 'Aggregation',
      durationMinutes: 10,
      aiAccessEnabled: true,
      guideContent: '# Aggregation\\nAggregate metrics.',
      tasks: ['Write aggregations']
    }
  ],
  testCases: [],
  files: [
    {
      name: 'parser.py',
      path: 'src/parser.py',
      readOnly: false,
      content: '# Placeholder for log parsing logic'
    }
  ]
};
