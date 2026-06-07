import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  Phone,
} from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhAKH-8IQxdzTegL5_c8kNtG5cTdl5uffnQN1R8AdWp89A12NH0b0OBA9O15NGIcuC/exec';

type LegalType = 'terms' | 'privacy' | 'safety';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/khozna.np/', icon: <Instagram size={18} /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/khozna/', icon: <Linkedin size={18} /> },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61587497082072', icon: <Facebook size={18} /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@khozna_', icon: <Music2 size={18} /> },
];

const problemCards = [
  {
    title: 'Broker pressure',
    copy: 'Many renters pay extra just to get a phone number or a rushed viewing.',
  },
  {
    title: 'Fake or old listings',
    copy: 'Photos, prices, and availability are often unclear until you already waste time.',
  },
  {
    title: 'No trust layer',
    copy: 'Renters and owners both need a simple way to know who is real before meeting.',
  },
];

const trustSteps = [
  'Owner details are checked before a listing goes live.',
  'Photos, location, rent, and contact flow are reviewed for basic accuracy.',
  'Users can report suspicious behavior so bad actors are removed faster.',
];

const featureCards = [
  {
    title: 'For renters',
    copy: 'Search rooms, flats, and houses by area, rent range, and owner status.',
    image: '/icon-free.png',
  },
  {
    title: 'For owners',
    copy: 'List property without paying a middleman and talk directly with serious renters.',
    image: '/icon-chat.png',
  },
  {
    title: 'For trust',
    copy: 'Every important flow is designed around safer contact, verified listings, and reporting.',
    image: '/icon-verified.png',
  },
];

const walkthroughSteps = [
  {
    label: 'Step 01',
    title: 'Search by real needs',
    copy: 'Start with area, budget, room type, and photos instead of random posts and old screenshots.',
    image: '/new Home.jpeg',
    alt: 'Khozna home search screen',
  },
  {
    label: 'Step 02',
    title: 'Message the owner',
    copy: 'Ask about water, parking, rules, deposit, and viewing time directly inside the app.',
    image: '/New message.jpeg',
    alt: 'Khozna direct messaging screen',
  },
  {
    label: 'Step 03',
    title: 'Move with more confidence',
    copy: 'Verification and reporting help keep the platform focused on real people and real homes.',
    image: '/New Kyc.jpeg',
    alt: 'Khozna verification screen',
  },
];

const cityAreas = ['Kirtipur', 'Kalanki', 'Baneshwor', 'Lalitpur', 'Bhaktapur', 'Kathmandu'];

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.65, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  );
};

const MagneticElement = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (event: React.MouseEvent) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    setPosition({
      x: (event.clientX - (bounds.left + bounds.width / 2)) * 0.18,
      y: (event.clientY - (bounds.top + bounds.height / 2)) * 0.18,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={position}
      transition={{ type: 'spring', stiffness: 170, damping: 18, mass: 0.2 }}
      className="magnetic"
    >
      {children}
    </motion.div>
  );
};

