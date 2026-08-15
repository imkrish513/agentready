import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import styles from './page.module.css';

const PROBLEMS = [
  { slug: 'card-game', title: 'Card Game Engine', difficulty: 'Medium', category: 'Data Structures', description: 'Build a card game with deck management and game logic' },
  { slug: 'maze-solver', title: 'Maze Pathfinder', difficulty: 'Medium', category: 'Graphs', description: 'Find the shortest path through a maze using BFS/DFS' },
  { slug: 'parking-lot', title: 'Parking Lot System', difficulty: 'Hard', category: 'OOP Design', description: 'Design an object-oriented parking lot management system' },
  { slug: 'log-parser', title: 'Log Parser', difficulty: 'Easy', category: 'String Parsing', description: 'Parse and analyze structured log files' },
  { slug: 'task-scheduler', title: 'Task Scheduler', difficulty: 'Hard', category: 'Data Structures', description: 'Build a priority-based task scheduling system' },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user profile if it exists
  let userName = '';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    
    if (profile?.full_name) {
      userName = profile.full_name;
    } else {
      userName = user.user_metadata?.full_name || '';
    }
  }

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return styles.difficultyEasy;
      case 'Medium': return styles.difficultyMedium;
      case 'Hard': return styles.difficultyHard;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>
          Welcome{userName ? ` back, ${userName}` : ''}
        </h1>
        <p className={styles.subtitle}>Ready for your next agentic interview prep session?</p>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Problems Solved</h3>
          <p className={styles.statValue}>0<span className={styles.statTotal}>/5</span></p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Avg Score</h3>
          <p className={styles.statValue}>--</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Sessions</h3>
          <p className={styles.statValue}>0</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Practice Time</h3>
          <p className={styles.statValue}>0h</p>
        </div>
      </section>

      <section className={styles.problemsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Practice Problems</h2>
        </div>

        <div className={styles.problemGrid}>
          {PROBLEMS.map((problem) => (
            <Link href={`/problems/${problem.slug}`} key={problem.slug} className={styles.problemCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.problemTitle}>{problem.title}</h3>
                <span className={`${styles.difficulty} ${getDifficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className={styles.category}>{problem.category}</div>
              <p className={styles.description}>{problem.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.status}>Not Started</span>
                <span className={styles.actionText}>Start →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
