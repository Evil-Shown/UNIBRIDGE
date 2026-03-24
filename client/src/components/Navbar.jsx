import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect for navbar background
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`navbar-marvel ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link
                    to={user ? (user.role === 'student' ? '/student/home' : '/employer/dashboard') : '/'}
                    className="navbar-logo"
                >
                    <span className="logo-icon">🎓</span>
                    <span className="logo-text">UniBridge</span>
                </Link>

                <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
                    {!user ? (
                        <>
                            <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
                                Home
                            </Link>
                            <Link to="/about" className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}>
                                About
                            </Link>
                            <Link to="/contact" className={`navbar-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                                Contact
                            </Link>
                            <div className="navbar-divider"></div>
                            <Link to="/login" className="navbar-link">Log in</Link>
                            <Link to="/register" className="navbar-btn">Sign up</Link>
                        </>
                    ) : (
                        <>
                            {user.role === 'student' ? (
                                <>
                                    <Link to="/student/home" className="navbar-link">Home</Link>
                                    <Link to="/student/materials" className="navbar-link">Materials</Link>
                                    <Link to="/student/materials/upload" className="navbar-link">Upload</Link>
                                    <Link to="/student/jobs" className="navbar-link">Jobs</Link>
                                    <Link to="/student/applications" className="navbar-link">My Applications</Link>
                                    <Link to="/student/kuppi" className="navbar-link">Kuppi</Link>
                                    <div className="navbar-notification">
                                        🔔
                                        <span className="notification-badge">3</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/employer/dashboard" className="navbar-link">Dashboard</Link>
                                    <Link to="/employer/jobs/create" className="navbar-link">Post Job</Link>
                                </>
                            )}
                            <button onClick={logout} className="navbar-outline-btn navbar-btn">Logout</button>
                        </>
                    )}
                </div>

                <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;