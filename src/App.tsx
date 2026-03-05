import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Cpu,
  Layers,
  Instagram,
  Linkedin,
  Facebook,
  Mail,
  Phone,
  CheckCircle2,
  ArrowLeft,
  Music2
} from 'lucide-react';

// --- Configuration ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwvHzo2RkDYJi2pezC7UUEpp3Fdu1-seeiLUMPIAl9YT5D4P7Qi1N5bfBr5wqqh3z38/exec";

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

const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: "terms" | "privacy" | "safety" }) => {
  const content = {
    terms: {
      title: "Terms & Conditions",
      date: "Last Updated: March 2026",
      body: (
        <div style={{ textAlign: 'left', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-dim)' }}>
          <p style={{ color: 'white', marginBottom: '1.5rem' }}>Welcome to Khozna. By accessing or using our website or services, you agree to comply with and be bound by these Terms & Conditions.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>1. Platform Purpose</h4>
          <p>Khozna is a direct rental discovery platform that connects property owners and renters without brokers. We do not own, manage, or lease properties listed on the platform.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>2. User Eligibility</h4>
          <p>You must be at least 18 years old to use Khozna. By using the platform, you confirm that the information you provide is accurate and lawful.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>3. Listings & Content</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Property owners are responsible for the accuracy of listings</li>
            <li>Fake, misleading, or duplicate listings are strictly prohibited</li>
            <li>Khozna reserves the right to remove any content without prior notice</li>
          </ul>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>4. No Brokerage Guarantee</h4>
          <p>Khozna does not act as a broker, handle payments, or guarantee rental outcomes. All transactions occur directly between users.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>5. User Conduct</h4>
          <p>Violation of platform safeguards or attempting to scam users may result in a permanent ban.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>6. Limitation of Liability</h4>
          <p>Khozna is not responsible for property disputes, financial loss, or damages. Use the platform at your own risk.</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      date: "Last Updated: March 2026",
      body: (
        <div style={{ textAlign: 'left', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-dim)' }}>
          <p style={{ color: 'white', marginBottom: '1.5rem' }}>Your privacy matters. We collect only what is necessary to operate the platform.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>Information We Collect</h4>
          <p>Name, phone number, email, and property listing details for platform operations and fraud prevention.</p>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>Data Protection</h4>
          <p>We do not sell user data. We apply reasonable security measures and only share data when legally required.</p>
        </div>
      )
    },
    safety: {
      title: "Safe Rental Guide",
      date: "Stay Secure",
      body: (
        <div style={{ textAlign: 'left', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-dim)' }}>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
            <li>Meet property owners in person before any agreement.</li>
            <li>Never send advance payments without verification.</li>
            <li>Avoid deals that feel rushed or unrealistic.</li>
            <li>Visit properties before confirming.</li>
          </ul>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h4 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Report a Scammer</h4>
            <p style={{ fontSize: '0.85rem' }}>Email: khoznaapp@gmail.com<br />Phone: +977 9705278379</p>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.8rem', fontStyle: 'italic' }}>Disclaimer: Khozna is a technology platform, not a real estate agency. Users are solely responsible for their interactions.</p>
        </div>
      )
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="glass"
            style={{ width: '100%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', padding: '3rem', borderRadius: '32px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}>✕</button>
            <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.7rem' }}>{content[type].date}</span>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '2rem' }}>{content[type].title}</h3>
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
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="glass"
            style={{ width: '100%', maxWidth: '500px', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem)', borderRadius: '32px', textAlign: 'center', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}>✕</button>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ width: '60px', height: '60px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 color="white" size={32} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>USER VERIFIED</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', marginBottom: '2rem' }}>You are now officially on the Khozna early access list. Follow us for the launch date.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <a href="https://www.instagram.com/khozna_/" target="_blank" rel="noopener noreferrer" className="social-btn"><Instagram size={18} /></a>
                  <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="social-btn"><Linkedin size={18} /></a>
                  <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="social-btn"><Facebook size={18} /></a>
                  <a href="https://www.tiktok.com/@khozna_" target="_blank" rel="noopener noreferrer" className="social-btn"><Music2 size={18} /></a>
                </div>
              </motion.div>
            ) : (
              <>
                <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Identity Verification</span>
                <h3 style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', fontWeight: 900, marginTop: '1rem', marginBottom: '1.5rem' }}>JOIN THE<br />ECOSYSTEM.</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: 'clamp(1.5rem, 5vw, 3rem)', lineHeight: '1.6' }}>Enter your details to get verified for early access to Nepal's #1 rental platform.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Your Full Name" required value={name} onChange={(e) => setName(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                  <input type="tel" placeholder="WhatsApp Number" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'white', fontSize: '1rem', outline: 'none' }} />
                  {status === "error" && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '-0.5rem' }}>Something went wrong. Please try again.</p>}
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', background: 'var(--primary)', fontWeight: 800 }} disabled={status === "loading"}>
                    {status === "loading" ? "VERIFYING..." : "VERIFY & JOIN"} <ArrowRight size={20} />
                  </button>
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
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
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
    <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '1rem 4rem', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <div className="logo-box">
          <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
          <span className="logo-text">KHOZNA</span>
        </div>
      </a>
      <div className="nav-links" style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
        <Link to="/" onClick={(e) => handleNavClick(e, "walkthrough")} className="nav-link">The Platform</Link>
        <Link to="/vision" className="nav-link">Vision</Link>
        <Link to="/" onClick={(e) => handleNavClick(e, "contact")} className="nav-link">Contact</Link>
      </div>
      <button onClick={onJoinWaitlist} className="nav-btn-premium">JOIN FREE</button>
    </nav>
  );
};

const Footer = ({ openLegal }: { openLegal: (type: "terms" | "privacy" | "safety") => void }) => {
  return (
    <footer id="contact" style={{ padding: 'clamp(4rem, 10vh, 8rem) 0 4rem', background: '#000', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6rem' }}>
          <div>
            <div className="logo-box" style={{ marginBottom: '1.5rem' }}>
              <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
              <span className="logo-text">KHOZNA</span>
            </div>
            <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', marginBottom: '0.5rem' }}>#1 NEPAL'S TRUSTED RENTAL PLATFORM</h5>
            <p style={{ color: 'var(--text-dim)', maxWidth: '300px', lineHeight: '1.6', fontSize: '0.9rem' }}>FIND YOUR NEXT HOME.<br />NO MIDDLEMAN.</p>
          </div>
          <div style={{ display: 'flex', gap: '6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Socials</span>
              <div className="footer-social-row">
                <a href="https://www.instagram.com/khozna_/" target="_blank" rel="noopener noreferrer" className="footer-social-item">
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Platform</span>
              <Link to="/" className="footer-link">Home</Link>
              <button onClick={() => openLegal("safety")} className="footer-link" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Safe Rental Guide</button>
              <button onClick={() => openLegal("privacy")} className="footer-link" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Privacy Policy</button>
              <button onClick={() => openLegal("terms")} className="footer-link" style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}>Terms of Service</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</span>
              <a href="https://wa.me/9705278379" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> 9705278379</a>
              <a href="mailto:khoznaapp@gmail.com" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> khoznaapp@gmail.com</a>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>© 2026 KHOZNA. THE RENTAL ECOSYSTEM.</p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 700 }}>KATHMANDU, NEPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Components ---

const HomePage = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  return (
    <main>
      <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', zIndex: 100 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
          <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, filter: 'brightness(0.8) contrast(1.1)' }}>
            <source src="/valley of KTM.mp4" type="video/mp4" />
          </video>
        </div>
        <div style={{ textAlign: 'center', zIndex: 10, width: '100%' }}>
          <h1 className="hero-title">
            <span className="hero-line"><Reveal>#1 NEPAL'S TRUSTED</Reveal></span>
            <span className="hero-line"><Reveal delay={0.1}><span className="text-gradient">RENTAL PLATFORM.</span></Reveal></span>
          </h1>
          <Reveal delay={0.3}>
            <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }} className="hero-buttons">
              <MagneticElement><button onClick={onJoinWaitlist} className="btn-primary" style={{ padding: '1.2rem 3rem' }}>JOIN NOW <ArrowRight size={20} /></button></MagneticElement>
              <Link to="/vision" className="btn-outline" style={{ padding: '1.2rem 3rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>The Vision</Link>
            </div>
          </Reveal>
        </div>
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}>
          <div style={{ width: '30px', height: '50px', border: '2px solid white', borderRadius: '15px', position: 'relative' }}>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '4px', height: '10px', background: 'white', borderRadius: '2px', position: 'absolute', top: '10px', left: '50%', marginLeft: '-2px' }} />
          </div>
        </motion.div>
      </section>

      <div className="marquee-container" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '3rem 0', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
        <motion.div animate={{ x: [0, -2000] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ display: 'flex', gap: '6rem', whiteSpace: 'nowrap', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '8px', opacity: 0.2 }}>
          {[1, 2, 3, 4, 5].map(i => (<React.Fragment key={i}><span>NO SCAMS</span><span>ZERO COMMISSION</span></React.Fragment>))}
        </motion.div>
      </div>

      <AppWalkthrough />
      <AppShowcase />

      <section style={{ padding: 'clamp(5rem, 15vh, 15rem) 0', background: '#050505', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', margin: '0 auto' }}>THE NEW WAY<br />TO RENT.</h2></Reveal>
          </div>
          <div className="grid-3">
            <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <Zap size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>No Commission</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Khozna connects you directly to the owner for $0 commission.</p>
            </div>
            <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', border: '1px solid var(--primary)', textAlign: 'center' }}>
              <Cpu size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Direct Chat</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Chat directly with the house owner inside our app and close the deal faster.</p>
            </div>
            <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <Layers size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>100% Verified</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>We manually check every house. If it's on Khozna, it's real and safe.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(6rem, 20vh, 15rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 12vw, 10rem)', lineHeight: 0.8, marginBottom: '4rem' }}>JOIN THE<br />REVOLUTION.</h2></Reveal>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.8', padding: '0 1rem' }}>We're not just building an app. We're building the future of how people live and connect in Nepal.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}><img src="/original_logo.png" style={{ height: '80px', objectFit: 'contain' }} alt="KHOZNA Quality Stamp" /></div>
        </div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', background: 'var(--primary-glow)', filter: 'blur(200px)', borderRadius: '50%', opacity: 0.3, zIndex: -1 }} />
      </section>
    </main>
  );
};

const AppShowcase = () => {
  return (
    <section id="app" style={{ padding: 'clamp(4rem, 10vh, 10rem) 0', overflow: 'hidden' }}>
      <div className="container">
        <div className="glass" style={{ padding: 'clamp(2rem, 5vw, 6rem)', borderRadius: '48px', position: 'relative', overflow: 'hidden' }}>
           <div className="grid-2" style={{ alignItems: 'center' }}>
              <div>
                <Reveal><h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1, marginBottom: '2rem' }}>
                  THE FUTURE <br/> IN YOUR POCKET.
                </h2></Reveal>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginBottom: '3rem', maxWidth: '450px' }}>
                  The Khozna app is coming soon to revolutionize how you live. Simple, fast, and secure.
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                   <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '12px', height: '12px', background: 'black', borderRadius: '2px' }} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                         <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Coming Soon on</div>
                         <div style={{ fontSize: '1rem', fontWeight: 800 }}>App Store</div>
                      </div>
                   </div>
                   <div className="glass" style={{ padding: '1rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Zap size={24} color="var(--primary)" />
                      <div style={{ textAlign: 'left' }}>
                         <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>Coming Soon on</div>
                         <div style={{ fontSize: '1rem', fontWeight: 800 }}>Play Store</div>
                      </div>
                   </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', transform: 'rotate(5deg) translateY(30px)' }}>
                 <div className="phone-mockup" style={{ transform: 'translateY(-30px)' }}>
                    <img src="/Home screeen.jpeg" className="phone-screen" />
                 </div>
                 <div className="phone-mockup">
                    <img src="/meesage setion.jpeg" className="phone-screen" />
                 </div>
              </div>
           </div>

           {/* Background Glow */}
           <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'var(--primary-glow)', filter: 'blur(150px)', borderRadius: '50%', zIndex: -1 }} />
        </div>
      </div>
    </section>
  );
};

