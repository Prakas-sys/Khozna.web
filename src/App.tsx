import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';

// --- Components ---

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} style={{ position: 'relative', overflow: 'hidden', width: 'fit-content' }}>
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
    <section ref={targetRef} style={{ height: '400vh', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          
          {/* Left Side: Storytelling */}
          <div style={{ position: 'relative', height: '50vh' }}>
            <motion.div style={{ position: 'absolute', opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}>
              <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 01</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>DISCOVER<br/>BEYOND.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>
                Browse a curated feed of verified properties. No brokers, no noise. Just real places for real people.
              </p>
            </motion.div>

            <motion.div style={{ position: 'absolute', opacity: screen2Opacity }}>
              <span style={{ color: '#10B981', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 02</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>DIRECT<br/>CONNECTION.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: '1.8' }}>
                Skip the middleman. Chat directly with landlords in real-time. Negotiate, ask, and finalize without a single commission fee.
              </p>
            </motion.div>

            <motion.div style={{ position: 'absolute', opacity: screen3Opacity }}>
              <span style={{ color: '#F59E0B', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>Step 03</span>
              <h2 className="section-title" style={{ marginTop: '1rem' }}>VERIFIED<br/>TRUST.</h2>
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

            {/* Floating Elements */}
            <motion.div 
              style={{ position: 'absolute', top: '10%', right: '-15%', opacity: screen2Opacity }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
                <MessageSquare color="var(--primary)" />
              </div>
            </motion.div>

            <motion.div 
              style={{ position: 'absolute', bottom: '10%', left: '-15%', opacity: screen3Opacity }}
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
                <ShieldCheck color="#10B981" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

const BrandPhilosophy = () => {
  return (
    <section style={{ padding: '15rem 0', background: '#050505', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', margin: '0 auto' }}>THE ZERO<br/>MOVEMENT.</h2></Reveal>
        </div>

        <div className="grid-3">
           <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <Zap size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Zero Hidden Fees</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>We removed the commission layer entirely. Khozna is built to be a public utility for the people of Nepal.</p>
           </div>
           
           <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', border: '1px solid var(--primary)', textAlign: 'center' }}>
              <Cpu size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Next-Gen Tech</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Powered by advanced matching algorithms and real-time mapping to find your perfect sanctuary.</p>
           </div>

           <div className="glass" style={{ padding: '4rem 3rem', borderRadius: '40px', textAlign: 'center' }}>
              <Layers size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Transparent KYC</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>Safety isn't a feature, it's our foundation. Every landlord undergoes a rigorous verification process.</p>
           </div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <Reveal><span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '2rem', display: 'block' }}>NEPAL'S #1 RENTAL PLATFORM</span></Reveal>
        <h1 className="hero-title">
          <Reveal>REDEFINING</Reveal>
          <Reveal delay={0.1}><span className="text-gradient">NEPALESE RENTAL.</span></Reveal>
        </h1>
        <Reveal delay={0.3}>
          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
             <MagneticElement><button className="btn-primary" style={{ padding: '1.2rem 3rem' }}>Explore App <ArrowRight size={20} /></button></MagneticElement>
             <button className="btn-outline" style={{ padding: '1.2rem 3rem' }}>The Vision</button>
          </div>
        </Reveal>
      </div>

      {/* Abstract Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
         <div style={{ position: 'absolute', top: '20%', left: '10%', width: '30vw', height: '30vw', background: 'var(--primary-glow)', filter: 'blur(150px)', borderRadius: '50%' }} />
         <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40vw', height: '40vw', background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(150px)', borderRadius: '50%' }} />
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
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      followerX.set(e.clientX);
      followerY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div className="custom-cursor" style={{ left: mouseX, top: mouseY }} />
      <motion.div className="cursor-follower" style={{ left: followerX, top: followerY }} />
    </>
  );
};

function App() {
  return (
    <div style={{ position: 'relative', background: '#000' }}>
      <CustomCursor />
      
      <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '2rem 4rem', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo-box">
        <img src="/original_logo.png" style={{ height: '32px', objectFit: 'contain' }} alt="KHOZNA Icon" />
        <span className="logo-text">KHOZNA</span>
      </div>
        <div style={{ display: 'flex', gap: '3rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
          <a href="#" className="nav-link">The Platform</a>
          <a href="#" className="nav-link">Vision</a>
          <a href="#" className="nav-link">Contact</a>
        </div>
        <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Get The App</button>
      </nav>

      <Hero />
      
      {/* Brand Marquee */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '3rem 0', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ display: 'flex', gap: '6rem', whiteSpace: 'nowrap', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '8px', opacity: 0.2 }}
        >
          {[1,2,3,4,5].map(i => (
            <React.Fragment key={i}>
              <span>KHOZNA BRAND</span>
              <span>DIRECT CHAT</span>
              <span>ZERO COMMISSION</span>
              <span>VERIFIED OWNERS</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      <AppWalkthrough />
      <BrandPhilosophy />

      {/* Final Call to Action - Representation style */}
      <section style={{ padding: '15rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
         <div className="container">
            <Reveal><h2 className="section-title" style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', lineHeight: 0.8, marginBottom: '4rem' }}>JOIN THE<br/>REVOLUTION.</h2></Reveal>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.8' }}>
              We're not just building an app. We're building the future of how people live and connect in Nepal.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
               <img src="/original_logo.png" style={{ height: '60px', filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
            </div>
         </div>
         {/* Background Glow */}
         <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', background: 'var(--primary-glow)', filter: 'blur(200px)', borderRadius: '50%', opacity: 0.3, zIndex: -1 }} />
      </section>

      {/* Minimal Footer */}
      <footer style={{ padding: '8rem 0 4rem', background: '#000', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6rem' }}>
            <div>
              <img src="/logo.png" style={{ height: '32px', marginBottom: '2rem' }} alt="Khozna" />
              <p style={{ color: 'var(--text-dim)', maxWidth: '300px', lineHeight: '1.8' }}>The premier rental representation platform for Nepal's modern generation.</p>
            </div>
            <div style={{ display: 'flex', gap: '6rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Socials</span>
                  <a href="#" className="footer-link">Instagram</a>
                  <a href="#" className="footer-link">LinkedIn</a>
                  <a href="#" className="footer-link">Facebook</a>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'white', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Platform</span>
                  <a href="#" className="footer-link">The App</a>
                  <a href="#" className="footer-link">KYC Policy</a>
                  <a href="#" className="footer-link">Privacy</a>
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
