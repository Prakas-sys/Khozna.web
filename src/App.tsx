import React, { useEffect, useState, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';
// --- Components ---

// GOOGLE SCRIPT 'WEB APP' URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyhAKH-8IQxdzTegL5_c8kNtG5cTdl5uffnQN1R8AdWp89A12NH0b0OBA9O15NGIcuC/exec";

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
      // Send all data to Google Sheets via Apps Script
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass"
            style={{ width: '100%', maxWidth: '500px', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem)', borderRadius: '32px', textAlign: 'center', position: 'relative' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.5 }}
            >
              ✕
            </button>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ width: '60px', height: '60px', background: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 color="white" size={32} />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>USER VERIFIED</h3>
                <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', marginBottom: '2rem' }}>You are now officially on the Khozna early access list. Follow us for the launch date.</p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <a href="https://www.instagram.com/khozna_/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}><Instagram size={24} /></a>
                  <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}><Linkedin size={24} /></a>
                  <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}><Facebook size={24} /></a>
                </div>
              </motion.div>
            ) : (
              <>
                <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Identity Verification</span>
                <h3 style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', fontWeight: 900, marginTop: '1rem', marginBottom: '1.5rem' }}>JOIN THE<br />ECOSYSTEM.</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: 'clamp(1.5rem, 5vw, 3rem)', lineHeight: '1.6' }}>Enter your details to get verified for early access to Nepal's #1 rental platform.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    required
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'white', fontSize: '1rem', outline: 'none' }}
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    required
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'white', fontSize: '1rem', outline: 'none' }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1.2rem 1.5rem', borderRadius: '16px', color: 'white', fontSize: '1rem', outline: 'none' }}
                  />
                  {status === "error" && (
                    <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '-0.5rem' }}>Something went wrong. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', background: 'var(--primary)', fontWeight: 800 }}
                    disabled={status === "loading"}
                  >
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

// --- App Showcase Sections ---

