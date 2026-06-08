'use client';

import { useEffect, useRef, useState } from 'react';

// Prefix for static assets — matches basePath in next.config.mjs so images
// resolve correctly on GitHub Pages project sites (and stays empty locally).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

const WEDDING_DATE = new Date('2027-06-19T13:15:00');

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
  const [submitted, setSubmitted] = useState(false);
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

  const submitRsvp = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const playVideo = () => {
    videoRef.current?.play();
  };

  const countdownDone = mounted && time === null;

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
            <li><a href="#om-oss" onClick={closeMenu}>Om oss</a></li>
            <li><a href="#praktisk" onClick={closeMenu}>Praktisk</a></li>
            <li><a href="#program" onClick={closeMenu}>Program</a></li>
            <li><a href="#kleskode" onClick={closeMenu}>Kleskode</a></li>
            <li><a href="#faq" onClick={closeMenu}>FAQ</a></li>
            <li><a href="#rsvp" onClick={closeMenu}>RSVP</a></li>
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
              I dag er den store dagen! 🎉
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

      {/* OM OSS — intro split */}
      <section id="om-oss">
        <div className="split-section">
          <div className="split-text anim-fade-right">
            <span className="section-label">Vår historie</span>
            <h2 className="section-title">Om oss</h2>
            <div className="section-divider"></div>
            <p className="large">Vi er Miriam og Gjermund — og vi er veldig glade for at du er her! For de av dere som ikke kjenner oss som par, her er den korte versjonen.</p>
            <p>Vi møttes, vi reiste, vi ble forelsket — og nå skal vi gifte oss. Enkelt og utrolig.</p>
          </div>
          <div className="split-img anim-scale">
            <img src={`${BASE}/foto1.jpg`} alt="Miriam og Gjermund" />
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
              <p><em style={{ color: 'var(--rose-dark)' }}>[Legg til historien om hvordan dere møttes — jo mer personlig, jo bedre!]</em></p>
            </div>
            <div className="story-photo-wrap">
              <img src={`${BASE}/foto5.jpg`} alt="Miriam og Gjermund" />
              <div className="caption">Tidlige dager ♡</div>
            </div>
          </div>

          {/* Frieriet */}
          <div className="story-grid text-right anim-fade-up" style={{ marginTop: 'clamp(4rem, 7vw, 8rem)' }}>
            <div className="story-text">
              <h3>Frieriet ✨</h3>
              <p><em style={{ color: 'var(--rose-dark)' }}>[Fortell om frieriet — hvor, når, og hvordan det skjedde!]</em></p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
                <div style={{ overflow: 'hidden', borderRadius: '2px' }}>
                  <img src={`${BASE}/frieri_b.jpg`} alt="Frieriet" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />
                </div>
                <div style={{ overflow: 'hidden', borderRadius: '2px' }}>
                  <img src={`${BASE}/frieri_d.jpg`} alt="Ringen" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', objectPosition: 'center top', display: 'block', transition: 'transform 0.6s ease' }} />
                </div>
              </div>
            </div>
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
              <div className="caption">Posten fikk frieri-æren 🌸</div>
            </div>
          </div>

          {/* Litt om oss */}
          <div className="person-strip anim-fade-up" style={{ marginTop: 'clamp(4rem, 7vw, 8rem)' }}>
            <div className="person-panel">
              <img src={`${BASE}/portrett_miriam.jpg`} alt="Miriam"
                style={{ width: '160px', height: '160px', objectFit: 'cover', objectPosition: 'center top', borderRadius: '50%', margin: '0 auto 1.25rem', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <div className="person-panel-name">Miriam</div>
              <p style={{ fontSize: '0.9rem' }}><em>[Alder, hjemsted, jobb, hobbyer]</em></p>
            </div>
            <div className="person-panel">
              <img src={`${BASE}/portrett_gjermund.jpg`} alt="Gjermund"
                style={{ width: '160px', height: '160px', objectFit: 'cover', objectPosition: 'center top', borderRadius: '50%', margin: '0 auto 1.25rem', display: 'block', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <div className="person-panel-name">Gjermund</div>
              <p style={{ fontSize: '0.9rem' }}><em>[Alder, hjemsted, jobb, hobbyer]</em></p>
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
              <span className="venue-icon">⛪</span>
              <div className="venue-name">Randesund kirke</div>
              <p className="venue-detail">Vielse</p>
              <p className="venue-detail">Lørdag 19. juni 2027 &nbsp;·&nbsp; Kl. 13:15</p>
              <a className="venue-link" href="https://maps.google.com/?q=Randesund+kirke,+Kristiansand" target="_blank" rel="noopener">Veibeskrivelse →</a>
            </div>
            <div className="venue-card">
              <span className="venue-icon">🥂</span>
              <div className="venue-name">Bjelle gård</div>
              <p className="venue-detail">Festmiddag</p>
              <p className="venue-detail">Lørdag 19. juni 2027 &nbsp;·&nbsp; Kl. 14:30</p>
              <a className="venue-link" href="https://maps.google.com/?q=Bjelle+gård,+Kristiansand" target="_blank" rel="noopener">Veibeskrivelse →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
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

      {/* KLESKODE */}
      <section id="kleskode">
        <div className="kleskode-inner">
          <div className="kleskode-visual anim-scale">
            <div className="dress-icons">🤵🏼 👗</div>
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
              <p>Ta med et lag ekstra og velg sko som tåler litt av hvert — vi bor i Norge, tross alt! ☀️🌧️</p>
            </div>
          </div>
        </div>
      </section>

      {/* GAVER */}
      <section id="gaver">
        <div className="gaver-inner anim-fade-up">
          <span className="section-label">Gaver</span>
          <h2 className="section-title">Ønskeliste</h2>
          <div className="section-divider" style={{ marginLeft: 'auto', marginRight: 'auto' }}></div>
          <div className="gift-box">
            <span className="gift-icon">🌸</span>
            <p style={{ color: 'var(--text)', fontSize: '1.05rem' }}>Din tilstedeværelse er den beste gaven!</p>
            <p style={{ marginTop: '0.75rem' }}>Ønskeliste og eventuell spleis på bryllupsreise kommer snart.</p>
            <p style={{ fontSize: '0.88rem', marginTop: '0.75rem' }}><em>Glassmagasinet og Kitchen er kjære favoritter hos oss.</em></p>
          </div>
        </div>
      </section>

      {/* OVERNATTING */}
      <section id="overnatting">
        <div className="overnatting-inner">
          <div className="anim-fade-up">
            <span className="section-label">Overnatting</span>
            <h2 className="section-title">Hvor bor jeg?</h2>
            <div className="section-divider"></div>
            <p>Vi vil gjøre det enkelt for deg å finne et godt sted å sove. Hotellanbefaling og transportinfo kommer snart.</p>
            <div className="hotel-placeholder-big">🏨 Hotellanbefaling og transportinfo legges til her</div>
          </div>
        </div>
      </section>

      {/* TOASTMASTER */}
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
                <li>Foreldre og nær familie — taler fra dere er selvfølgelig velkomne! ❤️</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
          <FaqItem question="Er det utendørs?" answer="Nei, festen er innendørs. Men vi håper på fint vær for bilder ute! ☀️" />
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp">
        <div className="rsvp-inner">
          <div className="rsvp-intro anim-fade-right">
            <span className="section-label">Svar på invitasjon</span>
            <h2 className="section-title light">RSVP</h2>
            <div className="section-divider"></div>
            <p>Invitasjon sendes ut i august 2026.</p>
            <p>Vi setter stor pris på at dere svarer i god tid — det hjelper oss enormt med planleggingen!</p>
            <div className="deadline">Svar innen<br />1. desember 2026</div>
          </div>
          <div className="anim-fade-left">
            {!submitted ? (
              <form className="rsvp-form" id="rsvpForm" onSubmit={submitRsvp}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fullt navn *</label>
                    <input type="text" name="navn" required placeholder="Ola Nordmann" />
                  </div>
                  <div className="form-group">
                    <label>E-post *</label>
                    <input type="email" name="epost" required placeholder="ola@eksempel.no" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Deltar du? *</label>
                    <select name="deltar" required defaultValue="">
                      <option value="">Velg...</option>
                      <option value="ja">Ja, jeg kommer! 🎉</option>
                      <option value="nei">Nei, dessverre ikke</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Antall gjester</label>
                    <select name="antall" defaultValue="1">
                      <option value="1">1 person</option>
                      <option value="2">2 personer</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Matallergier / spesielle behov</label>
                  <textarea name="allergier" placeholder="F.eks. glutenallergi, vegetar — eller 'ingen'"></textarea>
                </div>
                <div className="form-group">
                  <label>Ønsker du å bidra med innslag? (valgfritt)</label>
                  <textarea name="innslag" placeholder="Tale, sang, video, quiz? Fortell litt — toastmaster tar kontakt!"></textarea>
                </div>
                <div className="form-group">
                  <label>Telefon (for toastmaster)</label>
                  <input type="text" name="kontakt" placeholder="+47 000 00 000" />
                </div>
                <button type="submit" className="btn-submit">Send svar →</button>
              </form>
            ) : (
              <div className="form-success" style={{ display: 'block' }}>
                Tusen takk! Vi gleder oss til å feire med deg 🌸
              </div>
            )}
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
