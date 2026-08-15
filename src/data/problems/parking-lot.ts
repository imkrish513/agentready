import { Problem } from '@/types/problem';

export const parkingLotProblem: Problem = {
  slug: 'parking-lot',
  title: 'Parking Lot System',
  difficulty: 'Hard',
  category: 'OOP Design',
  description: 'Design an object-oriented parking lot system.',
  totalDurationMinutes: 60,
  aiBugInstructions: 'Forget to free up spots when a car leaves.',
  phases: [
    {
      id: 1,
      name: 'Exploration',
      durationMinutes: 10,
      aiAccessEnabled: false,
      guideContent: '# Exploration\\nReview classes.',
      tasks: ['Read code']
    },
    {
      id: 2,
      name: 'Implementation',
      durationMinutes: 30,
      aiAccessEnabled: true,
      guideContent: '# Implementation\\nImplement ticketing.',
      tasks: ['Write ticketing logic']
    },
    {
      id: 3,
      name: 'Extensions',
      durationMinutes: 20,
      aiAccessEnabled: true,
      guideContent: '# Extensions\\nAdd support for electric vehicles.',
      tasks: ['Add EV spots']
    }
  ],
  testCases: [],
  files: [
    {
      name: 'parking.py',
      path: 'src/parking.py',
      readOnly: false,
      content: '# Placeholder for parking lot logic'
    }
  ]
};
