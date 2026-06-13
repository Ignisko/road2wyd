import './translations.js';
let currentLang = 'en';
let wydData = window.wydDataByLang[currentLang];

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Map
  const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    touchZoom: false,
    keyboard: false
  }).setView([41.9029, 12.4534], 4);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    keepBuffer: 30
  }).addTo(map);

  // Initial Leaflet attribution prefix
  map.attributionControl.setPrefix('<a href="https://sdmpolska.pl/wesprzyj-nas" target="_blank" style="font-weight:bold; color:var(--accent-blue);"><span class="fi fi-pl" style="border-radius:2px;"></span> Support Polish volunteers in Seoul</a> | <a href="https://ko-fi.com/afoolforjesus" target="_blank" style="font-weight:bold; color:var(--accent-blue);">☕ Support my work</a>');

  // Fade out markers during map movement to prevent jitter/shaking
  map.on('movestart', () => {
    const pane = document.querySelector('.leaflet-marker-pane');
    if (pane) {
      pane.style.transition = 'none';
      pane.style.opacity = '0';
    }
  });

  map.on('moveend', () => {
    const pane = document.querySelector('.leaflet-marker-pane');
    if (pane) {
      setTimeout(() => {
        pane.style.transition = 'opacity 0.6s ease';
        pane.style.opacity = '1';
      }, 50);
    }
  });

  const timelineContainer = document.getElementById('dynamic-timeline');
  const placeList = document.getElementById('place-list');
  const introScreen = document.getElementById('intro-screen');
  const mapEl = document.getElementById('map');
  const latlngs = [];

  // 2. Populate Sidebar and Timeline Cards
  const homeLi = document.createElement('li');
  homeLi.innerHTML = `<a href="#intro-screen" data-id="home" class="active">Home</a>`;
  placeList.appendChild(homeLi);

  wydData.forEach((data, index) => {
    // Removed Rome offset so it shares the same coordinates as Vatican City
    
    latlngs.push(data.coordinates);

    // Strip country to save space, and explicitly shorten long names
    let navLabel = data.location.split(',')[0];
    if (navLabel === "Santiago de Compostela") navLabel = "Santiago";
    if (navLabel === "Vatican City") navLabel = "Vatican";

    let labelClass = "city-label";
    if (navLabel === "Vatican") labelClass += " label-left";

    const specificIcon = L.divIcon({
      className: `custom-map-marker marker-${data.id}`,
      html: `
        <div class="marker-dot"></div>
        <div class="${labelClass}">${navLabel}</div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(data.coordinates, { icon: specificIcon }).addTo(map);

    const li = document.createElement('li');
    li.innerHTML = `<a href="#card-${data.id}" data-id="${data.id}">${navLabel}</a>`;
    placeList.appendChild(li);

    // Skip index 0 because 1984 is baked in the HTML for SEO
    if (index > 0) {
      const article = document.createElement('article');
      article.className = 'timeline-card';
      article.id = `card-${data.id}`;
      article.setAttribute('data-index', index);
      
      const titleHTML = data.year === "2027" ? `<h2 class="seoul-title">Seoul, South Korea</h2>` : `<h2>${data.location}</h2>`;

      let attendanceText = data.attendance;
      let attendanceHTML = "";
      if (attendanceText !== "Upcoming") {
        attendanceHTML = `<p>${attendanceText} pilgrims</p>`;
      }

      article.innerHTML = `
        ${titleHTML}
        <div class="card-details">
          <p>${data.date}</p>
          <p>${data.theme}</p>
          ${attendanceHTML}
        </div>
        <p class="card-description">${data.description}</p>
      `;
      timelineContainer.appendChild(article);
    }
  });

  // Add Symbols to Nav List
  const symbolsLi = document.createElement('li');
  symbolsLi.innerHTML = `<a href="#card-symbols" data-id="symbols">Symbols</a>`;
  placeList.appendChild(symbolsLi);

  // Add Patrons to Nav List
  const patronsLi = document.createElement('li');
  patronsLi.innerHTML = `<a href="#card-patrons" data-id="patrons">Patron saints</a>`;
  placeList.appendChild(patronsLi);

  // Add Credits to Nav List
  const creditsLi = document.createElement('li');
  creditsLi.innerHTML = `<a href="#card-credits" data-id="credits">Credits</a>`;
  placeList.appendChild(creditsLi);

  // Handle Navbar Clicks smoothly
  placeList.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  });

  // 4. Scroll Logic with IntersectionObserver
  const cards = document.querySelectorAll('.timeline-card');
  const navLinks = document.querySelectorAll('#place-list a');

  let currentActiveId = null;
  let currentTargetCoords = null;

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -10% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(c => c.classList.remove('active'));
        entry.target.classList.add('active');

        // Fade out intro screen when scrolling down to cards
        if (introScreen && entry.target.id !== 'intro-screen') {
          introScreen.style.opacity = '0';
          introScreen.style.transition = 'opacity 0.6s ease';
          if (mapEl) mapEl.classList.remove('hide-markers');
        }

        const index = entry.target.getAttribute('data-index');
        const isCredits = entry.target.id === 'card-credits';
        
        if (index !== null) {
          const data = wydData[index];
          
          if (currentActiveId !== data.id) {
            currentActiveId = data.id;

            document.querySelectorAll('.custom-map-marker').forEach(el => {
              el.classList.remove('active-pin');
              if (el.classList.contains(`marker-${data.id}`)) {
                el.classList.add('active-pin');
              }
            });

            navLinks.forEach(link => {
              if (link.getAttribute('data-id') === data.id) {
                link.classList.add('active');
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              } else {
                link.classList.remove('active');
              }
            });

            if (!currentTargetCoords || currentTargetCoords[0] !== data.coordinates[0] || currentTargetCoords[1] !== data.coordinates[1]) {
              currentTargetCoords = data.coordinates;
              map.flyTo(data.coordinates, 8, {
                animate: true,
                duration: 2.0
              });
            }
          }
        } else if (isCredits) {
            currentActiveId = 'credits';
            
            if (!currentTargetCoords || currentTargetCoords[0] !== 52.2297 || currentTargetCoords[1] !== 21.0122) {
              currentTargetCoords = [52.2297, 21.0122];
              
              // Fly to Warsaw
              map.flyTo([52.2297, 21.0122], 6, {
                animate: true,
                duration: 2.0
              });
            }
            navLinks.forEach(link => {
              if (link.getAttribute('data-id') === 'credits') {
                link.classList.add('active');
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              } else {
                link.classList.remove('active');
              }
            });
        } else if (entry.target.id === 'card-symbols') {
             currentActiveId = 'symbols';
             if (!currentTargetCoords || currentTargetCoords[0] !== 37.5665 || currentTargetCoords[1] !== 126.978) {
               currentTargetCoords = [37.5665, 126.978];
               map.flyTo([37.5665, 126.978], 8, { animate: true, duration: 2.0 });
             }
             navLinks.forEach(link => {
               if (link.getAttribute('data-id') === 'symbols') {
                 link.classList.add('active');
                 link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
               } else {
                 link.classList.remove('active');
               }
             });
        } else if (entry.target.id === 'card-patrons') {
             currentActiveId = 'patrons';
             if (!currentTargetCoords || currentTargetCoords[0] !== 37.5665 || currentTargetCoords[1] !== 126.978) {
               currentTargetCoords = [37.5665, 126.978];
               map.flyTo([37.5665, 126.978], 8, { animate: true, duration: 2.0 });
             }
             navLinks.forEach(link => {
               if (link.getAttribute('data-id') === 'patrons') {
                 link.classList.add('active');
                 link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
               } else {
                 link.classList.remove('active');
               }
             });
          }
        }
      });
  }, observerOptions);

  cards.forEach(card => observer.observe(card));

  // 5. Intro Screen Observer to fade it back in when scrolled to top
  if (introScreen) {
    const introObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
           introScreen.style.opacity = '1';
           if (mapEl) mapEl.classList.add('hide-markers');
           cards.forEach(c => c.classList.remove('active')); // clear cards when at top
           document.querySelectorAll('.custom-map-marker').forEach(el => el.classList.remove('active-pin'));
           navLinks.forEach(link => {
             if (link.getAttribute('data-id') === 'home') {
               link.classList.add('active');
               link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             } else {
               link.classList.remove('active');
             }
           });
           
           currentTargetCoords = null; // Reset coords so the next scroll down triggers a flight
           currentActiveId = 'home'; // Reset active id so scrolling down triggers map updates
           
           // Fly back to original view
           map.flyTo([41.9029, 12.4534], 4, {
             animate: true,
             duration: 2.0
           });
        }
      });
    }, { threshold: 0.8 });
    introObserver.observe(introScreen);
  }

  // Force Home view when scrolling back to the very top
  window.addEventListener('scroll', () => {
    if (window.scrollY < 50 && currentActiveId !== 'home') {
       currentActiveId = 'home';
       cards.forEach(c => c.classList.remove('active'));
       document.querySelectorAll('.custom-map-marker').forEach(el => el.classList.remove('active-pin'));
       if (introScreen) introScreen.style.opacity = '1';
       if (mapEl) mapEl.classList.add('hide-markers');
       navLinks.forEach(link => {
         if (link.getAttribute('data-id') === 'home') {
           link.classList.add('active');
         } else {
           link.classList.remove('active');
         }
       });
       currentTargetCoords = null;
       map.flyTo([41.9029, 12.4534], 4, { animate: true, duration: 2.0 });
    }
  });
  // 6. Language Application
  function applyLanguage(lang) {
    currentLang = lang;
    const t = window.translations[lang] || window.translations['en'];

    // Update map attribution with translated text
    if (t.supportLinkText) {
      const supportMyWork = t.supportMyWorkText || "Support my work";
      map.attributionControl.setPrefix(`<a href="https://sdmpolska.pl/wesprzyj-nas" target="_blank" style="font-weight:bold; color:var(--accent-blue);"><span class="fi fi-pl" style="border-radius:2px;"></span> ${t.supportLinkText}</a> | <a href="https://ko-fi.com/afoolforjesus" target="_blank" style="font-weight:bold; color:var(--accent-blue);">☕ ${supportMyWork}</a>`);
    }

    const tFallback = window.translations['en'];
    wydData = window.wydDataByLang[lang];

    // Static text
    document.querySelector('.intro-kicker').innerHTML = t.introKicker;
    document.querySelector('.intro-title').innerHTML = t.introTitle;
    document.querySelector('.intro-subtitle').innerHTML = t.introSubtitle;
    document.querySelector('.intro-description p').innerHTML = t.introDesc;

    const bottomCredits = document.getElementById('bottom-left-credits');
    if(bottomCredits) bottomCredits.innerHTML = t.navCredits || "Credits";

    document.querySelector('#card-1984 h2').innerHTML = t.card1984Title;
    const card1984Details = document.querySelectorAll('#card-1984 .card-details p');
    if(card1984Details.length === 3) {
      card1984Details[0].innerHTML = t.card1984Date;
      card1984Details[1].innerHTML = t.card1984Theme;
      card1984Details[2].innerHTML = t.card1984Attendance;
    }
    document.querySelector('#card-1984 .card-description').innerHTML = t.card1984Desc;

      document.querySelector('#card-symbols h2').innerHTML = t.symbolsTitle;
      const symbolsPs = document.querySelectorAll('#card-symbols .card-description p');
      if(symbolsPs.length >= 2) {
        symbolsPs[0].innerHTML = t.symbolsP1;
        symbolsPs[1].innerHTML = t.symbolsP2;
      }

    document.querySelector('#card-patrons h2').innerHTML = t.patronsTitle;
    const patronsDesc = document.querySelector('#card-patrons .card-description');
    if(patronsDesc) {
       const wrapL = (html, url) => html.replace('<strong>', `<a href="${url}" target="_blank" style="color: var(--accent-blue); text-decoration: none;"><strong>`).replace('</strong>', '</strong></a>');
       patronsDesc.innerHTML = `
          <p style="margin-bottom: 0.5rem;">${t.patronsDesc}</p>
          <ul style="list-style: disc; margin-left: 1.5rem; margin-bottom: 1rem;">
            <li>${wrapL(t.patron1, 'https://wydseoul.org/en/introduction/johnpaulII')}</li>
            <li>${wrapL(t.patron2, 'https://wydseoul.org/en/introduction/kimtaegon')}</li>
            <li>${wrapL(t.patron3, 'https://wydseoul.org/en/introduction/cabrini')}</li>
            <li>${wrapL(t.patron4, 'https://wydseoul.org/en/introduction/bakhita')}</li>
            <li>${wrapL(t.patron5, 'https://wydseoul.org/en/introduction/carloacutis')}</li>
          </ul>
          <p>${t.patronsQuote}</p>
       `;
    }

    document.querySelector('#card-credits .jesus-title').innerHTML = t.creditsTitle;
    document.querySelector('#card-credits .card-description').innerHTML = `
          <p>${t.creditsBio}</p>
          <p style="margin-top: 1rem;">${t.creditsTech}</p>
          <p style="margin-top: 1rem;">${t.creditsThanks}</p>
          <div style="margin-top: 1.5rem; text-align: center;">
            <a href="https://ko-fi.com/afoolforjesus" target="_blank" class="kofi-button">
              <span style="margin-right: 8px;">☕</span>${t.kofiButtonText || 'Support my projects'}
            </a>
          </div>
    `;

    // Dynamic cards & Nav links
    wydData.forEach((data, index) => {
      if (index > 0) {
        const article = document.getElementById(`card-${data.id}`);
        if(article) {
          const titleHTML = data.year === "2027" ? `<h2 class="seoul-title">Seoul, South Korea</h2>` : `<h2>${data.location}</h2>`;
          let attendanceText = data.attendance;
          let attendanceHTML = "";
          if (attendanceText !== t.upcomingLabel && attendanceText !== "Upcoming") {
             attendanceHTML = `<p>${attendanceText}${t.pilgrimsLabel}</p>`;
          }
          article.innerHTML = `
             <div class="card-logo">
                 <img src="./logos/${data.id}.png" alt="WYD ${data.year} Logo" onerror="this.style.display='none';" ${data.id === '1985' ? 'style="border-radius: 50%; aspect-ratio: 1/1; object-fit: contain; background: white; padding: 4px; box-sizing: border-box;"' : ''}>
              </div>
            ${titleHTML}
            <div class="card-details">
              <p>${data.date}</p>
              <p>${data.theme}</p>
              ${attendanceHTML}
            </div>
            <p class="card-description">${data.description}</p>
          `;
        }
      }

      const navLink = document.querySelector(`#place-list a[data-id="${data.id}"]`);
      if (navLink) {
        let navLabel = data.location.split(',')[0];
        if (navLabel === "Santiago de Compostela") navLabel = "Santiago";
        if (navLabel === "Vatican City" || navLabel === "Watykan" || navLabel === "바티칸 시국" || navLabel === "Ciudad del Vaticano" || navLabel === "Città del Vaticano" || navLabel === "Cidade do Vaticano") navLabel = "Vatican";
        
        navLink.innerHTML = navLabel;
        
        const markerEl = document.querySelector(`[class~="marker-${data.id}"]`);
        if (markerEl) {
          const cityLabel = markerEl.querySelector('.city-label');
          if (cityLabel) cityLabel.innerHTML = navLabel;
        }
      }
    });

    const navHome = document.querySelector('#place-list a[data-id="home"]');
    if(navHome) navHome.innerHTML = t.navHome;
    const navSym = document.querySelector('#place-list a[data-id="symbols"]');
    if(navSym) navSym.innerHTML = t.navSymbols;
    const navPat = document.querySelector('#place-list a[data-id="patrons"]');
    if(navPat) navPat.innerHTML = t.navPatrons;
    const navCred = document.querySelector('#place-list a[data-id="credits"]');
    if(navCred) navCred.innerHTML = t.navCredits || "Credits";
  }

  const customLang = document.getElementById('custom-lang');
  const langCurrent = document.getElementById('lang-current');
  const langDropdown = document.getElementById('lang-dropdown');
  
  if (customLang && langCurrent && langDropdown) {
    langCurrent.addEventListener('click', (e) => {
      e.stopPropagation();
      customLang.classList.toggle('open');
    });

    langDropdown.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = e.target.getAttribute('data-value');
        const selectedText = e.target.innerText;
        
        // Extract just the flag HTML element for the top button
        const flagSpan = e.target.querySelector('.fi');
        const flagHtml = flagSpan ? flagSpan.outerHTML : '';
        // Update UI
        langCurrent.innerHTML = `${flagHtml} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
        langDropdown.querySelectorAll('li').forEach(li => li.classList.remove('active'));
        e.target.classList.add('active');
        customLang.classList.remove('open');
        
        applyLanguage(selectedLang);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!customLang.contains(e.target)) {
        customLang.classList.remove('open');
      }
    });

    // Close when scrolling or panning map
    window.addEventListener('scroll', () => {
      customLang.classList.remove('open');
    }, { passive: true });

    map.on('movestart', () => {
      customLang.classList.remove('open');
    });
  }

  // Initial application of default lang is English since it loads as English, but calling it enforces consistency
  applyLanguage('en');
});