const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean; onClose: () => void; type: LegalType }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const content: Record<LegalType, { title: string; date: string; body: React.ReactNode }> = {
    terms: {
      title: 'Terms of Service',
      date: 'Platform terms',
      body: (
        <div className="modal-body">
          <p>Khozna is a technology platform built to help renters and property owners connect directly. By using the site, you agree to use it honestly and follow Nepali law.</p>
          <h4>User responsibility</h4>
          <p>Users are responsible for checking property details, meeting safely, and making final rental decisions. Khozna does not act as a real estate agency or broker.</p>
          <h4>Listings and communication</h4>
          <p>Owners should provide accurate rent, photos, location, and availability. Renters should not misuse contact information or submit false details.</p>
          <h4>Contact</h4>
          <p>For support, email support@khozna.com or call +977 9705278379.</p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      date: 'Your information',
      body: (
        <div className="modal-body">
          <p>Khozna collects only the information needed to manage early access, support requests, and platform safety.</p>
          <h4>Information collected</h4>
          <p>The waitlist form may collect your name, phone number, and email address. This helps the team contact you about launch access and important updates.</p>
          <h4>How it is used</h4>
          <p>Your details are used for Khozna communication and platform preparation. We do not sell your contact details.</p>
          <h4>Your choice</h4>
          <p>You can contact support@khozna.com to ask about your submitted information.</p>
        </div>
      ),
    },
    safety: {
      title: 'Safe Rental Guide',
      date: 'Before you rent',
      body: (
        <div className="modal-body">
          <ul>
            <li>Visit the property before paying any advance.</li>
            <li>Meet in a safe place and inform someone you trust.</li>
            <li>Confirm owner identity, rent, deposit, rules, and utilities in writing.</li>
            <li>Avoid urgent deals that pressure you to pay immediately.</li>
          </ul>
          <div className="modal-report-box">
            <h4>Report suspicious activity</h4>
            <p>Email support@khozna.com or call +977 9705278379.</p>
          </div>
        </div>
      ),
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div className="modal-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 22 }} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={onClose} aria-label="Close modal">x</button>
            <span className="eyebrow">{content[type].date}</span>
            <h3 id="modal-title">{content[type].title}</h3>
            {content[type].body}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name, phone, email, source: 'khozna-web' }),
      });

      setIsSubmitted(true);
      setStatus('idle');
      setTimeout(() => {
        setIsSubmitted(false);
        setName('');
        setPhone('');
        setEmail('');
        onClose();
      }, 4500);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="waitlist-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true">
          <motion.div className="waitlist-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close modal-close--dark" onClick={onClose} aria-label="Close modal">x</button>
            {isSubmitted ? (
              <div className="success-state">
                <div className="success-icon"><CheckCircle2 size={32} /></div>
                <h3>You are on the early access list.</h3>
                <p>We will contact you when Khozna opens for the next launch group.</p>
                <div className="social-row">
                  {socialLinks.map((item) => (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>{item.icon}</a>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <span className="eyebrow">Early access</span>
                <h3>Join the Khozna waitlist</h3>
                <p className="waitlist-copy">Get notified when direct rental search opens in your area. No spam, just launch updates.</p>
                <form className="waitlist-form" onSubmit={handleSubmit}>
                  <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Full name" required aria-label="Full name" />
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" placeholder="Phone or WhatsApp number" required aria-label="Phone or WhatsApp number" />
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" required aria-label="Email address" />
                  {status === 'error' && <p className="form-error">Something went wrong. Please try again.</p>}
                  <button className="btn btn-primary" type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Joining...' : 'Join waitlist'} <ArrowRight size={18} />
                  </button>
                </form>
                <p className="privacy-note">Used only for launch access and Khozna updates.</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    const scrollToId = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToId, 120);
    } else {
      scrollToId();
    }
  };

  const navItems = [
    { label: 'Problem', id: 'problem' },
    { label: 'How it works', id: 'walkthrough' },
    { label: 'Trust', id: 'trust' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`} aria-label="Main navigation">
        <Link to="/" className="brand-link" aria-label="Khozna home">
          <img src="/original_logo.png" alt="" />
          <span>Khozna</span>
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.id} href={`/#${item.id}`} onClick={(event) => handleNavClick(event, item.id)}>{item.label}</a>
          ))}
          <Link to="/vision">Vision</Link>
        </div>
        <div className="nav-actions">
          <button className="btn btn-small" onClick={onJoinWaitlist}>Join waitlist</button>
          <button className={`hamburger ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`drawer-backdrop ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`mobile-drawer ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
        {navItems.map((item) => (
          <a key={item.id} href={`/#${item.id}`} onClick={(event) => handleNavClick(event, item.id)}>{item.label}</a>
        ))}
        <Link to="/vision" onClick={() => setMenuOpen(false)}>Vision</Link>
        <button className="btn btn-primary" onClick={() => { setMenuOpen(false); onJoinWaitlist(); }}>Join waitlist</button>
      </aside>
    </>
  );
};

const Hero = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => (
  <section className="hero-section">
    <div className="hero-media" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata" poster="/original_logo.png">
        <source src="/view%20of%20ktm.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
    </div>
    <div className="container hero-content">
      <Reveal>
        <span className="hero-badge">Launching first for Kathmandu Valley renters</span>
      </Reveal>
      <Reveal delay={0.08}>
        <h1>Find rooms in Nepal without broker drama.</h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="hero-subtitle">Khozna helps renters discover real rooms, flats, and houses directly from owners - with verification, safer contact, and no middleman fees.</p>
      </Reveal>
      <Reveal delay={0.24}>
        <div className="hero-actions">
          <MagneticElement>
            <button className="btn btn-primary btn-large" onClick={onJoinWaitlist}>Join early access <ArrowRight size={20} /></button>
          </MagneticElement>
          <a className="btn btn-ghost btn-large" href="#walkthrough">See how it works</a>
        </div>
      </Reveal>
      <Reveal delay={0.32}>
        <div className="hero-proof" aria-label="Khozna platform highlights">
          <span><strong>Direct</strong> owner contact</span>
          <span><strong>Verified</strong> listing process</span>
          <span><strong>Free</strong> for renters and owners</span>
        </div>
      </Reveal>
    </div>
  </section>
);

