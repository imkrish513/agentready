import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <header className={styles.header}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>Agent<span>Ready</span></div>
          <nav className={styles.navLinks}>
            <a href="#how-it-works">How It Works</a>
            <a href="#features">Features</a>
          </nav>
          <div className={styles.navActions}>
            <Link href="/auth/login" className={styles.signInBtn}>Sign In</Link>
            <Link href="/auth/signup" className={styles.getStartedBtn}>Get Started</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.gradientBlob1}></div>
            <div className={styles.gradientBlob2}></div>
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Master the <span>AI-Pair</span> Interview
            </h1>
            <p className={styles.heroSubtitle}>
              Interviews are changing. The future is agentic. Prep solo with our buggy AI and get scored on how well you guide, correct, and pair-program with AI agents.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/auth/signup" className={styles.primaryCta}>Start Practicing</Link>
              <a href="#how-it-works" className={styles.secondaryCta}>See How It Works</a>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section className={styles.problemStatement}>
          <h2>Interviews are changing. Are you ready?</h2>
          <p>
            Companies are shifting away from Leetcode and moving towards agentic coding interviews. 
            You aren&apos;t just writing code anymore; you&apos;re collaborating with AI, debugging its mistakes, and steering it to the right architecture.
          </p>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className={`${styles.section} ${styles.howItWorks}`}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <h3>Choose a Problem</h3>
              <p>Select from our library of real-world agentic interview scenarios.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <h3>Code with a Buggy AI</h3>
              <p>Interact with our custom AI that makes intentional, realistic mistakes to test your steering skills.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <h3>Get Scored</h3>
              <p>Receive comprehensive feedback on your approach, control, verification, and communication.</p>
            </div>
          </div>
        </section>

        {/* IDE Preview Section */}
        <section id="features" className={`${styles.section} ${styles.idePreview}`}>
          <h2 className={styles.sectionTitle}>Experience the Interview Environment</h2>
          <div className={styles.mockIde}>
            <div className={styles.ideHeader}>
              <div className={styles.ideDots}>
                <span className={styles.dotRed}></span>
                <span className={styles.dotYellow}></span>
                <span className={styles.dotGreen}></span>
              </div>
              <div className={styles.ideTabs}>
                <div className={styles.ideTabActive}>solution.tsx</div>
                <div className={styles.ideTab}>agent-chat</div>
              </div>
            </div>
            <div className={styles.ideBody}>
              <div className={styles.ideSidebar}>
                <div className={styles.fileItem}>src/</div>
                <div className={styles.fileItemActive}>📄 solution.tsx</div>
                <div className={styles.fileItem}>📄 tests.ts</div>
              </div>
              <div className={styles.ideEditor}>
                <pre><code>{`// AI Agent generated this code:
function processData(data: any[]) {
  // TODO: Fix the O(n^2) performance issue
  return data.map((item) => {
    return data.filter(d => d.id === item.id);
  });
}

/* 
  Your Turn: 
  Guide the AI to refactor this into an O(n) solution 
  using a Map or Set.
*/`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Rubric Section */}
        <section className={`${styles.section} ${styles.rubric}`}>
          <h2 className={styles.sectionTitle}>Evaluated on What Matters</h2>
          <div className={styles.rubricGrid}>
            <div className={styles.rubricCard}>
              <div className={styles.rubricIcon}>🎯</div>
              <h3>Approach</h3>
              <p>How well do you break down the problem before diving into code?</p>
            </div>
            <div className={styles.rubricCard}>
              <div className={styles.rubricIcon}>🕹️</div>
              <h3>Control</h3>
              <p>Can you steer the AI when it goes down the wrong rabbit hole?</p>
            </div>
            <div className={styles.rubricCard}>
              <div className={styles.rubricIcon}>✅</div>
              <h3>Verification</h3>
              <p>Do you thoroughly test and verify the AI&apos;s output before moving on?</p>
            </div>
            <div className={styles.rubricCard}>
              <div className={styles.rubricIcon}>💬</div>
              <h3>Communication</h3>
              <p>Are your prompts clear, concise, and unambiguous?</p>
            </div>
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className={`${styles.section} ${styles.ctaSection}`}>
          <h2>Ready to ace your next interview?</h2>
          <p>Join thousands of engineers preparing for the future of technical interviews.</p>
          <Link href="/auth/signup" className={styles.primaryCtaLarge}>Get Started for Free</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>Agent<span>Ready</span></div>
            <p>© {new Date().getFullYear()} AgentReady. All rights reserved.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
