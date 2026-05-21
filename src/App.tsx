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
  ArrowLeft,
  Music2,
  ArrowUp
} from 'lucide-react';

// --- Configuration ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyhAKH-8IQxdzTegL5_c8kNtG5cTdl5uffnQN1R8AdWp89A12NH0b0OBA9O15NGIcuC/exec";

// --- Utility Components ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
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

const MagneticElement = ({ children, strength = 0.3 }: { children: React.ReactNode, strength?: number }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 };
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: 'inline-flex' }}
    >
      {children}
    </motion.div>
  );
};

// --- Modals ---
const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: "terms" | "privacy" | "safety" }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const content = {
    terms: {
      title: "Terms & Conditions",
      date: "Effective Date: May 20, 2026",
      body: (
        <div className="modal-body">
          <h4>1. Agreement to Terms</h4>
          <p>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and <strong>Khozna</strong> ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>
          <p>You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.</p>
          
          <h4>2. Intellectual Property Rights</h4>
          <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.</p>
          
          <h4>3. User Representations</h4>
          <p>By using the Site, you represent and warrant that:<br/>(1) all registration information you submit will be true, accurate, current, and complete;<br/>(2) you will maintain the accuracy of such information and promptly update such registration information as necessary;<br/>(3) you have the legal capacity and you agree to comply with these Terms and Conditions;<br/>(4) you are not a minor in the jurisdiction in which you reside;<br/>(5) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise;<br/>(6) you will not use the Site for any illegal or unauthorized purpose; and<br/>(7) your use of the Site will not violate any applicable law or regulation.</p>
          
          <h4>4. User Registration</h4>
          <p>You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
          
          <h4>5. Prohibited Activities</h4>
          <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          
          <h4>6. Modifications and Interruptions</h4>
          <p>We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.</p>
          
          <h4>7. Governing Law</h4>
          <p>These Terms shall be governed by and defined following the laws of Nepal. <strong>Khozna</strong> and yourself irrevocably consent that the courts of Nepal shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>
          
          <h4>8. Dispute Resolution</h4>
          <p>Any dispute arising out of or in connection with this contract, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration.</p>
          
          <h4>9. Contact Us</h4>
          <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
          <p><strong>Khozna</strong><br/>support@khozna.com<br/>Phone: 9705278379<br/>Dhapa-Khasibazar, Kirtipur, Nepal</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      date: "Effective Date: May 20, 2026",
      body: (
        <div className="modal-body">
          <h4>1. Introduction</h4>
          <p>Welcome to <strong>Khozna</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or use any of our services.</p>
          
          <h4>2. Information We Collect</h4>
          <p>We may collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect can include the following:</p>
          <ul>
            <li><strong>Personal Info Provided by You:</strong> Names; phone numbers; email addresses; mailing addresses; usernames; passwords; contact preferences; billing addresses; debit/credit card numbers; and other similar information.</li>
            <li><strong>Automatically Collected Info:</strong> We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services and other technical information.</li>
          </ul>

          <h4>3. How We Use Your Information</h4>
          <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <p>We use the information we collect or receive:</p>
          <ul>
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To fulfill and manage your orders.</li>
            <li>To deliver targeted advertising to you.</li>
            <li>To request feedback and to contact you about your use of our Services.</li>
            <li>To protect our Services.</li>
          </ul>

          <h4>4. Will Your Information be Shared with Anyone?</h4>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h4>5. How Long Do We Keep Your Information?</h4>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.</p>

          <h4>6. Do We Collect Information from Minors?</h4>
          <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services.</p>

          <h4>7. Your Privacy Rights</h4>
          <p>In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>

          <h4>8. Updates to This Notice</h4>
          <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>

          <h4>9. Contact Us</h4>
          <p>If you have questions or comments about this notice, you may email us at support@khozna.com or by post to:</p>
          <p><strong>Khozna</strong><br/>Phone: 9705278379<br/>Dhapa-Khasibazar, Kirtipur<br/>Bagmati Province<br/>Nepal</p>
        </div>
      )
    },
    safety: {
      title: "Safe Rental Guide",
      date: "Stay Secure",
      body: (
        <div className="modal-body">
          <ul>
            <li>Meet property owners in person before any agreement.</li>
            <li>Never send advance payments without verification.</li>
            <li>Avoid deals that feel rushed or unrealistic.</li>
            <li>Visit properties before confirming.</li>
          </ul>
          <div className="modal-report-box">
            <h4 className="modal-report-title">Report a Scammer</h4>
            <p className="modal-report-text">Email: support@khozna.com<br />Phone: +977 9705278379</p>
          </div>
          <p className="modal-disclaimer">Disclaimer: Khozna is a technology platform, not a real estate agency. Users are solely responsible for their interactions.</p>
        </div>
      )
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
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

const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, phone, email }),
      });

      setIsSubmitted(true);
      setStatus("idle");
      setTimeout(() => {
        setIsSubmitted(false);
        setName("");
        setPhone("");
        setEmail("");
        onClose();
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="waitlist-overlay"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="glass waitlist-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="modal-close" style={{ color: 'var(--text)' }} aria-label="Close modal">✕</button>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <div className="waitlist-success-icon">
                  <CheckCircle2 color="white" size={32} />
                </div>
                <h3 className="waitlist-success-title">USER VERIFIED</h3>
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
                <span className="waitlist-label">Identity Verification</span>
                <h3 className="waitlist-title">JOIN THE<br />ECOSYSTEM.</h3>
                <p className="waitlist-desc">Enter your details to get verified for early access to Nepal's #1 most trusted rental platform.</p>
                <form onSubmit={handleSubmit} className="waitlist-form">
                  <input type="text" placeholder="Your Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="waitlist-input" aria-label="Full Name" />
                  <input type="tel" placeholder="WhatsApp Number" required value={phone} onChange={(e) => setPhone(e.target.value)} className="waitlist-input" aria-label="WhatsApp Number" />
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="waitlist-input" aria-label="Email Address" />
                  {status === "error" && <p className="waitlist-error">Something went wrong. Please try again.</p>}
                  <button type="submit" className="btn-primary waitlist-submit" disabled={status === "loading"}>
                    {status === "loading" ? "VERIFYING..." : "VERIFY & JOIN"} <ArrowRight size={20} />
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

// --- Shared Layout Components ---
const Navbar = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className={`glass-nav ${scrolled ? 'glass-nav--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-logo-link" aria-label="Khozna Home">
          <div className="logo-box">
            <img src="/original_logo.png" className="nav-logo-img" alt="" />
            <span className="logo-text">KHOZNA</span>
          </div>
        </Link>
        <div className="nav-links">
          <a href="/#walkthrough" onClick={(e) => handleNavClick(e, "walkthrough")} className="nav-link">The Platform</a>
          <Link to="/vision" className="nav-link">Vision</Link>
          <a href="/#contact" onClick={(e) => handleNavClick(e, "contact")} className="nav-link">Contact</a>
        </div>
        <div className="nav-actions">
          <button onClick={onJoinWaitlist} className="nav-btn-premium">DOWNLOAD APP</button>
          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className={`mobile-drawer ${menuOpen ? 'active' : ''}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <div className="mobile-drawer-links">
          <a href="/#walkthrough" onClick={(e) => handleNavClick(e, "walkthrough")} className="mobile-drawer-link">The Platform</a>
          <Link to="/vision" onClick={() => setMenuOpen(false)} className="mobile-drawer-link">Vision</Link>
          <a href="/#contact" onClick={(e) => handleNavClick(e, "contact")} className="mobile-drawer-link">Contact</a>
        </div>
        <button onClick={() => { setMenuOpen(false); onJoinWaitlist(); }} className="btn-primary mobile-drawer-cta">DOWNLOAD APP</button>
        <div className="mobile-drawer-socials">
          <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook"><Facebook size={18} /></a>
        </div>
      </div>
    </>
  );
};

const Footer = ({ openLegal }: { openLegal: (type: "terms" | "privacy" | "safety") => void }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-box" style={{ marginBottom: '1.5rem' }}>
              <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
              <span className="logo-text" style={{ color: 'white' }}>KHOZNA</span>
            </div>
            <h5 className="footer-tagline">#1 NEPAL'S TRUSTED RENTAL PLATFORM</h5>
            <p className="footer-description">FIND YOUR NEXT HOME.<br />NO MIDDLEMAN.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <span className="footer-col-title">Socials</span>
              <div className="footer-social-row">
                <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="footer-social-item">
                  <div className="social-btn"><Instagram size={14} /></div> Instagram
                </a>
                <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="footer-social-item">
                  <div className="social-btn"><Linkedin size={14} /></div> LinkedIn
                </a>
                <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="footer-social-item">
                  <div className="social-btn"><Facebook size={14} /></div> Facebook
                </a>
                <a href="https://www.tiktok.com/@khozna_" target="_blank" rel="noopener noreferrer" className="footer-social-item">
                  <div className="social-btn"><Music2 size={14} /></div> TikTok
                </a>
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
          <div className="footer-warm">
            <p className="footer-copyright">© 2026 KHOZNA. Built with ❤️ in Kathmandu, Nepal.</p>
          </div>
          <div className="footer-location">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="footer-dot" />
              <span className="footer-location-text">KATHMANDU, NEPAL</span>
            </div>
            <button onClick={scrollToTop} className="back-to-top" aria-label="Scroll to top">
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Components ---
const HomePage = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  return (
    <main role="main">
      <section className="hero-section">
        <div className="hero-video-wrapper">
          <video autoPlay muted loop playsInline preload="auto" className="hero-video">
            <source src="/view%20of%20ktm.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-line hero-line--white"><Reveal>#1 NEPAL'S TRUSTED</Reveal></span>
            <span className="hero-line"><Reveal delay={0.1}><span className="text-gradient">RENTAL PLATFORM.</span></Reveal></span>
          </h1>
          <Reveal delay={0.2}>
            <p className="hero-subtitle">Find your next home directly from verified owners in Nepal. No brokers, no middlemen. 100% free.</p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="hero-buttons">
              <MagneticElement><button onClick={onJoinWaitlist} className="btn-primary hero-cta">DOWNLOAD APP <ArrowRight size={20} /></button></MagneticElement>
              <Link to="/vision" className="btn-outline hero-btn-outline">The Vision</Link>
            </div>
          </Reveal>
        </div>
        
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="scroll-indicator">
          <div className="scroll-mouse">
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="scroll-dot" />
          </div>
        </motion.div>
      </section>

      <div className="marquee-container" aria-hidden="true">
        <div className="marquee-track">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <React.Fragment key={i}>
              <span>NO SCAMS</span>
              <span className="marquee-dot">●</span>
              <span>FREE FOR EVERYONE</span>
              <span className="marquee-dot">●</span>
              <span>VERIFIED LISTINGS</span>
              <span className="marquee-dot">●</span>
              <span>BROKER-FREE</span>
              <span className="marquee-dot">●</span>
              <span>REAL HOMES</span>
              <span className="marquee-dot">●</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <AppWalkthrough />
      <AppShowcase />

      <section className="section-features">
        <div className="container">
          <div className="section-header">
            <Reveal><h2 className="section-title section-title--large">THE NEW WAY<br />TO RENT.</h2></Reveal>
          </div>
          <div className="grid-3 features-container">
            <div className="glass feature-card" data-number="01">
              <img src="/icon-free.png" alt="" className="icon-3d" loading="lazy" />
              <h3 className="feature-card-title">Free for Everyone</h3>
              <p className="feature-card-desc">Khozna is 100% free — for Owners and Guests alike. Always.</p>
            </div>
            <div className="glass feature-card default-active" data-number="02">
              <img src="/icon-chat.png" alt="" className="icon-3d" loading="lazy" />
              <h3 className="feature-card-title">Direct Message</h3>
              <p className="feature-card-desc">Message the Owner directly inside our app and close the deal faster.</p>
            </div>
            <div className="glass feature-card" data-number="03">
              <img src="/icon-verified.png" alt="" className="icon-3d" loading="lazy" />
              <h3 className="feature-card-title">100% Verified</h3>
              <p className="feature-card-desc">We manually check every house. If it's on Khozna, it's real and safe.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-cta">
        <div className="container">
          <Reveal>
            <h2 className="section-title section-title--cta">
              <span className="text-gradient">JOIN THE</span><br />FUTURE.
            </h2>
          </Reveal>
          <p className="cta-desc">We're not just building an app. We're building the future of how people live and connect in Nepal.</p>
          <div className="cta-social-proof">
            <div className="cta-social-proof-dot" />
            Join 2,000+ Nepalis on the waitlist
          </div>
          <div className="cta-logo-wrapper">
            <img src="/original_logo.png" className="cta-logo" alt="KHOZNA Quality Stamp" loading="lazy" />
          </div>
        </div>
        <div className="cta-glow" />
      </section>
    </main>
  );
};

const AppShowcase = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    setRotate({ x: x * 20, y: y * -20 });
  };

  return (
    <section id="app" className="section-showcase">
      <div className="container">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotate({ x: 0, y: 0 })}
          className="glass showcase-card"
          style={{ transition: 'transform 0.1s ease-out' }}
        >
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <img src="/icon-phone.png" alt="" className="icon-3d showcase-icon" loading="lazy" />
              <Reveal>
                <h2 className="showcase-title">
                  THE FUTURE <br /> IN YOUR POCKET.
                </h2>
              </Reveal>
              <p className="showcase-desc">
                The Khozna app is coming soon to change how you live. Simple, fast, and secure.
              </p>

              <div className="store-badges">
                <div className="glass store-badge">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" loading="lazy" />
                </div>
              </div>
            </div>

            <motion.div
              className="emotion-slider-mobile"
              style={{ rotateX: rotate.x, rotateY: rotate.y }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
            >
              <div className="emotion-card emotion-card--left">
                <img loading="lazy" src="/man.png" alt="Verified Owner" className="emotion-image" />
                <div className="emotion-label">
                  <div className="emotion-dot emotion-dot--success" />
                  <span className="emotion-text">Verified Owner</span>
                </div>
              </div>
              <div className="emotion-card emotion-card--right">
                <img loading="lazy" src="/boy.png" alt="Happy Guest" className="emotion-image" />
                <div className="emotion-label">
                  <div className="emotion-dot emotion-dot--primary" />
                  <span className="emotion-text">Happy Guest</span>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="showcase-glow" />
        </div>
      </div>
    </section>
  );
};

