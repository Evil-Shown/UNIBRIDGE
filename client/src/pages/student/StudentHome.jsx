import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaBook, FaBriefcase, FaFileAlt, FaUsers, 
  FaChartLine, FaCalendarAlt, FaBell, FaRocket 
} from 'react-icons/fa';
import { RiBarChart2Line, RiAwardLine } from 'react-icons/ri';
import './StudentHome.css';

const StudentHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [stats, setStats] = useState({
        materials: 0,
        applications: 0,
        kuppiSessions: 0
    });

    // Animated stats (mock data – replace with API later)
    useEffect(() => {
        const targetStats = { materials: 24, applications: 5, kuppiSessions: 3 };
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep >= steps) {
                setStats(targetStats);
                clearInterval(interval);
                return;
            }
            currentStep++;
            setStats({
                materials: Math.min(targetStats.materials, Math.floor(targetStats.materials * (currentStep / steps))),
                applications: Math.min(targetStats.applications, Math.floor(targetStats.applications * (currentStep / steps))),
                kuppiSessions: Math.min(targetStats.kuppiSessions, Math.floor(targetStats.kuppiSessions * (currentStep / steps))),
            });
        }, stepTime);

        return () => clearInterval(interval);
    }, []);

    // Canvas background (subtle blue particles)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = 80;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.3 + 0.1,
                    speedX: (Math.random() - 0.5) * 0.2,
                    speedY: (Math.random() - 0.5) * 0.2,
                });
            }
        };

        const drawParticles = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
                ctx.fill();
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });
            animationId = requestAnimationFrame(drawParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const features = [
        { icon: FaBook, title: 'Lecture Materials', desc: 'Browse, upload, and share notes, PDFs, and videos.', path: '/student/materials', color: '#3b82f6' },
        { icon: FaBriefcase, title: 'Job Board', desc: 'Find internships and jobs tailored for you.', path: '/student/jobs', color: '#f59e0b' },
        { icon: FaFileAlt, title: 'My Applications', desc: 'Track your job application status.', path: '/student/applications', color: '#10b981' },
        { icon: FaUsers, title: 'Kuppi Hub', desc: 'Join or create peer study sessions.', path: '/student/kuppi', color: '#ef4444' },
    ];

    const recentUpdates = [
        { icon: FaCalendarAlt, title: 'Career Fair 2026', desc: 'Join virtual career fair next week. Register now!', tag: 'New' },
        { icon: FaBook, title: 'New Materials Uploaded', desc: '5 new resources added to Computer Science section.', tag: 'Updated' },
        { icon: FaBell, title: 'Application Deadline', desc: 'Software Engineer internship closes in 3 days.', tag: 'Urgent' },
    ];

    return (
        <>
            <canvas ref={canvasRef} className="student-canvas" />
            <div className="student-dashboard">
                <div className="container">
                    {/* Hero Section */}
                    <div className="dashboard-hero fade-in-up">
                        <div className="hero-badge">
                            <RiBarChart2Line style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                            STUDENT DASHBOARD
                        </div>
                        <h1 className="hero-title">
                            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>!
                        </h1>
                        <p className="hero-subtitle">
                            Ready to level up your university journey? Here's your command center.
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="stats-grid fade-in-up delay-1">
                        <div className="stat-card">
                            <div className="stat-icon"><FaBook /></div>
                            <div className="stat-number">{stats.materials}</div>
                            <div className="stat-label">Materials Accessed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaFileAlt /></div>
                            <div className="stat-number">{stats.applications}</div>
                            <div className="stat-label">Applications Sent</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><FaUsers /></div>
                            <div className="stat-number">{stats.kuppiSessions}</div>
                            <div className="stat-label">Kuppi Sessions</div>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="features-grid fade-in-up delay-2">
                        {features.map((feature, idx) => {
                            const IconComponent = feature.icon;
                            return (
                                <div key={idx} className="feature-card" style={{ '--card-accent': feature.color }}>
                                    <div className="feature-icon"><IconComponent /></div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-desc">{feature.desc}</p>
                                    <button 
                                        className="feature-btn"
                                        onClick={() => navigate(feature.path)}
                                    >
                                        Explore →
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recent Updates */}
                    <div className="recent-section fade-in-up delay-3">
                        <div className="recent-header">
                            <h2>Recent Updates</h2>
                            <span className="recent-badge">New</span>
                        </div>
                        <div className="recent-grid">
                            {recentUpdates.map((update, idx) => {
                                const IconComponent = update.icon;
                                return (
                                    <div key={idx} className="recent-item">
                                        <div className="recent-icon"><IconComponent /></div>
                                        <div className="recent-content">
                                            <h4>{update.title} <span className="update-tag">{update.tag}</span></h4>
                                            <p>{update.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentHome;