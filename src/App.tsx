import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  Phone,
  CheckCircle2,
  Music2,
  ArrowUp,
  MessageSquare,
  Compass,
  MapPin,
} from 'lucide-react';

// --- Config ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyhAKH-8IQxdzTegL5_c8kNtG5cTdl5uffnQN1R8AdWp89A12NH0b0OBA9O15NGIcuC/exec";

// --- Utility ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', width: '100%', display: 'block' }}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 1, delay, ease: [0.19, 1, 0.22, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const MagneticElement = ({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 };
    setPosition({ x: (clientX - (left + width / 2)) * strength, y: (clientY - (top + height / 2)) * strength });
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: 'inline-flex' }}
    >
      {children}
    </motion.div>
  );
};

// --- Legal Modal ---
const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean; onClose: () => void; type: "terms" | "privacy" | "safety" }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const content = {
    terms: {
      title: "Terms & Conditions", date: "Effective Date: May 20, 2026",
      body: (<div className="modal-body"><h4>1. Agreement to Terms</h4><p>These Terms and Conditions constitute a legally binding agreement between you and <strong>Khozna</strong> concerning your access to and use of our website and mobile application.</p><h4>2. Intellectual Property Rights</h4><p>Unless otherwise indicated, the Site is our proprietary property and all content and marks are owned or controlled by us.</p><h4>3. Governing Law</h4><p>These Terms shall be governed by the laws of Nepal. Khozna and yourself consent that the courts of Nepal shall have exclusive jurisdiction.</p><h4>4. Contact Us</h4><p><strong>Khozna</strong><br />support@khozna.com<br />Phone: 9705278379<br />Dhapa-Khasibazar, Kirtipur, Nepal</p></div>)
    },
    privacy: {
      title: "Privacy Policy", date: "Effective Date: May 20, 2026",
      body: (<div className="modal-body"><h4>1. Introduction</h4><p>Welcome to <strong>Khozna</strong>. We are committed to protecting your personal information and your right to privacy.</p><h4>2. Information We Collect</h4><p>We collect personal information you voluntarily provide including names, phone numbers, email addresses, and location data.</p><h4>3. How We Use Your Information</h4><p>We use your information to facilitate account creation, send communications, fulfill orders, deliver targeted advertising, and protect our services.</p><h4>4. Contact Us</h4><p><strong>Khozna</strong><br />Phone: 9705278379<br />Dhapa-Khasibazar, Kirtipur, Nepal</p></div>)
    },
    safety: {
      title: "Safe Rental Guide", date: "Stay Secure",
      body: (<div className="modal-body"><ul><li>Meet property owners in person before any agreement.</li><li>Never send advance payments without verification.</li><li>Avoid deals that feel rushed or unrealistic.</li><li>Visit properties before confirming.</li></ul><div className="modal-report-box"><h4 className="modal-report-title">Report a Scammer</h4><p className="modal-report-text">Email: support@khozna.com<br />Phone: +977 9705278379</p></div><p className="modal-disclaimer">Disclaimer: Khozna is a technology platform, not a real estate agency. Users are solely responsible for their interactions.</p></div>)
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="modal-close" aria-label="Close modal">✕</button>
            <span className="modal-date">{content[type].date}</span>
            <h3 id="modal-title" className="modal-title">{content[type].title}</h3>
            {content[type].body}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Waitlist Modal (original floating modal) ---
const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'renter' | 'owner'>('renter');
  const [location, setLocation] = useState("Kathmandu");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, phone, email, role: role === 'renter' ? 'Renter' : 'Owner', location }),
      });
      setIsSubmitted(true);
      setStatus("idle");
      setTimeout(() => { setIsSubmitted(false); setName(""); setPhone(""); setEmail(""); onClose(); }, 5000);
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="waitlist-overlay" onClick={onClose} role="dialog" aria-modal="true">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="glass waitlist-card" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="modal-close" style={{ color: 'var(--text)' }} aria-label="Close modal">✕</button>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <div className="waitlist-success-icon"><CheckCircle2 color="white" size={32} /></div>
                <h3 className="waitlist-success-title">YOU'RE IN!</h3>
                <p className="waitlist-success-text">You are now officially on the Khozna early access list. Follow us for the launch date.</p>
                <div className="waitlist-social-row">
                  <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram"><Instagram size={18} /></a>
                  <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn"><Linkedin size={18} /></a>
                  <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook"><Facebook size={18} /></a>
                  <a href="https://www.tiktok.com/@khozna_" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="TikTok"><Music2 size={18} /></a>
                </div>
              </motion.div>
            ) : (
              <>
                <span className="waitlist-label">Early Access</span>
                <h3 className="waitlist-title">JOIN THE<br />WAITLIST.</h3>
                <p className="waitlist-desc">Enter your details to get early access to Nepal's #1 most trusted rental platform.</p>

                {/* Role Toggle */}
                <div className="role-toggle-bar" style={{ marginBottom: '1.5rem' }}>
                  <button type="button" onClick={() => setRole('renter')} className={`role-toggle-btn ${role === 'renter' ? 'active' : ''}`}>
                    🏠 Rent a Flat/Room
                  </button>
                  <button type="button" onClick={() => setRole('owner')} className={`role-toggle-btn ${role === 'owner' ? 'active' : ''}`}>
                    🔑 Property Owner
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="waitlist-form">
                  <input type="text" placeholder="Your Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="waitlist-input" aria-label="Full Name" />
                  <input type="tel" placeholder="WhatsApp Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="waitlist-input" aria-label="WhatsApp Number" />
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="waitlist-input" aria-label="Email Address" />
                  <div className="waitlist-select-wrapper">
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="waitlist-input location-select" style={{ appearance: 'none' }}>
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {status === "error" && <p className="waitlist-error">Something went wrong. Please try again.</p>}
                  <button type="submit" className="btn-primary waitlist-submit" disabled={status === "loading"}>
                    {status === "loading" ? "SUBMITTING..." : "JOIN WAITLIST"} <ArrowRight size={20} />
                  </button>
                  <div className="waitlist-secure">
                    <div className="status-dot" />
                    <span className="waitlist-secure-text">100% Secure & Trusted. No Spam.</span>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Navbar (original — no Admin Login) ---
const Navbar = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`glass-nav ${scrolled ? 'glass-nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo-link" aria-label="Khozna Home">
          <img src="/original_logo.png" className="nav-logo-img" alt="Khozna" />
          <span className="nav-wordmark">KHOZNA</span>
        </Link>
        <div className="nav-links">
          <a href="/#walkthrough" onClick={(e) => handleNavClick(e, "walkthrough")} className="nav-link">The Platform</a>
          <a href="/#contact" onClick={(e) => handleNavClick(e, "contact")} className="nav-link">Contact</a>
        </div>
        <div className="nav-actions">
          <button onClick={onJoinWaitlist} className="nav-btn-premium">JOIN WAITLIST</button>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-drawer-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className={`mobile-drawer ${menuOpen ? 'active' : ''}`} role="dialog" aria-modal="true">
        <div className="mobile-drawer-links">
          <a href="/#walkthrough" onClick={(e) => handleNavClick(e, "walkthrough")} className="mobile-drawer-link">The Platform</a>
          <a href="/#contact" onClick={(e) => handleNavClick(e, "contact")} className="mobile-drawer-link">Contact</a>
        </div>
        <button onClick={() => { setMenuOpen(false); onJoinWaitlist(); }} className="btn-primary mobile-drawer-cta">JOIN WAITLIST</button>
        <div className="mobile-drawer-socials">
          <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="social-btn"><Instagram size={18} /></a>
          <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="social-btn"><Linkedin size={18} /></a>
          <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="social-btn"><Facebook size={18} /></a>
        </div>
      </div>
    </>
  );
};

// --- Footer (original) ---
const Footer = ({ openLegal }: { openLegal: (type: "terms" | "privacy" | "safety") => void }) => (
  <footer id="contact" className="footer" role="contentinfo">
    <div className="container">
      <div className="footer-content">
        <div className="footer-brand">
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src="/original_logo.png" style={{ height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} alt="KHOZNA Icon" />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Khozna</span>
          </div>
          <h5 className="footer-tagline">#1 NEPAL'S TRUSTED RENTAL PLATFORM</h5>
          <p className="footer-description">FIND YOUR NEXT HOME.<br />NO MIDDLEMAN.</p>
        </div>
        <div className="footer-links-grid">
          <div className="footer-col">
            <span className="footer-col-title">Socials</span>
            <div className="footer-social-row">
              <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="footer-social-item"><div className="social-btn"><Instagram size={14} /></div> Instagram</a>
              <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="footer-social-item"><div className="social-btn"><Linkedin size={14} /></div> LinkedIn</a>
              <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="footer-social-item"><div className="social-btn"><Facebook size={14} /></div> Facebook</a>
              <a href="https://www.tiktok.com/@khozna_" target="_blank" rel="noopener noreferrer" className="footer-social-item"><div className="social-btn"><Music2 size={14} /></div> TikTok</a>
            </div>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Platform</span>
            <Link to="/" className="footer-link">Home</Link>
            <button onClick={() => openLegal("safety")} className="footer-link footer-btn">Safe Rental Guide</button>
            <button onClick={() => openLegal("privacy")} className="footer-link footer-btn">Privacy Policy</button>
            <button onClick={() => openLegal("terms")} className="footer-link footer-btn">Terms of Service</button>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Contact</span>
            <a href="https://wa.me/9705278379" target="_blank" rel="noopener noreferrer" className="footer-link footer-contact-link"><Phone size={16} /> 9705278379</a>
            <a href="mailto:support@khozna.com" className="footer-link footer-contact-link"><Mail size={16} /> support@khozna.com</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <div className="footer-warm"><p className="footer-copyright">© 2026 KHOZNA. Built with ❤️ in Nepal.</p></div>
        <div className="footer-location">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="footer-dot" /><span className="footer-location-text">NEPAL</span>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="back-to-top" aria-label="Scroll to top"><ArrowUp size={20} /></button>
        </div>
      </div>
    </div>
  </footer>
);

// --- App Walkthrough (original scroll-based) ---
const AppWalkthrough = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const screen1Scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const screen1Opacity = useTransform(scrollYProgress, [0.2, 0.25], [1, 0]);
  const screen2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  const screen2Y = useTransform(scrollYProgress, [0.25, 0.3], [100, 0]);
  const screen3Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.9, 1], [0, 1, 1, 1]);
  const screen3Y = useTransform(scrollYProgress, [0.55, 0.6], [100, 0]);

  return (
    <section id="walkthrough" ref={targetRef} className="walkthrough-container">
      <div className="walkthrough-sticky">
        <div className="walkthrough-grid">
          <div className="walkthrough-text-side">
            <motion.div className="walkthrough-step" style={{ opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]) }}>
              <span className="walkthrough-step-label walkthrough-step-label--blue">Step 01</span>
              <h2 className="section-title walkthrough-step-title">BROWSE.<br />SIMPLY.</h2>
              <p className="walkthrough-step-desc">Real listings from verified owners in Kathmandu, Pokhara, Lalitpur and beyond. No fake posts.</p>
            </motion.div>
            <motion.div className="walkthrough-step" style={{ opacity: useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]) }}>
              <span className="walkthrough-step-label walkthrough-step-label--green">Step 02</span>
              <h2 className="section-title walkthrough-step-title">MESSAGE.<br />DIRECT.</h2>
              <p className="walkthrough-step-desc">Talk to the owner in-app. No broker in the middle, no commission taken, no nonsense.</p>
            </motion.div>
            <motion.div className="walkthrough-step" style={{ opacity: useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 1]) }}>
              <span className="walkthrough-step-label walkthrough-step-label--amber">Step 03</span>
              <h2 className="section-title walkthrough-step-title">VERIFIED.<br />TRUSTED.</h2>
              <p className="walkthrough-step-desc">Every owner is KYC verified, every listing is manually reviewed. Real people, real homes — zero scams.</p>
            </motion.div>
          </div>
          <div className="walkthrough-phone-area">
            <motion.div className="phone-mockup" style={{ scale: screen1Scale }}>
              <motion.img loading="lazy" src="/new Home.jpeg" className="phone-screen" style={{ opacity: screen1Opacity }} alt="Search Screen" />
              <motion.img loading="lazy" src="/New message.jpeg" className="phone-screen phone-screen--stacked" style={{ opacity: screen2Opacity, y: screen2Y }} alt="Message Screen" />
              <motion.img loading="lazy" src="/New Kyc.jpeg" className="phone-screen phone-screen--stacked" style={{ opacity: screen3Opacity, y: screen3Y }} alt="Verification Screen" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- App Showcase (original tilt card) ---
const AppShowcase = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRotate({ x: ((e.clientY - rect.top) / rect.height - 0.5) * 20, y: ((e.clientX - rect.left) / rect.width - 0.5) * -20 });
  };
  return (
    <section id="app" className="section-showcase">
      <div className="container">
        <div onMouseMove={handleMouseMove} onMouseLeave={() => setRotate({ x: 0, y: 0 })} className="glass showcase-card" style={{ transition: 'transform 0.1s ease-out' }}>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <img src="/icon-phone.png" alt="" className="icon-3d showcase-icon" loading="lazy" />
              <Reveal><h2 className="showcase-title">YOUR NEXT HOME.<br />IS ONE TAP AWAY.</h2></Reveal>
              <p className="showcase-desc">Khozna is launching soon. Browse real listings, message owners directly, and move in — without a single broker.</p>
              <div className="store-badges">
                <div className="glass store-badge">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" loading="lazy" />
                </div>
              </div>
            </div>
            <motion.div className="emotion-slider-mobile" style={{ rotateX: rotate.x, rotateY: rotate.y }} transition={{ type: "spring", stiffness: 100, damping: 30 }}>
              <div className="emotion-card emotion-card--left">
                <img loading="lazy" src="/man.png" alt="Verified Owner" className="emotion-image" />
                <div className="emotion-label"><div className="emotion-dot emotion-dot--success" /><span className="emotion-text">Verified Owner</span></div>
              </div>
              <div className="emotion-card emotion-card--right">
                <img loading="lazy" src="/boy.png" alt="Happy Guest" className="emotion-image" />
                <div className="emotion-label"><div className="emotion-dot emotion-dot--primary" /><span className="emotion-text">Happy Guest</span></div>
              </div>
            </motion.div>
          </div>
          <div className="showcase-glow" />
        </div>
      </div>
    </section>
  );
};

// --- Video Tours Showcase ---
const VideoToursShowcase = () => {
  const [activeMedia, setActiveMedia] = useState<'photos' | 'videos'>('videos');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} style={{ padding: '8rem 0', background: 'var(--surface)' }}>
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center', gap: '5rem' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <span className="section-label">Feature 01</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>SWIPE<br />VIDEO TOURS</h2>
            <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Walk through verified flats without leaving your sofa. Toggle between professional photos and real owner-uploaded video walkthroughs.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {["High-quality video tours from verified landlords", "Filter spaces before scheduling in-person visits", "Tap CHAT to message the owner directly in-app"].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="iphone-showcase">
              <div className="iphone-notch" />
              <div className="iphone-inner">
                <div className="media-toggle-container">
                  <button onClick={() => setActiveMedia('photos')} className={`media-toggle-btn ${activeMedia === 'photos' ? 'active' : ''}`}>Photos</button>
                  <button onClick={() => setActiveMedia('videos')} className={`media-toggle-btn ${activeMedia === 'videos' ? 'active' : ''}`}>Videos</button>
                </div>
                {activeMedia === 'videos' ? (
                  <video autoPlay muted loop playsInline className="iphone-video">
                    <source src="/view%20of%20ktm.mp4" type="video/mp4" />
                  </video>
                ) : (
                  <img src="/Home screen.jpeg" alt="Property Photos" className="iphone-image-static" />
                )}
                <div className="video-card-overlay">
                  <div className="dark-glassmorphic-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="dark-glass-price">Rs. 25,000/mo</span>
                        <div className="dark-glass-location">Jhamsikhel, Lalitpur</div>
                      </div>
                      <span style={{ fontSize: '0.65rem', background: 'var(--success)', color: 'white', padding: '3px 10px', borderRadius: '10px', fontWeight: '800' }}>VERIFIED</span>
                    </div>
                    <div className="dark-glass-actions">
                      <button className="action-pill-btn action-pill-chat"><MessageSquare size={13} /><span>CHAT</span></button>
                      <button className="action-pill-btn action-pill-visit"><Compass size={13} /><span>VISIT</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Map Discovery Showcase ---
const MapDiscoveryShowcase = () => {
  const [activeMarker, setActiveMarker] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const markers = [
    { id: 1, label: "Rs 15K", top: "20%", left: "45%", name: "Baluwatar Flat", price: "Rs. 15,000/mo", loc: "Baluwatar, Kathmandu", img: "/tour.jpeg", desc: "Compact 1BHK, 24h water, direct road access." },
    { id: 2, label: "Rs 28K", top: "55%", left: "15%", name: "Jhamsikhel Duplex", price: "Rs. 28,000/mo", loc: "Jhamsikhel, Lalitpur", img: "/Home screen.jpeg", desc: "Beautiful 2BHK with balcony and city views." },
    { id: 3, label: "Rs 18K", bottom: "22%", left: "52%", name: "Baneshwor Studio", price: "Rs. 18,000/mo", loc: "Baneshwor, Kathmandu", img: "/chat setion screen.jpeg", desc: "Large studio with roof terrace access." },
    { id: 4, label: "Rs 9K",  top: "15%", right: "12%", name: "Compact Room", price: "Rs. 9,000/mo", loc: "Suryabinayak, Bhaktapur", img: "/tour.jpeg", desc: "Private room with attached bath." },
    { id: 5, label: "Rs 35K", bottom: "40%", right: "15%", name: "Lakeside Penthouse", price: "Rs. 35,000/mo", loc: "Lakeside, Pokhara", img: "/profile section.jpeg", desc: "Luxurious penthouse with lake views." },
  ];

  const selected = markers.find(m => m.id === activeMarker) || markers[0];

  return (
    <section ref={ref} style={{ padding: '8rem 0', background: 'var(--bg)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '4rem' }}>
          <span className="section-label">Feature 02</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>DISCOVERY<br />MAP SEARCH</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '500px', lineHeight: '1.8' }}>
            Tap price markers on the map to instantly preview verified properties. Real GPS coordinates, real landlords.
          </p>
        </motion.div>

        <div className="map-showcase-container">
          <div className="map-wrapper">
            <div className="map-canvas">
              <div className="map-river" />
              <div className="map-road-h map-road-h--1" /><div className="map-road-h map-road-h--2" />
              <div className="map-road-v map-road-v--1" /><div className="map-road-v map-road-v--2" />
              <div className="map-greenery map-greenery--1" /><div className="map-greenery map-greenery--2" />
              {markers.map(m => (
                <button key={m.id} onClick={() => setActiveMarker(m.id)}
                  className={`map-marker ${activeMarker === m.id ? 'active' : ''}`}
                  style={{ top: m.top, left: m.left, bottom: (m as any).bottom, right: (m as any).right }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="map-info-side">
            <AnimatePresence mode="wait">
              <motion.div key={selected.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="map-property-card-view">
                <div className="verified-badge"><CheckCircle2 size={12} color="var(--primary)" /><span>VERIFIED Landlord</span></div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0.75rem 0 0.25rem', color: 'var(--text)' }}>{selected.name}</h4>
                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem' }}>{selected.price}</p>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>{selected.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <MapPin size={13} color="var(--primary)" /><span>{selected.loc}</span>
                </div>
                <img src={selected.img} alt={selected.name} className="map-card-image" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};



// --- Home Page ---
const HomePage = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => (
  <main role="main">
    {/* Original Hero */}
    <section className="hero-section">
      <div className="hero-video-wrapper">
        <video autoPlay muted loop playsInline preload="auto" className="hero-video">
          <source src="/view%20of%20ktm.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-line hero-line--white"><Reveal>FIND YOUR NEXT HOME.</Reveal></span>
          <span className="hero-line"><Reveal delay={0.1}><span className="text-gradient">NO MIDDLEMAN.</span></Reveal></span>
        </h1>
        <Reveal delay={0.2}>
          <p className="hero-subtitle">The modern, video-first rental platform for Nepal. Discover verified flats, rooms, and apartments in Kathmandu, Lalitpur, & Pokhara with zero agent fee.</p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="hero-buttons">
            <MagneticElement><button onClick={onJoinWaitlist} className="btn-primary hero-cta">JOIN WAITLIST <ArrowRight size={20} /></button></MagneticElement>
          </div>
        </Reveal>
      </div>
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="scroll-indicator">
        <div className="scroll-mouse"><motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="scroll-dot" /></div>
      </motion.div>
    </section>

    {/* Marquee */}
    <div className="marquee-container" aria-hidden="true">
      <div className="marquee-track">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <React.Fragment key={i}>
            <span>NO SCAMS</span><span className="marquee-dot">●</span>
            <span>FREE FOR EVERYONE</span><span className="marquee-dot">●</span>
            <span>VERIFIED LISTINGS</span><span className="marquee-dot">●</span>
            <span>BROKER-FREE</span><span className="marquee-dot">●</span>
            <span>REAL HOMES</span><span className="marquee-dot">●</span>
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Original sections */}
    <AppWalkthrough />
    <AppShowcase />

    {/* New Feature Showcases */}
    <VideoToursShowcase />
    <MapDiscoveryShowcase />
  </main>
);

// --- Top Progress Bar ---
const TopProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="top-progress-bar" style={{ scaleX }} />;
};

// --- Page Transition ---
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}>
    {children}
  </motion.div>
);

// --- App ---
function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean; type: "terms" | "privacy" | "safety" }>({ open: false, type: "terms" });
  const openLegal = (type: "terms" | "privacy" | "safety") => setLegalModal({ open: true, type });

  return (
    <Router>
      <ScrollToTop />
      <TopProgressBar />
      <div style={{ position: 'relative', background: 'var(--bg)' }}>
        <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
        <LegalModal isOpen={legalModal.open} type={legalModal.type} onClose={() => setLegalModal({ ...legalModal, open: false })} />
        <Navbar onJoinWaitlist={() => setIsWaitlistOpen(true)} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><HomePage onJoinWaitlist={() => setIsWaitlistOpen(true)} /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        <Footer openLegal={openLegal} />
      </div>
    </Router>
  );
}

export default App;