const VisionPage = () => {
  return (
    <main className="vision-page" role="main">
      <section className="vision-hero">
        <div className="vision-glow" />
        <div className="container">
          <div className="vision-content">
            <Link to="/" className="back-link">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Reveal><span className="section-label">The Mission</span></Reveal>
            <Reveal><h2 className="section-title section-title--large">OUR<br />VISION.</h2></Reveal>
            <div className="grid-2 vision-grid">
              <div>
                <Reveal delay={0.1}>
                  <p className="vision-lead">At Khozna, our vision is to eliminate brokers, reduce rental friction, and bring transparency to Nepal’s rental market.</p>
                </Reveal>
                <div className="vision-checklist">
                  <Reveal delay={0.2}>
                    <div className="vision-checklist-item">
                      <div className="glass vision-check-icon"><CheckCircle2 size={20} color="var(--primary)" /></div>
                      <p className="vision-check-text">Connecting Guests and Owners directly without any hidden fees or exploitation.</p>
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="vision-checklist-item">
                      <div className="glass vision-check-icon"><CheckCircle2 size={20} color="var(--primary)" /></div>
                      <p className="vision-check-text">Building a digital rental ecosystem specifically engineered for the needs of Nepal.</p>
                    </div>
                  </Reveal>
                </div>
              </div>
              <Reveal delay={0.4}>
                <div className="vision-principle">
                  <h4 className="vision-principle-title">The Principle</h4>
                  <p className="vision-principle-text">Finding a rental place in Nepal is unnecessarily expensive. We believe renting should be direct, honest, and accessible for everyone.</p>
                  <div className="vision-principle-footer">
                    <h3 className="vision-principle-cta">SIMPLE. FAIR.<br /><span className="text-gradient">BROKER-FREE.</span></h3>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

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
              <h2 className="section-title walkthrough-step-title">SEARCH.<br />SIMPLE.</h2>
              <p className="walkthrough-step-desc">Browse real homes from real Owners across Nepal. No broker, no headache.</p>
            </motion.div>
            <motion.div className="walkthrough-step" style={{ opacity: useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]) }}>
              <span className="walkthrough-step-label walkthrough-step-label--green">Step 02</span>
              <h2 className="section-title walkthrough-step-title">MESSAGE.<br />DIRECT.</h2>
              <p className="walkthrough-step-desc">Skip the dalal. Message the Owner in real-time. Negotiate, ask, and finalize — completely free.</p>
            </motion.div>
            <motion.div className="walkthrough-step" style={{ opacity: useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 1]) }}>
              <span className="walkthrough-step-label walkthrough-step-label--amber">Step 03</span>
              <h2 className="section-title walkthrough-step-title">VERIFIED.<br />TRUST.</h2>
              <p className="walkthrough-step-desc">Our verification ensures every Owner and Guest is exactly who they say they are. Real people, real homes.</p>
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