const VisionPage = () => {
  return (
    <main style={{ padding: '120px 0 0', background: '#000' }}>
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: '#0a0a0a', position: 'relative', overflow: 'hidden', padding: '10vh 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'rgba(0, 163, 225, 0.03)', filter: 'blur(150px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '3rem' }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Reveal><span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' }}>The Mission</span></Reveal>
            <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, marginBottom: '4rem' }}>OUR<br />VISION.</h2></Reveal>
            <div className="grid-2" style={{ gap: '6rem', alignItems: 'start' }}>
              <div>
                <Reveal delay={0.1}><p style={{ fontSize: '1.4rem', color: 'white', lineHeight: '1.6', marginBottom: '3rem', fontWeight: 500 }}>At Khozna, our vision is to eliminate brokers, reduce rental friction, and bring transparency to Nepal’s rental market.</p></Reveal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <Reveal delay={0.2}><div style={{ display: 'flex', gap: '1.5rem' }}><div className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={20} color="var(--primary)" /></div><p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>Connecting renters and owners directly without any hidden fees or exploitation.</p></div></Reveal>
                  <Reveal delay={0.3}><div style={{ display: 'flex', gap: '1.5rem' }}><div className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={20} color="var(--primary)" /></div><p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>Building a digital rental ecosystem specifically engineered for the needs of Nepal.</p></div></Reveal>
                </div>
              </div>
              <Reveal delay={0.4}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                  <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>The Principle</h4>
                  <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', marginBottom: '2rem' }}>Finding a room in Nepal is unnecessarily expensive. We believe renting should be direct, honest, and accessible for everyone.</p>
                  <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}><h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>SIMPLE. FAIR.<br /><span className="text-gradient">BROKER-FREE.</span></h3></div>
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
  const screen3Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.8, 0.85], [0, 1, 1, 0]);
  const screen3Y = useTransform(scrollYProgress, [0.55, 0.6], [100, 0]);

  return (
    <section id="walkthrough" ref={targetRef} className="walkthrough-container" style={{ background: '#000', position: 'relative', zIndex: 1 }}>
      <div className="walkthrough-sticky" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="container walkthrough-grid grid-2" style={{ alignItems: 'center' }}>
          <div className="walkthrough-text-side" style={{ position: 'relative', height: '50vh' }}>
            <motion.div style={{ position: 'absolute', opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 01</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>DISCOVER<br />BEYOND.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>Browse a curated feed of verified properties. No brokers, no noise. Just real places for real people.</p>
            </motion.div>
            <motion.div style={{ position: 'absolute', opacity: screen2Opacity }}>
              <span style={{ color: '#10B981', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 02</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>DIRECT<br />CONNECTION.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>Skip the middleman. Chat directly with landlords in real-time. Negotiate, ask, and finalize without a single commission fee.</p>
            </motion.div>
            <motion.div style={{ position: 'absolute', opacity: screen3Opacity }}>
              <span style={{ color: '#F59E0B', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 03</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>VERIFIED<br />TRUST.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>Our bank-grade KYC verification ensures that every user—landlord or tenant—is exactly who they say they are.</p>
            </motion.div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <motion.div className="phone-mockup" style={{ scale: screen1Scale }}>
              <motion.img src="/Home screeen.jpeg" className="phone-screen" style={{ opacity: screen1Opacity }} />
              <motion.img src="/meesage setion.jpeg" className="phone-screen" style={{ opacity: screen2Opacity, position: 'absolute', top: 0, left: 0, y: screen2Y }} />
              <motion.img src="/kyc screen.jpeg" className="phone-screen" style={{ opacity: screen3Opacity, position: 'absolute', top: 0, left: 0, y: screen3Y }} />
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
  }, []);

  return (
    <>
      <motion.div className="custom-cursor" style={{ left: mouseX, top: mouseY }} />
      <motion.div className="cursor-follower" style={{ left: followerX, top: followerY }} />
    </>
  );
};

function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean, type: "terms" | "privacy" | "safety" }>({ open: false, type: "terms" });
  const openLegal = (type: "terms" | "privacy" | "safety") => setLegalModal({ open: true, type });

  return (
    <Router>
      <ScrollToTop />
      <div style={{ position: 'relative', background: '#000' }}>
        <CustomCursor />
        <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
        <LegalModal isOpen={legalModal.open} type={legalModal.type} onClose={() => setLegalModal({ ...legalModal, open: false })} />

        <Navbar onJoinWaitlist={() => setIsWaitlistOpen(true)} />

        <Routes>
          <Route path="/" element={<HomePage onJoinWaitlist={() => setIsWaitlistOpen(true)} />} />
          <Route path="/vision" element={<VisionPage />} />
        </Routes>

        <Footer openLegal={openLegal} />
      </div>
    </Router>
  );
}

export default App;
