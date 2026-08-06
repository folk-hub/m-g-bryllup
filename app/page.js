'use client';

import { useEffect, useRef, useState } from 'react';

// Prefix for static assets — matches basePath in next.config.mjs so images
// resolve correctly on GitHub Pages project sites (and stays empty locally).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

const WEDDING_DATE = new Date('2027-06-19T13:15:00');

const RSVP_FORM_URL = 'https://forms.gle/CYBswznUAVntDF9x5';

// Seksjoner som ennå ikke er klare. Sett til true når innholdet skal avsløres —
// seksjonen dukker opp i menyen og på siden, og seglet forsvinner av seg selv.
const REVEALED = {
  program: false,
  kleskode: false,
  gaver: false,
  overnatting: false,
  toastmaster: false,
  faq: false,
};

const NAV_ITEMS = [
  { id: 'om-oss', label: 'Om oss' },
  { id: 'praktisk', label: 'Praktisk' },
  { id: 'program', label: 'Program', key: 'program' },
  { id: 'kleskode', label: 'Kleskode', key: 'kleskode' },
  { id: 'faq', label: 'FAQ', key: 'faq' },
  { id: 'rsvp', label: 'RSVP' },
];

// Teaser-kortene for det som fortsatt er forseglet.
const SEALED = [
  {
    key: 'program',
    title: 'Slik blir dagen',
    hint: 'Vielse, mottakelse, festmiddag — og en brudevals vi ikke røper riktig ennå.',
  },
  {
    key: 'kleskode',
    title: 'Kleskode',
    hint: 'Du slipper å gjette. Men ikke helt ennå.',
  },
  {
    key: 'gaver',
    title: 'Ønskeliste',
    hint: 'Din tilstedeværelse er uansett den beste gaven.',
  },
  {
    key: 'overnatting',
    title: 'Hvor bor jeg?',
    hint: 'Seng, frokost og kort vei til festen. Adressen kommer.',
  },
  {
    key: 'toastmaster',
    title: 'Toastmaster',
    hint: 'Noen skal holde i trådene den kvelden. Navnet røpes senere.',
  },
  {
    key: 'faq',
    title: 'FAQ',
    hint: 'Svar på det du lurer på — og på noe du ikke visste du lurte på.',
  },
];

