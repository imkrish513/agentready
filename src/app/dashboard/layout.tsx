'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Link href="/dashboard" className={styles.logo}>
            Agent<span className={styles.accent}>Ready</span>
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link 
            href="/dashboard" 
            className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/profile" 
            className={`${styles.navLink} ${pathname === '/profile' ? styles.active : ''}`}
          >
            Profile
          </Link>
          <Link 
            href="/settings" 
            className={`${styles.navLink} ${pathname === '/settings' ? styles.active : ''}`}
          >
            Settings
          </Link>
        </div>

        <div className={styles.footer}>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
