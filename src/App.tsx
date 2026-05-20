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
  Music2
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

const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: "terms" | "privacy" | "safety" }) => {
  const content = {
    terms: {
      title: "Terms & Conditions",
      date: "Effective Date: May 20, 2026",
      body: (
        <div style={{ textAlign: 'left', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-dim)' }}>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>1. Agreement to Terms</h4>
          <p>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and <strong>Khozna</strong> ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).</p>
          <p>You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>2. Intellectual Property Rights</h4>
          <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>3. User Representations</h4>
          <p>By using the Site, you represent and warrant that:<br/>(1) all registration information you submit will be true, accurate, current, and complete;<br/>(2) you will maintain the accuracy of such information and promptly update such registration information as necessary;<br/>(3) you have the legal capacity and you agree to comply with these Terms and Conditions;<br/>(4) you are not a minor in the jurisdiction in which you reside;<br/>(5) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise;<br/>(6) you will not use the Site for any illegal or unauthorized purpose; and<br/>(7) your use of the Site will not violate any applicable law or regulation.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>4. User Registration</h4>
          <p>You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>5. Prohibited Activities</h4>
          <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>6. Modifications and Interruptions</h4>
          <p>We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>7. Governing Law</h4>
          <p>These Terms shall be governed by and defined following the laws of Nepal. <strong>Khozna</strong> and yourself irrevocably consent that the courts of Nepal shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>8. Dispute Resolution</h4>
          <p>Any dispute arising out of or in connection with this contract, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>9. Contact Us</h4>
          <p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:</p>
          <p><strong>Khozna</strong><br/>support@khozna.com<br/>Phone: 9705278379<br/>Dhapa-Khasibazar, Kirtipur, Nepal</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      date: "Effective Date: May 20, 2026",
      body: (
        <div style={{ textAlign: 'left', fontSize: '0.95rem', lineHeight: '1.8', color: 'var(--text-dim)' }}>
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>1. Introduction</h4>
          <p>Welcome to <strong>Khozna</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or use any of our services.</p>
          
          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>2. Information We Collect</h4>
          <p>We may collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect can include the following:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li><strong>Personal Info Provided by You:</strong> Names; phone numbers; email addresses; mailing addresses; usernames; passwords; contact preferences; billing addresses; debit/credit card numbers; and other similar information.</li>
            <li><strong>Automatically Collected Info:</strong> We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services and other technical information.</li>
          </ul>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>3. How We Use Your Information</h4>
          <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <p>We use the information we collect or receive:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To fulfill and manage your orders.</li>
            <li>To deliver targeted advertising to you.</li>
            <li>To request feedback and to contact you about your use of our Services.</li>
            <li>To protect our Services.</li>
          </ul>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>4. Will Your Information be Shared with Anyone?</h4>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>5. How Long Do We Keep Your Information?</h4>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.</p>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>6. Do We Collect Information from Minors?</h4>
          <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services.</p>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>7. Your Privacy Rights</h4>
          <p>In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>8. Updates to This Notice</h4>
          <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>

          <h4 style={{ color: 'white', marginTop: '1.5rem' }}>9. Contact Us</h4>
          <p>If you have questions or comments about this notice, you may email us at support@khozna.com or by post to:</p>
          <p><strong>Khozna</strong><br/>Phone: 9705278379<br/>Dhapa-Khasibazar, Kirtipur<br/>Bagmati Province<br/>Nepal</p>
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
            <p style={{ fontSize: '0.85rem' }}>Email: support@khozna.com<br />Phone: +977 9705278379</p>
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
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="glass"
            style={{ width: '100%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', padding: '3rem', borderRadius: '32px', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', opacity: 0.5 }}>✕</button>
            <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.7rem' }}>{content[type].date}</span>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '2rem', color: 'var(--text)' }}>{content[type].title}</h3>
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
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="glass"
            style={{ width: '100%', maxWidth: '500px', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem)', borderRadius: '32px', textAlign: 'center', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', opacity: 0.5 }}>✕</button>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ width: '60px', height: '60px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 color="white" size={32} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>USER VERIFIED</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', marginBottom: '2rem' }}>You are now officially on the Khozna early access list. Follow us for the launch date.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="social-btn"><Instagram size={18} /></a>
                  <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="social-btn"><Linkedin size={18} /></a>
                  <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="social-btn"><Facebook size={18} /></a>
                  <a href="https://www.tiktok.com/@khozna_" target="_blank" rel="noopener noreferrer" className="social-btn"><Music2 size={18} /></a>
                </div>
              </motion.div>
            ) : (
              <>
                <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Identity Verification</span>
                <h3 style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', fontWeight: 900, marginTop: '1rem', marginBottom: '1.5rem' }}>JOIN THE<br />ECOSYSTEM.</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: 'clamp(1.5rem, 5vw, 3rem)', lineHeight: '1.6' }}>Enter your details to get verified for early access to Nepal's #1 most trusted rental platform.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Your Full Name" required value={name} onChange={(e) => setName(e.target.value)} style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'var(--text)', fontSize: '1rem', outline: 'none' }} />
                  <input type="tel" placeholder="WhatsApp Number" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'var(--text)', fontSize: '1rem', outline: 'none' }} />
                  <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'var(--text)', fontSize: '1rem', outline: 'none' }} />
                  {status === "error" && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '-0.5rem' }}>Something went wrong. Please try again.</p>}
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', background: 'var(--primary)', fontWeight: 800 }} disabled={status === "loading"}>
                    {status === "loading" ? "VERIFYING..." : "VERIFY & JOIN"} <ArrowRight size={20} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>100% Secure & Trusted. No Spam.</span>
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
    <footer id="contact" style={{ padding: 'clamp(4rem, 10vh, 8rem) 0 4rem', background: 'var(--text)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6rem' }}>
          <div>
            <div className="logo-box" style={{ marginBottom: '1.5rem' }}>
              <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
              <span className="logo-text" style={{ color: 'white' }}>KHOZNA</span>
            </div>
            <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', marginBottom: '0.5rem' }}>#1 NEPAL'S TRUSTED RENTAL PLATFORM</h5>
            <p style={{ color: '#E2E8F0', maxWidth: '300px', lineHeight: '1.6', fontSize: '0.9rem' }}>FIND YOUR NEXT HOME.<br />NO MIDDLEMAN.</p>
          </div>
          <div className="footer-links-grid" style={{ display: 'flex', gap: '6rem' }}>
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Socials</span>
              <div className="footer-social-row">
                <a href="https://www.instagram.com/khozna.np/" target="_blank" rel="noopener noreferrer" className="footer-social-item" style={{ color: '#E2E8F0' }}>
                  <div className="social-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}><Instagram size={14} /></div> Instagram
                </a>
                <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="footer-social-item" style={{ color: '#E2E8F0' }}>
                  <div className="social-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}><Linkedin size={14} /></div> LinkedIn
                </a>
                <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="footer-social-item" style={{ color: '#E2E8F0' }}>
                  <div className="social-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}><Facebook size={14} /></div> Facebook
                </a>
                <a href="https://www.tiktok.com/@khozna_" target="_blank" rel="noopener noreferrer" className="footer-social-item" style={{ color: '#E2E8F0' }}>
                  <div className="social-btn" style={{ color: 'white', background: 'rgba(255,255,255,0.1)' }}><Music2 size={14} /></div> TikTok
                </a>
              </div>
            </div>
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Platform</span>
              <Link to="/" className="footer-link" style={{ color: '#E2E8F0' }}>Home</Link>
              <button onClick={() => openLegal("safety")} className="footer-link footer-btn" style={{ color: '#E2E8F0' }}>Safe Rental Guide</button>
              <button onClick={() => openLegal("privacy")} className="footer-link footer-btn" style={{ color: '#E2E8F0' }}>Privacy Policy</button>
              <button onClick={() => openLegal("terms")} className="footer-link footer-btn" style={{ color: '#E2E8F0' }}>Terms of Service</button>
            </div>
            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</span>
              <a href="https://wa.me/9705278379" target="_blank" rel="noopener noreferrer" className="footer-link footer-contact-link" style={{ color: '#E2E8F0' }}><Phone size={16} /> 9705278379</a>
              <a href="mailto:support@khozna.com" className="footer-link footer-contact-link" style={{ color: '#E2E8F0' }}><Mail size={16} /> support@khozna.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>© 2026 KHOZNA. THE RENTAL ECOSYSTEM.</p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700 }}>KATHMANDU, NEPAL</span>
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
          <video autoPlay muted loop playsInline webkit-playsinline="true" preload="auto" className="hero-video" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src="/view%20of%20ktm.mp4" type="video/mp4" />
          </video>
        </div>
        <div style={{ textAlign: 'center', zIndex: 10, width: '100%' }}>
          <h1 className="hero-title">
            <span className="hero-line" style={{ color: '#FFFFFF' }}><Reveal>#1 NEPAL'S TRUSTED</Reveal></span>
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
          <div style={{ width: '30px', height: '50px', border: '2px solid var(--text)', borderRadius: '15px', position: 'relative' }}>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: '4px', height: '10px', background: 'var(--text)', borderRadius: '2px', position: 'absolute', top: '10px', left: '50%', marginLeft: '-2px' }} />
          </div>
        </motion.div>
      </section>

      <div className="marquee-container" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0', background: 'var(--surface)', overflow: 'hidden' }}>
        <motion.div animate={{ x: [0, -2000] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ display: 'flex', gap: '6rem', whiteSpace: 'nowrap', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '6px', opacity: 0.3, color: 'var(--text-dim)' }}>
          {[1, 2, 3, 4, 5].map(i => (<React.Fragment key={i}><span>NO SCAMS</span><span>FREE FOR EVERYONE</span><span>VERIFIED LISTINGS</span></React.Fragment>))}
        </motion.div>
      </div>

      <AppWalkthrough />
      <AppShowcase />

      <section style={{ padding: 'clamp(5rem, 15vh, 15rem) 0', background: 'var(--surface)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
            <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', margin: '0 auto' }}>THE NEW WAY<br />TO RENT.</h2></Reveal>
          </div>
          <div className="grid-3 features-container">
            <div className="glass feature-box" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <img src="/icon-free.png" alt="Free for Everyone" className="icon-3d" />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Free for Everyone</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Khozna is 100% free — for Owners and Guests alike. Always.</p>
            </div>
            <div className="glass feature-box default-active" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <img src="/icon-chat.png" alt="Direct Message" className="icon-3d" />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Direct Message</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Message the Owner directly inside our app and close the deal faster.</p>
            </div>
            <div className="glass feature-box" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <img src="/icon-verified.png" alt="Verified" className="icon-3d" />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>100% Verified</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>We manually check every house. If it's on Khozna, it's real and safe.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(6rem, 20vh, 15rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 12vw, 10rem)', lineHeight: 0.8, marginBottom: '4rem' }}>JOIN THE<br />FUTURE.</h2></Reveal>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.8', padding: '0 1rem' }}>We're not just building an app. We're building the future of how people live and connect in Nepal.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}><img src="/original_logo.png" style={{ height: '80px', objectFit: 'contain' }} alt="KHOZNA Quality Stamp" /></div>
        </div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', background: 'var(--primary-glow)', filter: 'blur(200px)', borderRadius: '50%', opacity: 0.15, zIndex: -1 }} />
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
    <section id="app" style={{ padding: 'clamp(4rem, 10vh, 10rem) 0', overflow: 'hidden' }}>
      <div className="container">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotate({ x: 0, y: 0 })}
          className="glass"
          style={{
            padding: 'clamp(2rem, 5vw, 6rem)',
            borderRadius: '48px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <img src="/icon-phone.png" alt="Mobile" className="icon-3d" style={{ width: '80px', height: '80px' }} />
              <Reveal><h2 style={{ fontSize: 'clamp(2.1rem, 9vw, 4.5rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '2rem', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                THE FUTURE <br /> IN YOUR POCKET.
              </h2></Reveal>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginBottom: '3rem', maxWidth: '450px' }}>
                The Khozna app is coming soon to change how you live. Simple, fast, and secure.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: '30px' }} />
                </div>
                <div className="glass" style={{ padding: '0.8rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" style={{ height: '30px' }} />
                </div>
              </div>
            </div>

            <motion.div
              className="emotion-slider-mobile"
              style={{
                display: 'flex',
                gap: '2rem',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                rotateX: rotate.x,
                rotateY: rotate.y
              }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
            >
              <div className="emotion-card" style={{ transform: 'translateZ(50px) translateY(-30px) rotate(5deg)', position: 'relative' }}>
                <img loading="lazy" src="/man.png" alt="Happy Owner" className="emotion-image" style={{ objectPosition: 'top' }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)' }}>Verified Owner</span>
                </div>
              </div>
              <div className="emotion-card" style={{ transform: 'translateZ(100px) rotate(-5deg)', position: 'relative' }}>
                <img loading="lazy" src="/boy.png" alt="Happy Guest" className="emotion-image" style={{ objectPosition: 'top' }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)' }}>Happy Guest</span>
                </div>
              </div>
            </motion.div>
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
    <main style={{ padding: '120px 0 0', background: 'var(--bg)' }}>
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', background: 'var(--surface)', position: 'relative', overflow: 'hidden', padding: '10vh 0', borderTop: '1px solid var(--border)' }}>
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
                <Reveal delay={0.1}><p style={{ fontSize: '1.4rem', color: 'var(--text)', lineHeight: '1.6', marginBottom: '3rem', fontWeight: 500 }}>At Khozna, our vision is to eliminate brokers, reduce rental friction, and bring transparency to Nepal’s rental market.</p></Reveal>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <Reveal delay={0.2}><div style={{ display: 'flex', gap: '1.5rem' }}><div className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={20} color="var(--primary)" /></div><p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>Connecting Guests and Owners directly without any hidden fees or exploitation.</p></div></Reveal>
                  <Reveal delay={0.3}><div style={{ display: 'flex', gap: '1.5rem' }}><div className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle2 size={20} color="var(--primary)" /></div><p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>Building a digital rental ecosystem specifically engineered for the needs of Nepal.</p></div></Reveal>
                </div>
              </div>
              <Reveal delay={0.4}>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)', height: '100%' }}>
                  <h4 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>The Principle</h4>
                  <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', marginBottom: '2rem' }}>Finding a rental place in Nepal is unnecessarily expensive. We believe renting should be direct, honest, and accessible for everyone.</p>
                  <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)' }}><h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)' }}>SIMPLE. FAIR.<br /><span className="text-gradient">BROKER-FREE.</span></h3></div>
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
    <section id="walkthrough" ref={targetRef} className="walkthrough-container" style={{ background: 'var(--bg)', position: 'relative', zIndex: 1 }}>
      <div className="walkthrough-sticky" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="walkthrough-grid" style={{ width: '90%', maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
          <div className="walkthrough-text-side" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <motion.div style={{ position: 'absolute', opacity: useTransform(scrollYProgress, [0, 0.25], [1, 0]), top: '50%', transform: 'translateY(-50%)', width: '100%' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 01</span>
              <h2 className="section-title" style={{ marginTop: '1rem', fontSize: 'clamp(2rem, 5vw, 4rem)' }}>SEARCH.<br />SIMPLE.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>Browse real homes from real Owners across Nepal. No broker, no headache.</p>
            </motion.div>
            <motion.div style={{ position: 'absolute', opacity: useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]), top: '50%', transform: 'translateY(-50%)', width: '100%' }}>
              <span style={{ color: '#10B981', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 02</span>
              <h2 className="section-title" style={{ marginTop: '1rem', fontSize: 'clamp(2rem, 5vw, 4rem)' }}>MESSAGE.<br />DIRECT.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>Skip the dalal. Message the Owner in real-time. Negotiate, ask, and finalize — completely free.</p>
            </motion.div>
            <motion.div style={{ position: 'absolute', opacity: useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 1]), top: '50%', transform: 'translateY(-50%)', width: '100%' }}>
              <span style={{ color: '#F59E0B', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 03</span>
              <h2 className="section-title" style={{ marginTop: '1rem', fontSize: 'clamp(2rem, 5vw, 4rem)' }}>VERIFIED.<br />TRUST.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>Our verification ensures every Owner and Guest is exactly who they say they are. Real people, real homes.</p>
            </motion.div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <motion.div className="phone-mockup" style={{ scale: screen1Scale }}>
              <motion.img loading="lazy" src="/new Home.jpeg" className="phone-screen" style={{ opacity: screen1Opacity }} />
              <motion.img loading="lazy" src="/New message.jpeg" className="phone-screen" style={{ opacity: screen2Opacity, position: 'absolute', top: 0, left: 0, y: screen2Y }} />
              <motion.img loading="lazy" src="/New Kyc.jpeg" className="phone-screen" style={{ opacity: screen3Opacity, position: 'absolute', top: 0, left: 0, y: screen3Y }} />
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
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--primary)',
        transformOrigin: '0%',
        zIndex: 2000,
        scaleX
      }}
    />
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