const AppWalkthrough = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const screen1Scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const screen1Opacity = useTransform(scrollYProgress, [0.2, 0.25], [1, 0]);

  const screen2Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.5, 0.55], [0, 1, 1, 0]);
  const screen2Y = useTransform(scrollYProgress, [0.25, 0.3], [100, 0]);

  const screen3Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.8, 0.85], [0, 1, 1, 0]);
  const screen3Y = useTransform(scrollYProgress, [0.55, 0.6], [100, 0]);

  return (
    <section ref={targetRef} className="walkthrough-container" style={{ background: '#000', position: 'relative', zIndex: 1 }}>
      <div className="walkthrough-sticky" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="container walkthrough-grid grid-2" style={{ alignItems: 'center' }}>

          {/* Left Side: Storytelling */}
          <div className="walkthrough-text-side" style={{ position: 'relative', height: '50vh' }}>
            <motion.div style={{ position: 'absolute', opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 01</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>DISCOVER<br />BEYOND.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>
                Browse a curated feed of verified properties. No brokers, no noise. Just real places for real people.
              </p>
            </motion.div>

            <motion.div style={{ position: 'absolute', opacity: screen2Opacity }}>
              <span style={{ color: '#10B981', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 02</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>DIRECT<br />CONNECTION.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>
                Skip the middleman. Chat directly with landlords in real-time. Negotiate, ask, and finalize without a single commission fee.
              </p>
            </motion.div>

            <motion.div style={{ position: 'absolute', opacity: screen3Opacity }}>
              <span style={{ color: '#F59E0B', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 03</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>VERIFIED<br />TRUST.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>
                Our bank-grade KYC verification ensures that every user—landlord or tenant—is exactly who they say they are.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Phone Morphing */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <motion.div className="phone-mockup" style={{ scale: screen1Scale }}>
              <motion.img src="/Home screeen.jpeg" className="phone-screen" style={{ opacity: screen1Opacity }} />
              <motion.img src="/meesage setion.jpeg" className="phone-screen" style={{ opacity: screen2Opacity, position: 'absolute', top: 0, left: 0, y: screen2Y }} />
              <motion.img src="/kyc screen.jpeg" className="phone-screen" style={{ opacity: screen3Opacity, position: 'absolute', top: 0, left: 0, y: screen3Y }} />
            </motion.div>

            {/* Floating Elements removed for cleaner look */}
          </div>

        </div>
      </div>
    </section>
  );
};

const BrandPhilosophy = () => {
  return (
    <section style={{ padding: 'clamp(5rem, 15vh, 15rem) 0', background: '#050505', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', margin: '0 auto' }}>THE NEW WAY<br />TO RENT.</h2></Reveal>
        </div>

        <div className="grid-3">
          <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
            <Zap size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>No Commission</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Stop paying extra money to middle-men. Khozna connects you directly to the owner for $0 commission.</p>
          </div>

          <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', border: '1px solid var(--primary)', textAlign: 'center' }}>
            <Cpu size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Direct Chat</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>No more brokers. Chat directly with the house owner inside our app and close the deal faster.</p>
          </div>

          <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
            <Layers size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>100% Verified</h3>
            <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>We manually check every house and every owner. If it's on Khozna, it's real and it's safe.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
  return (
    <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', zIndex: 100 }}>

      {/* Cinematic Background Video Layer restored - only the video, no overlays */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, filter: 'brightness(0.8) contrast(1.1)' }}
        >
          <source src="/valley of KTM.mp4" type="video/mp4" />
        </video>
      </div>

      <div style={{ textAlign: 'center', zIndex: 10, width: '100%' }}>
        <h1 className="hero-title">
          <span className="hero-line">
            <Reveal>#1 NEPAL'S TRUSTED</Reveal>
          </span>
          <span className="hero-line">
            <Reveal delay={0.1}><span className="text-gradient">RENTAL PLATFORM.</span></Reveal>
          </span>
        </h1>
        <Reveal delay={0.3}>
          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }} className="hero-buttons">
            <MagneticElement>
              <button
                onClick={onJoinWaitlist}
                className="btn-primary"
                style={{ padding: '1.2rem 3rem' }}
              >
                JOIN NOW <ArrowRight size={20} />
              </button>
            </MagneticElement>
            <button className="btn-outline" style={{ padding: '1.2rem 3rem' }}>The Vision</button>
          </div>
        </Reveal>
      </div>

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}
      >
        <div style={{ width: '30px', height: '50px', border: '2px solid white', borderRadius: '15px', position: 'relative' }}>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '4px', height: '10px', background: 'white', borderRadius: '2px', position: 'absolute', top: '10px', left: '50%', marginLeft: '-2px' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

const CustomCursor = () => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28, mass: 0.5 });
  const followerX = useSpring(0, { stiffness: 150, damping: 25, mass: 0.1 });
  const followerY = useSpring(0, { stiffness: 150, damping: 25, mass: 0.1 });

  useEffect(() => {
    // Only track mouse on devices with a cursor
    if (window.matchMedia("(pointer: fine)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        followerX.set(e.clientX);
        followerY.set(e.clientY);
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

  return (
    <div style={{ position: 'relative', background: '#000' }}>
      <CustomCursor />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />

      <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '1rem 4rem', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo-box">
          <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
          <span className="logo-text">KHOZNA</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
          <a href="#" className="nav-link">The Platform</a>
          <a href="#" className="nav-link">Vision</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <button
          onClick={() => setIsWaitlistOpen(true)}
          className="glass nav-btn"
          style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          JOIN FREE
        </button>
      </nav>

      <div className="hero-section">
        <Hero onJoinWaitlist={() => setIsWaitlistOpen(true)} />
      </div>

      {/* Brand Marquee */}
      <div className="marquee-container" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '3rem 0', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ display: 'flex', gap: '6rem', whiteSpace: 'nowrap', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '8px', opacity: 0.2 }}
        >
          {[1, 2, 3, 4, 5].map(i => (
            <React.Fragment key={i}>
              <span>NO SCAMS</span>
              <span>ZERO COMMISSION</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <AppWalkthrough />
      <BrandPhilosophy />

      {/* Final Call to Action - Representation style */}
      <section style={{ padding: 'clamp(6rem, 20vh, 15rem) 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 12vw, 10rem)', lineHeight: 0.8, marginBottom: '4rem' }}>JOIN THE<br />REVOLUTION.</h2></Reveal>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.8', padding: '0 1rem' }}>
            We're not just building an app. We're building the future of how people live and connect in Nepal.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <img src="/original_logo.png" style={{ height: '80px', objectFit: 'contain' }} alt="KHOZNA Quality Stamp" />
          </div>
        </div>
        {/* Background Glow */}
        <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', background: 'var(--primary-glow)', filter: 'blur(200px)', borderRadius: '50%', opacity: 0.3, zIndex: -1 }} />
      </section>

      {/* Minimal Footer */}
      <footer id="contact" style={{ padding: 'clamp(4rem, 10vh, 8rem) 0 4rem', background: '#000', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6rem' }}>
            <div>
              <div className="logo-box" style={{ marginBottom: '1.5rem' }}>
                <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
                <span className="logo-text">KHOZNA</span>
              </div>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', marginBottom: '0.5rem' }}>#1 NEPAL'S TRUSTED RENTAL PLATFORM</h5>
              <p style={{ color: 'var(--text-dim)', maxWidth: '300px', lineHeight: '1.6', fontSize: '0.9rem' }}>
                FIND YOUR NEXT HOME.<br />NO MIDDLEMAN.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Socials</span>
                <a href="https://www.instagram.com/khozna_/" target="_blank" rel="noopener noreferrer" className="footer-link">Instagram</a>
                <a href="https://www.linkedin.com/company/khozna/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
                <a href="https://www.facebook.com/profile.php?id=61587497082072" target="_blank" rel="noopener noreferrer" className="footer-link">Facebook</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Platform</span>
                <a href="#" className="footer-link">The App</a>
                <a href="#" className="footer-link">KYC Policy</a>
                <a href="#" className="footer-link">Privacy</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact</span>
                <a href="https://wa.me/9705278379" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} /> 9705278379
                </a>
                <a href="mailto:khoznaapp@gmail.com" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} /> khoznaapp@gmail.com
                </a>
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
    </div>
  );
}

export default App;