const ProblemSection = () => (
  <section id="problem" className="section section-soft">
    <div className="container">
      <Reveal className="section-heading">
        <span className="eyebrow">Why Khozna exists</span>
        <h2>Renting in Nepal should not feel like a trap.</h2>
        <p>The current rental journey is scattered across posts, calls, screenshots, broker fees, and half-truths. Khozna turns that chaos into a direct, safer flow.</p>
      </Reveal>
      <div className="problem-grid">
        {problemCards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.08}>
            <article className="info-card">
              <span className="card-number">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const AppWalkthrough = () => (
  <section id="walkthrough" className="section walkthrough-section">
    <div className="container">
      <Reveal className="section-heading section-heading--split">
        <div>
          <span className="eyebrow">Platform flow</span>
          <h2>Simple enough for renters. Useful enough for owners.</h2>
        </div>
        <p>Instead of forcing people through a complicated property portal, Khozna focuses on three things Nepal renters actually need: search, contact, and trust.</p>
      </Reveal>

      <div className="walkthrough-grid">
        {walkthroughSteps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.1}>
            <article className="walkthrough-card">
              <div className="phone-frame">
                <img src={step.image} alt={step.alt} loading="lazy" />
              </div>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const TrustSection = () => (
  <section id="trust" className="section trust-section">
    <div className="container trust-layout">
      <Reveal>
        <span className="eyebrow">Trust system</span>
        <h2>Trust is the product, not decoration.</h2>
        <p>Khozna should not just look premium. It needs to make renters feel safer before they call, visit, or pay. This section now explains how trust is handled.</p>
        <div className="area-tags" aria-label="Target areas">
          {cityAreas.map((area) => <span key={area}>{area}</span>)}
        </div>
      </Reveal>
      <div className="trust-list">
        {trustSteps.map((item, index) => (
          <Reveal key={item} delay={index * 0.08}>
            <div className="trust-item">
              <CheckCircle2 size={24} />
              <div>
                <h3>Verification layer {index + 1}</h3>
                <p>{item}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const FeatureSection = () => (
  <section className="section section-soft">
    <div className="container">
      <Reveal className="section-heading">
        <span className="eyebrow">Built for both sides</span>
        <h2>A rental marketplace that respects the renter and the owner.</h2>
      </Reveal>
      <div className="feature-grid">
        {featureCards.map((feature) => (
          <Reveal key={feature.title}>
            <article className="feature-card">
              <img src={feature.image} alt="" loading="lazy" />
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const AppShowcase = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => (
  <section className="section app-section">
    <div className="container app-layout">
      <Reveal>
        <span className="eyebrow">App coming soon</span>
        <h2>The website now says the honest thing: the app is coming.</h2>
        <p>No fake download promise. Users join the waitlist, follow launch updates, and understand what Khozna is building before the app goes live.</p>
        <div className="store-row">
          <div className="store-badge" aria-label="Google Play coming soon">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" loading="lazy" />
            <span>Coming soon</span>
          </div>
          <button className="btn btn-primary" onClick={onJoinWaitlist}>Get launch update</button>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="people-panel" aria-label="Khozna users">
          <figure>
            <img src="/man.png" alt="Verified property owner" loading="lazy" />
            <figcaption>Verified owner</figcaption>
          </figure>
          <figure>
            <img src="/boy.png" alt="Renter looking for a home" loading="lazy" />
            <figcaption>Serious renter</figcaption>
          </figure>
        </div>
      </Reveal>
    </div>
  </section>
);

const FinalCta = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => (
  <section className="section final-cta">
    <div className="container final-cta-inner">
      <Reveal>
        <span className="eyebrow">Join early</span>
        <h2>Be first when Khozna opens in your area.</h2>
        <p>Renters, owners, students, families, and property managers can join the launch list now.</p>
        <button className="btn btn-primary btn-large" onClick={onJoinWaitlist}>Join the waitlist <ArrowRight size={20} /></button>
      </Reveal>
    </div>
  </section>
);

const HomePage = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => (
  <main>
    <Hero onJoinWaitlist={onJoinWaitlist} />
    <div className="marquee" aria-hidden="true">
      <div>
        <span>No dalal fees</span><span>Direct owner contact</span><span>Verified listings</span><span>Safer renting</span><span>Built for Nepal</span>
        <span>No dalal fees</span><span>Direct owner contact</span><span>Verified listings</span><span>Safer renting</span><span>Built for Nepal</span>
      </div>
    </div>
    <ProblemSection />
    <AppWalkthrough />
    <TrustSection />
    <FeatureSection />
    <AppShowcase onJoinWaitlist={onJoinWaitlist} />
    <FinalCta onJoinWaitlist={onJoinWaitlist} />
  </main>
);

const VisionPage = () => (
  <main className="vision-page">
    <section className="section vision-hero">
      <div className="container vision-layout">
        <Reveal>
          <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
          <span className="eyebrow">The mission</span>
          <h1>Make renting in Nepal direct, transparent, and less stressful.</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="vision-card">
            <h2>What Khozna is really about</h2>
            <p>Khozna is not just a nice website. It is a push against the messy rental culture where renters pay unnecessary fees, owners lose control of communication, and trust is built too late.</p>
            <ul>
              <li><CheckCircle2 size={20} /> Remove unnecessary broker dependency.</li>
              <li><CheckCircle2 size={20} /> Give owners a fair way to list directly.</li>
              <li><CheckCircle2 size={20} /> Build safer rental discovery for Nepali cities.</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  </main>
);

const Footer = ({ openLegal }: { openLegal: (type: LegalType) => void }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand-link brand-link--footer">
            <img src="/original_logo.png" alt="" />
            <span>Khozna</span>
          </Link>
          <p>Direct rentals for Nepal. No middleman, clearer listings, safer contact.</p>
        </div>

        <div className="footer-column">
          <h3>Platform</h3>
          <Link to="/">Home</Link>
          <Link to="/vision">Vision</Link>
          <button onClick={() => openLegal('safety')}>Safe rental guide</button>
          <button onClick={() => openLegal('privacy')}>Privacy policy</button>
          <button onClick={() => openLegal('terms')}>Terms</button>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>
          <a href="tel:+9779705278379"><Phone size={16} /> +977 9705278379</a>
          <a href="mailto:support@khozna.com"><Mail size={16} /> support@khozna.com</a>
          <div className="social-row social-row--footer">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>{item.icon}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>2026 Khozna. Built in Nepal.</span>
        <button onClick={scrollToTop} aria-label="Scroll to top"><ArrowUp size={18} /></button>
      </div>
    </footer>
  );
};

const CustomCursor = () => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 30 });
  const followerX = useSpring(0, { stiffness: 140, damping: 24 });
  const followerY = useSpring(0, { stiffness: 140, damping: 24 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      followerX.set(event.clientX);
      followerY.set(event.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [followerX, followerY, mouseX, mouseY]);

  return (
    <>
      <motion.div className="custom-cursor" style={{ left: mouseX, top: mouseY }} />
      <motion.div className="cursor-follower" style={{ left: followerX, top: followerY }} />
    </>
  );
};

const TopProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  return <motion.div className="top-progress-bar" style={{ scaleX }} />;
};

const AnimatedRoutes = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage onJoinWaitlist={onJoinWaitlist} /></motion.div>} />
        <Route path="/vision" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><VisionPage /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean; type: LegalType }>({ open: false, type: 'terms' });
  const openLegal = (type: LegalType) => setLegalModal({ open: true, type });

  return (
    <Router>
      <ScrollToTop />
      <TopProgressBar />
      <CustomCursor />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <LegalModal isOpen={legalModal.open} type={legalModal.type} onClose={() => setLegalModal((current) => ({ ...current, open: false }))} />
      <Navbar onJoinWaitlist={() => setIsWaitlistOpen(true)} />
      <AnimatedRoutes onJoinWaitlist={() => setIsWaitlistOpen(true)} />
      <Footer openLegal={openLegal} />
    </Router>
  );
}

export default App;
