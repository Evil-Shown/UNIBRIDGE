import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // Marvel-inspired particle animation
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const numberOfParticles = 150;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.5 + 0.2,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                });
            }
        };

        const drawParticles = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`; // Gold sparks
                ctx.fill();
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });
            animationFrameId = requestAnimationFrame(drawParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Mouse move parallax effect for hero elements
    const handleMouseMove = (e) => {
        const hero = document.querySelector('.advanced-hero');
        if (!hero) return;
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth) * 20 - 10;
        const y = (clientY / window.innerHeight) * 20 - 10;
        hero.style.transform = `perspective(1000px) rotateY(${x * 0.05}deg) rotateX(${y * -0.05}deg)`;
    };

    // Intersection Observer for stats counters
    useEffect(() => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const updateCount = () => {
                            const targetValue = parseInt(target.getAttribute('data-target'));
                            const currentValue = parseInt(target.innerText);
                            const increment = targetValue / speed;
                            if (currentValue < targetValue) {
                                target.innerText = Math.ceil(currentValue + increment);
                                setTimeout(updateCount, 10);
                            } else {
                                target.innerText = targetValue;
                            }
                        };
                        updateCount();
                        observer.unobserve(target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach((counter) => observer.observe(counter));
    }, []);

    return (
        <>
            <canvas ref={canvasRef} className="hero-canvas" />
            <div className="hero-section advanced-hero" onMouseMove={handleMouseMove}>
                <div className="container">
                    <div className="fade-in-up">
                        <div className="badge badge-open marvel-badge">
                            <span role="img" aria-label="spark">⚡</span> THE ULTIMATE UNIVERSITY PLATFORM
                        </div>
                        <h1 className="hero-title marvel-title">
                            <span className="marvel-gradient">Empower</span> Your<br />
                            <span className="marvel-gradient">University Journey</span>
                        </h1>
                        <p className="hero-subtitle marvel-subtitle">
                            UniBridge gives you superpowers: share materials, explore jobs, join study squads, and more.
                        </p>
                        <div className="marvel-btn-row">
                            <button className="btn btn-primary marvel-btn" onClick={() => navigate('/register')}>
                                🚀 Get Started Free
                            </button>
                            <button className="btn btn-outline marvel-btn" onClick={() => navigate('/about')}>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container marvel-features">
                <div className="fade-in-up delay-1 marvel-features-header">
                    <h2 className="marvel-section-title">Why Choose <span className="marvel-gradient">UniBridge?</span></h2>
                    <p className="marvel-section-desc">Everything you need to succeed – all in one heroic platform.</p>
                </div>
                <div className="feature-grid fade-in-up delay-2">
                    <div className="feature-card marvel-feature-card">
                        <div className="feature-icon marvel-feature-icon">📚</div>
                        <h3 className="feature-title marvel-feature-title">Lecture Materials</h3>
                        <p className="feature-text marvel-feature-text">Upload & share notes, PDFs, videos. Collaborate with peers effortlessly.</p>
                    </div>
                    <div className="feature-card marvel-feature-card">
                        <div className="feature-icon marvel-feature-icon">💼</div>
                        <h3 className="feature-title marvel-feature-title">Career Opportunities</h3>
                        <p className="feature-text marvel-feature-text">Find internships & jobs tailored for you. Apply with one click.</p>
                    </div>
                    <div className="feature-card marvel-feature-card">
                        <div className="feature-icon marvel-feature-icon">🎓</div>
                        <h3 className="feature-title marvel-feature-title">Peer Study Hub</h3>
                        <p className="feature-text marvel-feature-text">Create or join 'Kuppi' sessions. Prepare for exams together.</p>
                    </div>
                </div>

                {/* New Statistics Section */}
                <div className="stats-section fade-in-up delay-3">
                    <div className="stat-item">
                        <div className="stat-number" data-target="5000">0</div>
                        <div className="stat-label">Active Students</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number" data-target="1200">0</div>
                        <div className="stat-label">Materials Shared</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number" data-target="350">0</div>
                        <div className="stat-label">Job Listings</div>
                    </div>
                </div>

                <div className="cta-section fade-in-up delay-3 marvel-cta">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 className="marvel-cta-title">Ready to bridge the gap?</h2>
                        <p className="marvel-cta-desc">Join completely free and start exploring resources and opportunities today.</p>
                        <button className="btn marvel-btn" onClick={() => navigate('/register')}>
                            Create an Account
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;