const CustomCursor = () => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
  const followerX = useSpring(0, { stiffness: 150, damping: 25, mass: 0.1 });
  const followerY = useSpring(0, { stiffness: 150, damping: 25, mass: 0.1 });

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX); mouseY.set(e.clientY);
        followerX.set(e.clientX); followerY.set(e.clientY);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, followerX, followerY]);

  return (
    <>
      <motion.div className="custom-cursor" style={{ left: mouseX, top: mouseY }} />
      <motion.div className="cursor-follower" style={{ left: followerX, top: followerY }} />
    </>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  );
};

const TopProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div className="top-progress-bar" style={{ scaleX }} />
  );
};

function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean, type: "terms" | "privacy" | "safety" }>({ open: false, type: "terms" });
  const openLegal = (type: "terms" | "privacy" | "safety") => setLegalModal({ open: true, type });

  return (
    <Router>
      <ScrollToTop />
      <TopProgressBar />
      <div style={{ position: 'relative', background: 'var(--bg)' }}>
        <CustomCursor />
        <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
        <LegalModal isOpen={legalModal.open} type={legalModal.type} onClose={() => setLegalModal({ ...legalModal, open: false })} />

        <Navbar onJoinWaitlist={() => setIsWaitlistOpen(true)} />

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><HomePage onJoinWaitlist={() => setIsWaitlistOpen(true)} /></PageTransition>} />
            <Route path="/vision" element={<PageTransition><VisionPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>

        <Footer openLegal={openLegal} />
      </div>
    </Router>
  );
}

export default App;
