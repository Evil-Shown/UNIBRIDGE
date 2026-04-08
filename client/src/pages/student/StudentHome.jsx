
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import '../../styles/studentHome.css';

// ========== Helper: useCounter (with cleanup) ==========
function useCounter(target, duration = 1200) {
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    let frameId;

    const update = () => {
      start = Math.min(start + step, target);
      if (ref.current) ref.current.textContent = Math.floor(start);
      if (start < target) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);
  return ref;
}

// ========== Particle Canvas Background ==========
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const initParticles = (width, height) => {
      particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="student-canvas" />;
}

// ========== Hero Section ==========
function Hero({ user, navigate }) {
  const firstName = user?.name?.split(' ')[0] ?? 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <section className="dashboard-hero fade-in-up">
      <div className="hero-badge">
        <span className="badge-dot"></span>
        Student Portal
      </div>
      <h1 className="hero-title">
        {greeting},{' '}
        <span className="gradient-text">{firstName}!</span>
      </h1>
      <p className="hero-subtitle">
        Your launchpad for materials, opportunities, and peer learning — all in one place.
      </p>
    </section>
  );
}

function ProfileSnapshot({ user, navigate }) {
  const fullName = user?.name || 'Student User';
  const firstLetter = fullName.charAt(0).toUpperCase();

  return (
    <aside className="profile-snapshot fade-in-up">
      <div className="snapshot-avatar">{firstLetter}</div>
      <h3>{fullName}</h3>
      <p>{user?.email || 'student@unibridge.lk'}</p>

      <div className="snapshot-progress-block">
        <div className="snapshot-progress-head">
          <span>Profile completion</span>
          <strong>72%</strong>
        </div>
        <div className="snapshot-progress-track">
          <div className="snapshot-progress-fill" style={{ width: '72%' }}></div>
        </div>
      </div>

      <div className="snapshot-quick-actions">
        <button type="button" onClick={() => navigate('/student/profile/professional')}>Professional Profile</button>
        <button type="button" onClick={() => navigate('/student/job-portal/applications')}>My Applications</button>
      </div>
    </aside>
  );
}

// ========== Stat Card ==========
function StatCard({ icon, value, label, delay }) {
  const numRef = useCounter(value);
  return (
    <div className={`stat-card fade-in-up`} style={{ animationDelay: `${delay * 0.1}s` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-number" ref={numRef}>0</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StatGrid({ stats }) {
  return (
    <section className="dashboard-section">
      <div className="section-title-wrap">
        <h2>Overview</h2>
        <p>Your learning and career activity at a glance.</p>
      </div>
      <div className="stats-grid">
      {stats.map((stat, idx) => (
        <StatCard key={stat.label} {...stat} delay={idx + 1} />
      ))}
      </div>
    </section>
  );
}

// ========== Feature Card ==========
function FeatureCard({ icon, title, desc, label, path, accent, delay, navigate }) {
  return (
    <div
      className="feature-card fade-in-up"
      style={{ '--card-accent': accent, animationDelay: `${delay * 0.12}s` }}
    >
      <div className="feature-icon">{icon}</div>
      <div className="feature-title">{title}</div>
      <p className="feature-desc">{desc}</p>
      <button
        className="feature-btn"
        onClick={() => navigate(path)}
        aria-label={`Go to ${title}`}
      >
        {label} →
      </button>
    </div>
  );
}

function FeatureGrid({ features, navigate }) {
  return (
    <section className="dashboard-section">
      <div className="section-title-wrap">
        <h2>Explore UniBridge</h2>
        <p>Jump into the tools you use every day.</p>
      </div>
      <div className="features-grid">
      {features.map((feat, idx) => (
        <FeatureCard key={feat.title} {...feat} delay={idx + 1} navigate={navigate} />
      ))}
      </div>
    </section>
  );
}

// ========== Recent Activity Item ==========
function RecentItem({ icon, title, meta, navigate, path }) {
  return (
    <div className="recent-item" onClick={() => navigate(path)} role="button" tabIndex={0}>
      <div className="recent-icon">{icon}</div>
      <div className="recent-content">
        <h4>{title}</h4>
        <p>{meta}</p>
      </div>
      <span className="recent-arrow">›</span>
    </div>
  );
}

function RecentActivity({ activities, navigate }) {
  return (
    <section className="recent-section fade-in-up">
      <div className="recent-header">
        <h2>⚡ Recent Activity</h2>
        <span className="recent-badge">Live Feed</span>
      </div>
      <div className="recent-grid">
        {activities.map((item) => (
          <RecentItem key={item.title} {...item} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

// ========== Main Component ==========
const StudentHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stats = [
    { icon: '📚', value: 12, label: 'Materials Saved' },
    { icon: '🎓', value: 3, label: 'Kuppis Joined' },
    { icon: '🔖', value: 2, label: 'Saved Jobs' },
  ];

  const features = [
    {
      icon: '📚', title: 'Lecture Materials', accent: '#3b82f6',
      desc: 'Browse, upload, and share study notes, slides, and resources with your batch.',
      label: 'Explore Materials', path: '/student/materials',
    },
    {
      icon: '💼', title: 'Job Portal', accent: '#f59e0b',
      desc: 'Discover internships, graduate roles, and career opportunities curated for students.',
      label: 'Browse Jobs', path: '/student/job-portal',
    },
    {
      icon: '🎓', title: 'Kuppi Hub', accent: '#ec489a',
      desc: 'Organise or join peer study sessions. Collaborative learning, made easy.',
      label: 'Open Kuppi Hub', path: '/student/kuppi',
    },
    {
      icon: '🔖', title: 'Saved Jobs', accent: '#10b981',
      desc: 'Keep track of job opportunities you are interested in and apply later.',
      label: 'View Saved', path: '/student/job-portal/saved',
    },
  ];

  const recentActivity = [
    { icon: '📚', title: 'New material uploaded: CS3042 Lecture 7', meta: 'Yesterday · Lecture Materials', path: '/student/materials' },
    { icon: '🎓', title: 'Kuppi: Database Systems – Friday 6 PM', meta: '2 days ago · Kuppi Hub', path: '/student/kuppi' },
  ];

  return (
    <>
      <ParticleCanvas />
      <div className="student-dashboard">
        <div className="container">
          <div className="dashboard-top-grid">
            <Hero user={user} navigate={navigate} />
            <ProfileSnapshot user={user} navigate={navigate} />
          </div>
          <StatGrid stats={stats} />
          <FeatureGrid features={features} navigate={navigate} />
          <RecentActivity activities={recentActivity} navigate={navigate} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentHome;