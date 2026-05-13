import { useState, useEffect, useRef } from "react";

const useParallax = (speed = 0.3) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      setOffset(scrolled * speed);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return [ref, offset];
};

const useScrollReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible]; 
};
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

const RevealBlock = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const ICON_COLORS = {
  urgencia:     { stroke: "#7EB8D4", bg: "rgba(126,184,212,0.12)", border: "rgba(126,184,212,0.5)" },
  prolapso:     { stroke: "#C4906A", bg: "rgba(196,144,106,0.12)", border: "rgba(196,144,106,0.5)" },
  gases:        { stroke: "#A8C5A0", bg: "rgba(168,197,160,0.12)", border: "rgba(168,197,160,0.5)" },
  perdidas:     { stroke: "#D4A0B0", bg: "rgba(212,160,176,0.12)", border: "rgba(212,160,176,0.5)" },
  constipacion: { stroke: "#D4B87A", bg: "rgba(212,184,122,0.12)", border: "rgba(212,184,122,0.5)" },
  miccion:      { stroke: "#9DB8D4", bg: "rgba(157,184,212,0.12)", border: "rgba(157,184,212,0.5)" },
  dolor:        { stroke: "#D4849A", bg: "rgba(212,132,154,0.12)", border: "rgba(212,132,154,0.5)" },
};

const DisorderIcon = ({ type }) => {
  const color = ICON_COLORS[type]?.stroke || "#C4906A";
  const s = { width: 38, height: 38, strokeWidth: 1.5, fill: "none", stroke: color, strokeLinecap: "round", strokeLinejoin: "round", display: "block" };
  if (type === "urgencia") return (
    <svg viewBox="0 0 36 36" style={s}>
      <ellipse cx="18" cy="13" rx="7" ry="9" />
      <path d="M18 22 C14 26 11 29 14 32 C16 34 20 34 22 32 C25 29 22 26 18 22Z" />
      <path d="M14 10 Q18 6 22 10" />
    </svg>
  );
  if (type === "prolapso") return (
    <svg viewBox="0 0 36 36" style={s}>
      <path d="M10 14 C10 9 14 6 18 6 C22 6 26 9 26 14 C26 20 22 24 18 28 C14 24 10 20 10 14Z" />
      <path d="M18 28 L18 33" />
      <path d="M15 31 L18 33 L21 31" />
    </svg>
  );
  if (type === "gases") return (
    <svg viewBox="0 0 36 36" style={s}>
      <path d="M8 20 Q12 14 18 16 Q24 18 28 12" />
      <path d="M25 9 L28 12 L25 13" />
      <path d="M10 26 Q14 22 18 23 Q22 24 26 20" />
    </svg>
  );
  if (type === "perdidas") return (
    <svg viewBox="0 0 36 36" style={s}>
      <circle cx="18" cy="11" r="5" />
      <path d="M10 30 C10 23 26 23 26 30" />
      <path d="M27 19 L30 22 M30 19 L27 22" />
      <path d="M29 14 Q32 17 29 20" />
    </svg>
  );
  if (type === "constipacion") return (
    <svg viewBox="0 0 36 36" style={s}>
      <path d="M12 10 Q10 7 13 6 Q16 5 16 8 Q16 12 19 14 Q24 17 24 22 Q24 28 18 29 Q12 30 11 25 Q10 20 14 18" />
      <circle cx="18" cy="23" r="2" />
    </svg>
  );
  if (type === "miccion") return (
    <svg viewBox="0 0 36 36" style={s}>
      <path d="M12 8 L24 8 L26 16 L10 16 Z" />
      <path d="M10 16 Q10 24 18 26 Q26 24 26 16" />
      <path d="M18 26 L18 31" />
      <line x1="14" y1="12" x2="22" y2="12" />
    </svg>
  );
  if (type === "dolor") return (
    <svg viewBox="0 0 36 36" style={s}>
      <path d="M18 7 C13 7 9 11 9 15 C9 20 13 23 18 30 C23 23 27 20 27 15 C27 11 23 7 18 7Z" />
      <path d="M15 15 L17 17 L21 13" />
    </svg>
  );
  return null;
};

const DisorderCard = ({ d, delay }) => {
  const [hovered, setHovered] = useState(false);
  const colors = ICON_COLORS[d.icon] || ICON_COLORS.prolapso;
  return (
    <RevealBlock delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "1.8rem",
          border: `1px solid ${hovered ? colors.border : "rgba(196,144,106,0.18)"}`,
          borderRadius: "16px",
          background: hovered ? colors.bg : "rgba(255,255,255,0.04)",
          transform: hovered ? "scale(1.055) translateY(-4px)" : "scale(1) translateY(0)",
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          cursor: "default",
          boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.25)` : "none",
        }}
      >
        <div style={{
          marginBottom: "1.2rem",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          display: "inline-block",
        }}>
          <DisorderIcon type={d.icon} />
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.95rem", lineHeight:1.6, color:"#E8D5C8" }}>{d.text}</p>
      </div>
    </RevealBlock>
  );
};

const DISORDERS = [
  { icon: "urgencia",    text: "Urgencia miccional" },
  { icon: "prolapso",    text: "Prolapsos" },
  { icon: "gases",       text: "Dificultad para retener gases" },
  { icon: "perdidas",    text: "Pérdidas de orina al toser, estornudar, reír o correr" },
  { icon: "constipacion",text: "Constipación" },
  { icon: "miccion",     text: "Dolor o dificultad en la micción" },
  { icon: "dolor",       text: "Dolor pélvico y dolor en las relaciones sexuales" },
];

const CONSULT_STEPS = [
  {
    num: "01",
    title: "Entrevista",
    desc: "Charlamos sobre tu historial médico, hábitos, síntomas y dudas en un ambiente cómodo y confidencial.",
  },
  {
    num: "02",
    title: "Evaluación",
    desc: "Evaluamos postura, respiración, diafragma, pelvis y suelo pélvico de forma integral.",
  },
  {
    num: "03",
    title: "Plan de trabajo",
    desc: "Diseñamos objetivos y un tratamiento específico para tus necesidades individuales.",
  },
];

const WHAT_WE_EVALUATE = [
  "Postura y abdomen",
  "Respiración y presión abdominal",
  "Fuerza y coordinación del suelo pélvico",
];


// Leaflet map: carga CSS+JS dinamicamente, sin iframe ni API key
const LeafletMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapRef.current || !window.L) return;
      const L = window.L;
      const lat = -40.8135, lng = -62.9986;
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;background:#6B3A2A;border:3px solid #FAF7F4;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(44,24,16,0.4)"><div style="width:9px;height:9px;background:#FAF7F4;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup("<b style='font-family:DM Sans,sans-serif;color:#2C1810'>Sanatorio Austral</b><br><span style='font-size:0.8rem;color:#6B3A2A'>Alvaro Barros 386, Anexo 1</span>")
        .openPopup();
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "340px", filter: "saturate(0.75) sepia(0.12)" }}
    />
  );
};

export default function App() {
  const [heroRef, heroOffset] = useParallax(0.4);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif", background: "#FAF7F4", color: "#2C1810", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? "1rem 1rem" : "1rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(250,247,244,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(180,140,120,0.2)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B3A2A" }}>
          Julieta Fontana
        </div>
        <a
          href="https://www.instagram.com/lic.julietafontana/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400, fontSize: "0.78rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#6B3A2A", textDecoration: "none",
            padding: "0.45rem 1.2rem",
            border: "1px solid rgba(107,58,42,0.35)",
            borderRadius: "100px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => { e.target.style.background = "#6B3A2A"; e.target.style.color = "#FAF7F4"; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#6B3A2A"; }}
        >
          Instagram
        </a>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(155deg, #FAF7F4 0%, #F2E8E0 40%, #E8D5C8 100%)",
      }}>
        {/* decorative blob */}
        <div style={{
          position: "absolute", width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,120,90,0.12) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: `translate(-50%, calc(-50% + ${heroOffset * 0.2}px))`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", right: "-80px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "rgba(140,80,60,0.07)",
          transform: `translateY(${-heroOffset * 0.15}px)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "10%", left: "-60px",
          width: "220px", height: "220px",
          borderRadius: "50%",
          border: "1px solid rgba(180,120,90,0.2)",
          transform: `translateY(${heroOffset * 0.25}px)`,
          pointerEvents: "none",
        }} />

        <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: isMobile ? "0 1rem" : "0 1.5rem", maxWidth: "760px" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: "0.75rem", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#9B5E42",
            marginBottom: "2rem",
            opacity: 1,
          }}>
            Lic. en Kinesiología &amp; Fisiatría
          </p>
          <h1 style={{
            fontSize: "clamp(3rem, 9vw, 7.5rem)",
            fontWeight: 300, lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
            color: "#2C1810",
            transform: `translateY(${-heroOffset * 0.08}px)`,
            transition: "transform 0.05s linear",
          }}>
            Kinesiología<br />
            <em style={{ fontStyle: "italic", color: "#8B4A32" }}>de suelo pélvico</em>
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300, fontSize: "1.05rem",
            lineHeight: 1.75, color: "#5C3526",
            maxWidth: "480px", margin: "0 auto 3rem",
          }}>
            Una especialidad que busca recuperar el equilibrio y la función del suelo pélvico cuando hay dolor, debilidad o tensión.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:2920267822" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500, fontSize: "0.82rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#FAF7F4", textDecoration: "none",
              padding: "0.9rem 2.2rem",
              background: "#6B3A2A",
              borderRadius: "100px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8B4A32"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#6B3A2A"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Reservá tu turno
            </a>
            <a href="https://www.instagram.com/lic.julietafontana/" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400, fontSize: "0.82rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#6B3A2A", textDecoration: "none",
              padding: "0.9rem 2.2rem",
              border: "1px solid rgba(107,58,42,0.4)",
              borderRadius: "100px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6B3A2A"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(107,58,42,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Seguime en Instagram
            </a>
          </div>
        </div>

        {/* scroll cue */}
        <div style={{
          position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
          opacity: 0.5,
        }}>
          <div style={{ width: "1px", height: "60px", background: "#6B3A2A", animation: "scrollLine 2s ease-in-out infinite" }} />
        </div>
        <style>{`@keyframes scrollLine { 0%,100%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} }`}</style>
      </section>

      {/* WHAT IS IT */}
      <section style={{ padding: "7rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <RevealBlock>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? "3rem" : "5rem",
    alignItems: "center",
  }}
>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#9B5E42", marginBottom:"1.5rem" }}>La especialidad</p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: "2rem", color: "#2C1810" }}>
                ¿Qué es la kinesiología<br /><em style={{ color: "#8B4A32" }}>pelviperineal?</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight:300, fontSize:"1rem", lineHeight:1.85, color:"#5C3526", marginBottom:"1.5rem" }}>
                Es una especialidad kinesiológica enfocada en recuperar el equilibrio y la función del suelo pélvico. A través de evaluación integral y técnicas específicas, abordamos el dolor, la debilidad y la tensión de esta zona fundamental del cuerpo.
              </p>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"1rem", lineHeight:1.85, color:"#5C3526" }}>
                El suelo pélvico es un conjunto de músculos y estructuras que sostiene los órganos pélvicos, participa en la continencia, la función sexual y la estabilidad postural.
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{
                width: "100%", paddingBottom: "110%",
                background: "linear-gradient(135deg, #E8D5C8 0%, #D4B5A0 100%)",
                borderRadius: "60% 40% 50% 60% / 50% 60% 40% 50%",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "6rem" }}>🦴</div>
              </div>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", border: "1px solid rgba(107,58,42,0.25)", borderRadius: "50%" }} />
              <div style={{ position: "absolute", bottom: "30px", left: "-30px", width: "120px", height: "120px", border: "1px solid rgba(107,58,42,0.15)", borderRadius: "50%" }} />
            </div>
          </div>
        </RevealBlock>
      </section>

      {/* WAVE: cream → dark */}
      <div style={{ lineHeight: 0, background: "#FAF7F4", marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,30 C180,80 360,0 540,45 C720,90 900,10 1080,50 C1260,85 1380,20 1440,40 L1440,90 L0,90 Z" fill="#2C1810" />
        </svg>
      </div>

      {/* DISORDERS */}
      <section style={{
        background: "#2C1810",
        padding: "4rem 2rem 6rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "400px", height: "400px",
          borderRadius: "50%",
          background: "rgba(139,74,50,0.15)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <RevealBlock>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#C4906A", marginBottom:"1rem" }}>Señales de alerta</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: "3.5rem", color: "#FAF7F4" }}>
              Alteraciones del<br /><em style={{ color: "#C4906A" }}>suelo pélvico</em>
            </h2>
          </RevealBlock>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.5rem" }}>
            {DISORDERS.map((d, i) => (
              <DisorderCard key={i} d={d} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* WAVE: dark → cream */}
      <div style={{ lineHeight: 0, background: "#2C1810", marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,50 C200,10 400,80 600,40 C800,0 1000,70 1200,35 C1320,15 1400,60 1440,50 L1440,90 L0,90 Z" fill="#FAF7F4" />
        </svg>
      </div>

      {/* CONSULTATION */}
      <section style={{ padding: "5rem 2rem 7rem", maxWidth: "1100px", margin: "0 auto" }}>
        <RevealBlock>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#9B5E42", marginBottom:"1rem" }}>El proceso</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.15, color: "#2C1810" }}>
              ¿Cómo es<br /><em style={{ color: "#8B4A32" }}>la consulta?</em>
            </h2>
          </div>
        </RevealBlock>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "2rem", marginBottom: "5rem" }}>
          {CONSULT_STEPS.map((s, i) => (
            <RevealBlock key={i} delay={i * 120}>
              <div style={{
                padding: "2.5rem 2rem",
                background: "#FAF7F4",
                border: "1px solid rgba(107,58,42,0.12)",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: "-20px", right: "1rem",
                  fontSize: "5rem", fontWeight: 300,
                  color: "rgba(107,58,42,0.06)", lineHeight: 1,
                  fontFamily: "'Cormorant Garamond', serif",
                }}>
                  {s.num}
                </div>
                <div style={{
                  fontFamily:"'DM Sans',sans-serif", fontWeight:500,
                  fontSize:"0.7rem", letterSpacing:"0.15em", textTransform:"uppercase",
                  color:"#9B5E42", marginBottom:"0.8rem",
                }}>Paso {s.num}</div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "1rem", color: "#2C1810" }}>{s.title}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.92rem", lineHeight:1.75, color:"#5C3526" }}>{s.desc}</p>
              </div>
            </RevealBlock>
          ))}
        </div>

        {/* What we evaluate + key messages */}
        <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? "2rem" : "3rem",
    alignItems: "start",
  }}>
          <RevealBlock>
            <div style={{
              padding: "2.5rem",
              background: "#F2E8E0",
              borderRadius: "20px",
            }}>
              <h3 style={{ fontSize: "1.6rem", fontWeight: 300, marginBottom: "1.5rem", color: "#2C1810" }}>
                ¿Qué <em style={{ color: "#8B4A32" }}>evaluamos?</em>
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {WHAT_WE_EVALUATE.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <span style={{ color: "#8B4A32", fontSize: "1.2rem", flexShrink: 0, marginTop: "2px" }}>→</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.95rem", lineHeight:1.6, color:"#5C3526" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.82rem", lineHeight:1.7, color:"#8B4A32", marginTop:"1.5rem", fontStyle:"italic" }}>
                La evaluación puede incluir valoración interna del suelo pélvico, siempre explicada y con tu consentimiento.
              </p>
            </div>
          </RevealBlock>
          <RevealBlock delay={150}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{
                padding: "2rem",
                background: "#2C1810", borderRadius: "16px", color: "#FAF7F4",
              }}>
                <h4 style={{ fontSize: "1.4rem", fontWeight: 300, marginBottom: "0.75rem", lineHeight: 1.2 }}>
                  La evaluación <em style={{ color: "#C4906A" }}>no debe ser dolorosa</em>
                </h4>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.9rem", lineHeight:1.6, color:"#D4B5A0" }}>Y siempre se realiza con tu consentimiento y en un ambiente de total respeto.</p>
              </div>
              <div style={{
                padding: "2rem",
                border: "1px solid rgba(107,58,42,0.2)", borderRadius: "16px",
              }}>
                <h4 style={{ fontSize: "1.4rem", fontWeight: 300, marginBottom: "0.75rem", lineHeight: 1.2, color: "#2C1810" }}>
                  Es normal sentir <em style={{ color: "#8B4A32" }}>ansiedad</em>
                </h4>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.9rem", lineHeight:1.6, color:"#5C3526" }}>Muchas personas llegan a consulta con esta sensación, porque nadie nos explicó cómo es una evaluación de suelo pélvico. Acá te lo cuento todo.</p>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* DIAGONAL: cream → peach */}
      <div style={{ lineHeight: 0, background: "#FAF7F4", marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <polygon points="0,0 1440,60 1440,60 0,60" fill="#F2E8E0" />
        </svg>
      </div>

      {/* SESSIONS */}
      <section style={{ background: "#F2E8E0", padding: "4rem 2rem 6rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <RevealBlock>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#9B5E42", marginBottom:"1rem" }}>El tratamiento</p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.15, color: "#2C1810" }}>
                Así trabajamos<br /><em style={{ color: "#8B4A32" }}>juntas</em>
              </h2>
            </div>
          </RevealBlock>
          <div
  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "2.5rem",
  }}>
            <RevealBlock>
              <div style={{
                padding: "2.5rem",
                background: "#FAF7F4",
                borderRadius: "20px",
                height: "100%",
                boxSizing: "border-box",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"0.72rem",
                  letterSpacing:"0.15em", textTransform:"uppercase",
                  color:"#FAF7F4", background:"#6B3A2A",
                  padding:"0.4rem 1rem", borderRadius:"100px", marginBottom:"1.5rem",
                }}>Primera sesión</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.95rem", lineHeight:1.8, color:"#5C3526" }}>
                  Te explico cómo funciona tu suelo pélvico, evalúo tus hábitos, posturas y síntomas, y te brindo recomendaciones personalizadas desde el primer encuentro.
                </p>
              </div>
            </RevealBlock>
            <RevealBlock delay={120}>
              <div style={{
                padding: "2.5rem",
                background: "#FAF7F4",
                borderRadius: "20px",
                height: "100%",
                boxSizing: "border-box",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"0.72rem",
                  letterSpacing:"0.15em", textTransform:"uppercase",
                  color:"#FAF7F4", background:"#9B5E42",
                  padding:"0.4rem 1rem", borderRadius:"100px", marginBottom:"1.5rem",
                }}>Sesiones siguientes</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.95rem", lineHeight:1.8, color:"#5C3526" }}>
                  Trabajamos con maniobras para relajar y flexibilizar músculos, articulaciones y cicatrices, junto con ejercicios que ayuden a activar, relajar o tomar conciencia de esta zona. También utilizo herramientas y aparatología complementaria para potenciar los resultados.
                </p>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* CREDENTIAL */}
      <section style={{ padding: "5rem 2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <RevealBlock>
          <div style={{
            padding: "3rem 2.5rem",
            border: "1px solid rgba(107,58,42,0.15)",
            borderRadius: "24px",
            position: "relative",
          }}>
            <div style={{
              width: "70px", height: "70px", borderRadius: "50%",
              background: "#F2E8E0",
              margin: "0 auto 1.5rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem",
            }}>🎓</div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#9B5E42", marginBottom:"1rem" }}>Formación</p>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 300, marginBottom: "0.75rem", color: "#2C1810" }}>Julieta Fontana</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.95rem", lineHeight:1.7, color:"#5C3526", marginBottom:"0.5rem" }}>
              Lic. en Kinesiología y Fisiatría<br />
              Especialista en Reeducación de Suelo Pélvico
            </p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.88rem", lineHeight:1.6, color:"#9B5E42" }}>
              Diplomatura Internacional en Fisioterapia Obstétrica<br />
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Noviembre 2025 – Abril 2026 · Argentina &amp; Brasil</span>
            </p>
          </div>
        </RevealBlock>
      </section>

      {/* WAVE: cream → peach before location */}
      <div style={{ lineHeight: 0, background: "#FAF7F4", marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <polygon points="0,0 1440,60 1440,60 0,60" fill="#F2E8E0" />
        </svg>
      </div>

      {/* LOCATION */}
      <section style={{ background: "#F2E8E0", padding: "5rem 2rem 6rem", position: "relative", overflow: "hidden" }}>
        {/* subtle decorative blob */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,144,106,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <RevealBlock>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#9B5E42", marginBottom:"1rem" }}>Dónde encontrarme</p>
              <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.15, color: "#2C1810" }}>
                Ubicación
              </h2>
            </div>
          </RevealBlock>

          <RevealBlock delay={100}>
            <div style={{
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(107,58,42,0.15)",
              boxShadow: "0 8px 40px rgba(44,24,16,0.08)",
              background: "#FAF7F4",
            }}>
              {/* Map – Leaflet renderizado en React, sin iframe ni API key */}
              <LeafletMap />

              {/* Address bar */}
              <div style={{
                padding: isMobile ? "1.6rem 1.5rem" : "2rem 2.5rem",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                gap: "1.2rem",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  {/* pin icon */}
                  <div style={{
                    width: "40px", height: "40px", flexShrink: 0,
                    borderRadius: "50%",
                    background: "rgba(139,74,50,0.1)",
                    border: "1px solid rgba(139,74,50,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: "2px",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B4A32" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"0.92rem", color:"#2C1810", marginBottom:"0.25rem", lineHeight:1.3 }}>
                      Álvaro Barros 386, Anexo 1
                    </p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.82rem", color:"#9B5E42", lineHeight:1.5, letterSpacing:"0.02em" }}>
                      Sanatorio Austral · Viedma, Río Negro
                    </p>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Alvaro+Barros+386,+Viedma,+R%C3%ADo+Negro,+Argentina"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"0.8rem",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    color:"#FAF7F4", textDecoration:"none",
                    padding:"0.75rem 1.8rem",
                    background:"#6B3A2A",
                    borderRadius:"100px",
                    whiteSpace:"nowrap",
                    transition:"all 0.3s ease",
                    display:"inline-flex", alignItems:"center", gap:"0.5rem",
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background="#8B4A32"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(107,58,42,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#6B3A2A"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                  Cómo llegar
                </a>
              </div>
            </div>
          </RevealBlock>
        </div>
      </section>

      {/* WAVE: peach → dark before CTA */}
      <div style={{ lineHeight: 0, background: "#F2E8E0", marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,20 C300,80 600,0 900,50 C1100,85 1300,15 1440,35 L1440,80 L0,80 Z" fill="#2C1810" />
        </svg>
      </div>

      {/* CTA */}
      <section style={{
        background: "#2C1810",
        padding: "5rem 2rem 7rem",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "600px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,144,106,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <RevealBlock>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.75rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"#C4906A", marginBottom:"1.5rem" }}>Contacto</p>
          <h2 style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "1.5rem", color: "#FAF7F4" }}>
            Desde la kinesiología<br /><em style={{ color: "#C4906A" }}>de suelo pélvico</em><br />contamos con las herramientas<br />para ayudarte
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"1rem", lineHeight:1.7, color:"#D4B5A0", maxWidth:"480px", margin:"0 auto 3rem" }}>
            Si tenés dudas o querés más información, no dudes en escribirme o llamarme.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", alignItems: "center" }}>
            <a href="tel:2920267822" style={{
              fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:"0.88rem",
              letterSpacing:"0.08em", textTransform:"uppercase",
              color:"#2C1810", textDecoration:"none",
              padding:"1rem 2.8rem",
              background:"#C4906A",
              borderRadius:"100px",
              transition:"all 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#D4A07A"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#C4906A"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              📞 2920 267822
            </a>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.88rem", color:"rgba(212,181,160,0.7)", lineHeight:1.5 }}>
              📍 Alvaro Barros 386 · Anexo 1, Sanatorio Austral
            </p>
            <a
              href="https://www.instagram.com/lic.julietafontana/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:"0.82rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:"#C4906A", textDecoration:"none",
                padding:"0.8rem 2rem",
                border:"1px solid rgba(196,144,106,0.4)",
                borderRadius:"100px",
                transition:"all 0.3s ease",
                marginTop:"0.5rem",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#C4906A"; e.currentTarget.style.background="rgba(196,144,106,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(196,144,106,0.4)"; e.currentTarget.style.background="transparent"; }}
            >
              @lic.julietafontana
            </a>
          </div>
        </RevealBlock>
      </section>

      {/* WAVE: dark → cream before footer */}
      <div style={{ lineHeight: 0, background: "#2C1810", marginBottom: "-2px" }}>
        <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }} preserveAspectRatio="none">
          <path d="M0,0 C400,50 800,0 1200,40 C1320,48 1400,20 1440,30 L1440,50 L0,50 Z" fill="#FAF7F4" />
        </svg>
      </div>

      {/* FOOTER */}
      <footer style={{
        padding: "2rem",
        textAlign: "center",
        background: "#FAF7F4",
      }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:"0.78rem", color:"#9B5E42", letterSpacing:"0.05em" }}>
          © 2026 Julieta Fontana · Kinesiología de Suelo Pélvico · Viedma, Río Negro
        </p>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <style>{`
        @keyframes waPulse {
          0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @keyframes waEntrance {
          from { opacity: 0; transform: scale(0.5) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .wa-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          animation: waPulse 2.2s ease-out infinite, waEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.2s both;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease;
          cursor: pointer;
        }
        .wa-btn:hover {
          transform: scale(1.12);
          background: #20C05A;
          animation: waEntrance 0s; 
        }
        .wa-tooltip {
          position: fixed;
          bottom: 2.45rem;
          right: 5.5rem;
          z-index: 998;
          background: #2C1810;
          color: #FAF7F4;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 300;
          letter-spacing: 0.03em;
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          white-space: nowrap;
          opacity: 0;
          transform: translateX(8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
          pointer-events: none;
        }
        .wa-btn:hover ~ .wa-tooltip,
        .wa-wrapper:hover .wa-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
        .wa-tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #2C1810;
          border-right: none;
        }
      `}</style>

      <div className="wa-wrapper" style={{ position: "fixed", bottom: 0, right: 0, zIndex: 999 }}>
        <a
          className="wa-btn"
          href="https://wa.me/542920267822?text=Hola%20Julieta%2C%20me%20gustar%C3%ADa%20sacar%20un%20turno%20para%20kinesiolog%C3%ADa%20de%20suelo%20p%C3%A9lvico."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.655 4.805 1.8 6.82L2 30l7.38-1.775A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Z" fill="white"/>
            <path d="M22.5 19.5c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" fill="#25D366"/>
          </svg>
        </a>
        <div className="wa-tooltip">¡Escribime por WhatsApp!</div>
      </div>
    </div>
  );
}