function getRemaining() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
    mins: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
    secs: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
  };
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item anim-fade-up${open ? ' open' : ''}`}>
      <div className="faq-q" onClick={() => setOpen((v) => !v)}>
        {question}
        <span className="faq-toggle">+</span>
      </div>
      <div className="faq-a">{answer}</div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showPlay, setShowPlay] = useState(true);
  const videoRef = useRef(null);

  // Countdown
  useEffect(() => {
    setMounted(true);
    const update = () => setTime(getRemaining());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Nav background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-reveal animations
  useEffect(() => {
    const els = document.querySelectorAll(
      '.anim-fade-up, .anim-fade-left, .anim-fade-right, .anim-scale, .stagger'
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const playVideo = () => {
    videoRef.current?.play();
  };

  const countdownDone = mounted && time === null;
  const sealed = SEALED.filter((s) => !REVEALED[s.key]);
  const anySealed = sealed.length > 0;

  return (
    <>
      {/* NAV */}
      <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href="#hero" className="nav-logo">Miriam &amp; Gjermund</a>
          <button
            className="hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Meny"
          >
            <span></span><span></span><span></span>
          </button>
          <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="navLinks">
            {NAV_ITEMS.filter((item) => !item.key || REVEALED[item.key]).map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={closeMenu}>{item.label}</a>
              </li>
            ))}
            {anySealed && (
              <li><a href="#kommer" onClick={closeMenu}>Kommer</a></li>
            )}
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="hero-bg">
          <img className="hero-bg-img" src={`${BASE}/foto4.jpg`} alt="" aria-hidden="true" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <svg className="hero-ornament" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" />
            <path d="M60 28 C60 28 49 40 49 56 C49 67 54 72 60 74 C66 72 71 67 71 56 C71 40 60 28 60 28Z" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
            <path d="M32 60 C32 60 47 54 56 60 C47 66 32 60 32 60Z" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
            <path d="M88 60 C88 60 73 54 64 60 C73 66 88 60 88 60Z" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
            <path d="M40 40 C40 40 51 48 55 56 C49 50 40 40 40 40Z" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
            <path d="M80 40 C80 40 69 48 65 56 C71 50 80 40 80 40Z" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
            <circle cx="60" cy="60" r="3" fill="rgba(232,213,196,0.6)" />
            <path d="M54 87 Q60 96 66 87" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
            <path d="M48 83 Q60 99 72 83" stroke="rgba(232,213,196,0.8)" strokeWidth="0.8" fill="none" />
          </svg>

          <h1 className="hero-names">
            Miriam
            <span className="hero-amp">&amp;</span>
            Gjermund
          </h1>
          <p className="hero-date">19 · Juni · 2027 &nbsp;·&nbsp; Kristiansand</p>
          <div className="hero-divider"></div>
          <p className="hero-tagline">Sammen feirer vi kjærligheten!</p>
        </div>

        <div className="hero-scroll">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="0.5" y="0.5" width="15" height="23" rx="7.5" stroke="white" strokeOpacity="0.5" />
            <circle cx="8" cy="7" r="2" fill="white" fillOpacity="0.7">
              <animate attributeName="cy" values="7;14;7" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span>Scroll</span>
        </div>
      </section>

      {/* COUNTDOWN */}
      <div className="countdown-bar">
        <div className="countdown-inner stagger" id="countdown">
          {countdownDone ? (
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.8rem', gridColumn: '1/-1' }}>
              I dag er den store dagen!
            </div>
          ) : (
            <>
              <div className="cd-unit"><span className="cd-number">{time ? time.days : '—'}</span><span className="cd-label">Dager</span></div>
              <div className="cd-unit"><span className="cd-number">{time ? time.hours : '—'}</span><span className="cd-label">Timer</span></div>
              <div className="cd-unit"><span className="cd-number">{time ? time.mins : '—'}</span><span className="cd-label">Minutter</span></div>
              <div className="cd-unit"><span className="cd-number">{time ? time.secs : '—'}</span><span className="cd-label">Sekunder</span></div>
            </>
          )}
        </div>
      </div>

      {/* OM OSS — sentrert intro + bildegalleri */}
      <section id="om-oss">
        <div className="omoss-centered">
          <div className="anim-fade-up">
            <span className="section-label">Vår historie</span>
            <h2 className="section-title">Om oss</h2>
            <div className="section-divider"></div>
            <div className="intro-copy">
              <p className="large">Vi er Miriam og Gjermund — og vi er veldig glade for at du er her! For de av dere som ikke kjenner oss som par, her er den korte versjonen.</p>
              <p>Vi møttes, vi ble forelsket — og nå skal vi gifte oss. Enkelt og utrolig.</p>
            </div>
          </div>
          <div className="omoss-gallery stagger">
            <div className="omoss-gallery-img"><img src={`${BASE}/omoss_baat.jpg`} alt="Miriam og Gjermund på båt" /></div>
            <div className="omoss-gallery-img"><img src={`${BASE}/omoss_ape.jpg`} alt="Miriam og Gjermund på tur" /></div>
          </div>
        </div>
      </section>

      {/* STORY SECTIONS */}
      <div className="story-section">
        <div className="story-inner">

          {/* Hvordan vi møttes */}
          <div className="story-grid anim-fade-up">
            <div className="story-text">
              <h3>Hvordan vi møttes</h3>
              <p>Vi møttes på Åsane folkehøyskole i Bergen. Det tok ikke lang tid før vi fant tonen, og før vi visste ordet av det så lå vi forelsket på Statsraad Lehmkuhl utenfor Spania og tittet opp på stjernehimmelen. Selv med en sjøsyk Miriam var øyeblikket for perfekt til at Gjermund kunne la det gå til spille. Natten 8. september 2021 ble vi offisielt sammen.</p>
              <p>Videre gikk turen til Trondheim for studier, og etter ett år i Trondheim flyttet vi sammen til leiligheten vår på Persaunet.</p>
            </div>
            <div className="story-photo-wrap">
              <img src={`${BASE}/foto5.jpg`} alt="Miriam og Gjermund" />
              <div className="caption">Fra første tur til Ungarn sammen</div>
            </div>
          </div>

          {/* Frieriet */}
          <div className="story-grid text-right frieri-grid anim-fade-up" style={{ marginTop: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            <div className="story-text">
              <h3>Frieriet</h3>
              <p>Gjermund snublet over en annonse som lette etter noen som kunne tenke seg å fri. Slik som natten på Statsraad Lehmkuhl, så var dette også en sjanse han bare måtte ta. Etter en lengre intervjuprosess, med flere runder der han konkurrerte med utallige friere, ble Gjermund og hans visjon valgt. Grunnen til at Gjermund ble valgt var måten han snakket om Miriam på.</p>
              <p>Etterpå kom en hektisk periode med forberedelser, planlegging og koordinering for å sikre at Miriam ikke fant ut av hva som skulle skje, samtidig som at hun kom seg på riktig sted til riktig tid. Her ble både mor og venninner satt i spill.</p>
              <p>Fra Miriam sitt synspunkt ble det slik: Miriam ble spurt av en venninne, Mariell, om hun ville bli med på en reklamefilm til Posten da det hadde vært noe frafall til rollene de trengte. Rollene gikk ut på en sommerkampanje som trengte et par. Miriam, så spontan som hun er (med nok press fra Mariell og mor), sa selvfølgelig ja. Etterpå kom den vanskelige oppgaven å overbevise Gjermund til å bli med på en slik reklamefilm, og mor om å kutte ferien kort. De sa selvfølgelig ja og var med på å organisere turen til Oslo. På dagen til frieriet var Gjermund og Miriam adskilt for sminke og kostymer, og Miriam ble fortalt at hun skulle møte Gjermund og resten av teamet nede med Aker brygge. Men først måtte vi bare innom butikken og hente en pakke…</p>
            </div>
            <div className="frieri-media">
              <div className="story-photo-wrap">
              <video
                ref={videoRef}
                controls
                playsInline
                onPlay={() => setShowPlay(false)}
                onPause={() => setShowPlay(true)}
                onEnded={() => setShowPlay(true)}
                style={{ width: '100%', borderRadius: '2px', display: 'block', maxHeight: '600px', objectFit: 'cover' }}
              >
                <source src={`${BASE}/frieri_web.mp4`} type="video/mp4" />
              </video>
              <button
                type="button"
                className={`video-play-btn${showPlay ? '' : ' hidden'}`}
                onClick={playVideo}
                aria-label="Spill av filmen"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
                <div className="caption">Posten fikk frieri-æren</div>
              </div>
              <div className="frieri-thumbs">
                <div className="frieri-thumb"><img src={`${BASE}/frieri_ja.jpg`} alt="Miriam sier ja" /></div>
                <div className="frieri-thumb"><img src={`${BASE}/frieri_fyrtaarn.jpg`} alt="Miriam og Gjermund" style={{ objectPosition: 'center top' }} /></div>
              </div>
            </div>
          </div>

          {/* Litt om oss */}
          <div className="person-strip anim-fade-up" style={{ marginTop: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            <div className="person-panel">
              <div className="person-head">
                <div className="person-panel-name">Miriam</div>
                <div className="person-portrait">
                  <img className="portrait-main" src={`${BASE}/portrett_miriam.jpg`} alt="Miriam" style={{ objectPosition: 'center 54%', transform: 'scale(1.65)', transformOrigin: 'center 54%' }} />
                  <img className="portrait-hover" src={`${BASE}/miriam_barn.jpg`} alt="Miriam som barn" />
                </div>
              </div>
              <p style={{ fontSize: '0.95rem' }}>Miriam er et etterlengtet barn. Mamma og pappa fikk holde henne først da hun var 7 måneder gammel i Nanchang, Kina. Hun er nysgjerrig, sosial og lojal. Hun elsker å danse, og ballett har vært en viktig del av oppveksten hennes. Hun er en globetrotter som har reist med CISV og andre utvekslingsprosjekter, og fant heldigvis en perfekt reisepartner, venn og kjæreste i Gjermund.</p>
            </div>
            <div className="person-panel">
              <div className="person-head">
                <div className="person-panel-name">Gjermund</div>
                <div className="person-portrait">
                  <img className="portrait-main" src={`${BASE}/portrett_gjermund.jpg`} alt="Gjermund" style={{ objectPosition: 'center 53%', transform: 'scale(2.05)', transformOrigin: 'center 53%' }} />
                  <img className="portrait-hover" src={`${BASE}/gjermund_barn.jpg`} alt="Gjermund som barn" />
                </div>
              </div>
              <p style={{ fontSize: '0.95rem' }}>Gjermund er en ekte hedemarking, oppvokst 3 km fra Hamar, i Stange kommune. Han har administrert massevis av prosjekter gjennom hele livet, fra biloppstillinger og legobyer til playmoborger og dinosaurutgravinger. Ikke rart det ble ingeniør av han der! Omsorgsfull og god mot søster, mor, far og hund — og aller mest mot Miriam.</p>
            </div>
          </div>

        </div>
      </div>

      {/* PRAKTISK INFO */}
      <section id="praktisk">
        <div className="praktisk-inner">
          <div className="praktisk-header anim-fade-up">
            <span className="section-label">Praktisk informasjon</span>
            <h2 className="section-title">Tid &amp; sted</h2>
            <div className="section-divider"></div>
            <p>Her finner du alt du trenger å vite for den store dagen.</p>
          </div>
          <div className="venue-grid stagger">
            <div className="venue-card">
              <span className="venue-icon" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M10 4h4" />
                  <path d="M12 6L5 11v10h14V11L12 6z" />
                  <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
                </svg>
              </span>
              <div className="venue-name">Randesund kirke</div>
              <p className="venue-detail">Vielse</p>
              <p className="venue-detail">Lørdag 19. juni 2027 &nbsp;·&nbsp; Kl. 13:15</p>
              <a className="venue-link" href="https://maps.google.com/?q=Randesund+kirke,+Kristiansand" target="_blank" rel="noopener">Veibeskrivelse →</a>
            </div>
            <div className="venue-card">
              <span className="venue-icon" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3l1 8a3 3 0 0 0 6 0l1-8" />
                  <path d="M7 3h10" />
                  <path d="M12 14v5" />
                  <path d="M9 21h6" />
                </svg>
              </span>
              <div className="venue-name">Bjelle gård</div>
              <p className="venue-detail">Festmiddag</p>
              <p className="venue-detail">Lørdag 19. juni 2027 &nbsp;·&nbsp; Kl. 14:30</p>
              <a className="venue-link" href="https://maps.google.com/?q=Bjelle+gård,+Kristiansand" target="_blank" rel="noopener">Veibeskrivelse →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      {REVEALED.program && (
      <section id="program">
        <div className="program-inner">
          <div className="program-header anim-fade-up">
            <span className="section-label">Program for dagen</span>
            <h2 className="section-title light">Slik blir dagen</h2>
            <div className="section-divider"></div>
          </div>
          <div className="timeline-horizontal stagger">
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-time">13:15</div>
              <div className="tl-event">Vielse</div>
              <p className="tl-desc">Randesund kirke — vi sier ja!</p>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-time">14:30</div>
              <div className="tl-event">Mottakelse</div>
              <p className="tl-desc">Velkommen til Bjelle gård</p>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-time">17:30</div>
              <div className="tl-event">Middag</div>
              <p className="tl-desc">Festmiddag med taler og innslag</p>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-time">TBA</div>
              <div className="tl-event">Brudevals</div>
              <p className="tl-desc">Kommer snart!</p>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div className="tl-time">Senest 01:30</div>
              <div className="tl-event">God natt!</div>
              <p className="tl-desc">En natt vi aldri glemmer</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* KLESKODE */}
      {REVEALED.kleskode && (
      <section id="kleskode">
        <div className="kleskode-inner">
          <div className="kleskode-visual anim-scale">
            <div className="dress-icons" aria-hidden="true">
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3l4 3 4-3" />
                <path d="M8 3v18h8V3" />
                <path d="M12 6v15" />
                <path d="M12 8l-1.5 2 1.5 1.5L13.5 10 12 8z" />
              </svg>
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6" />
                <path d="M9 3l-1 4 4 2 4-2-1-4" />
                <path d="M8 7L5 21h14L16 7" />
                <path d="M12 9v12" />
              </svg>
            </div>
          </div>
          <div className="anim-fade-left">
            <span className="section-label">Kleskode</span>
            <h2 className="section-title">Hva skal jeg ha på?</h2>
            <div className="section-divider"></div>
            <div className="kleskode-rule">
              <div className="kleskode-rule-title">Mørk dress / Sommerpent</div>
              <p>Pent og festlig. Unngå neon og sterke farger.</p>
            </div>
            <div className="kleskode-rule">
              <div className="kleskode-rule-title">Norsk sommer</div>
              <p>Ta med et lag ekstra og velg sko som tåler litt av hvert — vi bor i Norge, tross alt!</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* GAVER */}
      {REVEALED.gaver && (
      <section id="gaver">
        <div className="gaver-inner anim-fade-up">
          <span className="section-label">Gaver</span>
          <h2 className="section-title">Ønskeliste</h2>
          <div className="section-divider" style={{ marginLeft: 'auto', marginRight: 'auto' }}></div>
          <div className="gift-box">
            <span className="gift-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="9" width="16" height="11" rx="1" />
                <path d="M4 13h16" />
                <path d="M12 9v11" />
                <path d="M12 9C12 6 10 4 8 5s-1 4 4 4z" />
                <path d="M12 9c0-3 2-5 4-4s1 4-4 4z" />
              </svg>
            </span>
            <p style={{ color: 'var(--text)', fontSize: '1.05rem' }}>Din tilstedeværelse er den beste gaven!</p>
            <p style={{ marginTop: '0.75rem' }}>Ønskeliste og eventuell spleis på bryllupsreise kommer snart.</p>
            <p style={{ fontSize: '0.88rem', marginTop: '0.75rem' }}><em>Glassmagasinet og Kitchen er kjære favoritter hos oss.</em></p>
          </div>
        </div>
      </section>
      )}

      {/* OVERNATTING */}
      {REVEALED.overnatting && (
      <section id="overnatting">
        <div className="overnatting-inner">
          <div className="anim-fade-up">
            <span className="section-label">Overnatting</span>
            <h2 className="section-title">Hvor bor jeg?</h2>
            <div className="section-divider"></div>
            <p>Vi vil gjøre det enkelt for deg å finne et godt sted å sove. Hotellanbefaling og transportinfo kommer snart.</p>
            <div className="hotel-placeholder-big">Hotellanbefaling og transportinfo legges til her</div>
          </div>
        </div>
      </section>
      )}

      {/* TOASTMASTER */}
      {REVEALED.toastmaster && (
      <section id="toastmaster">
        <div className="toast-inner">
          <div className="anim-fade-up">
            <span className="section-label">Innslag &amp; taler</span>
            <h2 className="section-title">Toastmaster</h2>
            <div className="section-divider"></div>
          </div>
          <div className="toast-grid">
            <div className="anim-fade-left">
              <div className="toast-name-big">Mylie Veland Thomassen</div>
              <p>Kontaktinfo oppgis nærmere bryllupsdagen.</p>
            </div>
            <div className="anim-fade-right">
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.75rem', fontWeight: 400 }}>Retningslinjer</h3>
              <ul className="guidelines-list">
                <li>Vi setter pris på varierte innslag — dans, sang, video, quiz.</li>
                <li>Kortere og personlig slår langt og pyntet.</li>
                <li>Unngå for mange inside-vitser som ikke alle forstår.</li>
                <li>Foreldre og nær familie — taler fra dere er selvfølgelig velkomne!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      {REVEALED.faq && (
      <section id="faq">
        <div className="faq-inner">
          <div className="faq-header anim-fade-up">
            <span className="section-label">Spørsmål &amp; svar</span>
            <h2 className="section-title">FAQ</h2>
            <div className="section-divider"></div>
          </div>
          <FaqItem question="Kan jeg ta med barn?" answer="Nei, dette er dessverre et barnefritt arrangement. Vi håper på forståelse!" />
          <FaqItem question="Kan jeg ta med +1?" answer="Ta gjerne kontakt med oss direkte om du er usikker — vi finner en løsning!" />
          <FaqItem question="Er det åpen bar?" answer="Nei, men vi sørger for drikke til maten og noe å danse til!" />
          <FaqItem question="Er det fotografering under vielsen?" answer="Ja! Ta gjerne egne bilder. Vi har også profesjonell fotograf til stede." />
          <FaqItem question="Er det utendørs?" answer="Nei, festen er innendørs. Men vi håper på fint vær for bilder ute!" />
        </div>
      </section>
      )}

      {/* KOMMER SNART — forseglede seksjoner */}
      {anySealed && (
      <section id="kommer">
        <div className="kommer-inner">
          <div className="kommer-header anim-fade-up">
            <span className="section-label">Ennå forseglet</span>
            <h2 className="section-title">Det kommer mer</h2>
            <div className="section-divider"></div>
            <p>Vi har fortsatt noen brikker å legge på plass. Etter hvert som de faller på plass, bryter vi seglene ett etter ett — så det lønner seg å stikke innom igjen.</p>
          </div>
          <div className="seal-grid stagger">
            {sealed.map((item) => (
              <div className="seal-card" key={item.key}>
                <div className="seal-wax" aria-hidden="true">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="6" width="16" height="12" rx="1" />
                    <path d="M4 7l8 6 8-6" />
                  </svg>
                </div>
                <h3 className="seal-title">{item.title}</h3>
                <div className="seal-lines" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
                <p className="seal-hint">{item.hint}</p>
                <span className="seal-status">Åpnes senere</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* RSVP */}
      <section id="rsvp">
        <div className="rsvp-inner">
          <div className="rsvp-intro anim-fade-right">
            <span className="section-label">Svar på invitasjon</span>
            <h2 className="section-title light">RSVP</h2>
            <div className="section-divider"></div>
            <p>Invitasjon sendes ut i august 2026.</p>
            <p>Vi setter stor pris på at dere svarer i god tid — det hjelper oss enormt med planleggingen!</p>
            <div className="deadline">Svar innen<br />1. november 2026</div>
          </div>
          <div className="anim-fade-left">
            <div className="rsvp-card">
              <span className="rsvp-card-label">Svarskjema</span>
              <p className="rsvp-card-text">
                Svaret ditt gir du i skjemaet vårt. Der spør vi om navn, om du kommer,
                matallergier og om du har lyst til å bidra med et innslag.
              </p>
              <a
                className="btn-submit"
                href={RSVP_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Til svarskjemaet →
              </a>
              <p className="rsvp-card-note">Skjemaet åpnes i en ny fane.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        Miriam &amp; Gjermund — 19. juni 2027
        <span>Laget med kjærlighet ♡</span>
      </footer>
    </>
  );
}
