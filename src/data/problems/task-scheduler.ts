import { Problem } from '@/types/problem';

export const taskSchedulerProblem: Problem = {
  slug: 'task-scheduler',
  title: 'Task Scheduler',
  difficulty: 'Hard',
  category: 'Data Structures',
  description: 'Implement a priority-based task scheduler.',
  totalDurationMinutes: 60,
  aiBugInstructions: 'Implement the priority queue incorrectly.',
  phases: [
    {
      id: 1,
      name: 'Exploration',
      durationMinutes: 10,
      aiAccessEnabled: false,
      guideContent: '# Exploration\\nReview the scheduler framework.',
      tasks: ['Read code']
    },
    {
      id: 2,
      name: 'Implementation',
      durationMinutes: 30,
      aiAccessEnabled: true,
      guideContent: '# Implementation\\nImplement the scheduler.',
      tasks: ['Write scheduling logic']
    },
    {
      id: 3,
      name: 'Concurrency',
      durationMinutes: 20,
      aiAccessEnabled: true,
      guideContent: '# Concurrency\\nMake it thread-safe.',
      tasks: ['Add locks']
    }
  ],
  testCases: [],
  files: [
    {
      name: 'scheduler.py',
      path: 'src/scheduler.py',
      readOnly: false,
      content: '# Placeholder for task scheduler logic'
    }
  ]
};
