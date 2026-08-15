import styles from './layout.module.css';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            Agent<span className={styles.accent}>Ready</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
