const wydData = [
  { id: "1984", year: "1984", location: "Vatican City", date: "14–15 April 1984", coordinates: [41.9029, 12.4534], theme: "Holy Year of the Redemption: A Festival of Hope", attendance: "300,000", description: "Pope John Paul II entrusts the WYD Cross to the Youth. First WYD in Southern Europe." },
  { id: "1985", year: "1985", location: "Rome, Italy", date: "30–31 March 1985", coordinates: [41.9028, 12.4964], theme: "International Youth Year", attendance: "300,001", description: "First WYD outside Vatican City." },
  { id: "1987", year: "1987", location: "Buenos Aires, Argentina", date: "6–12 April 1987", coordinates: [-34.6037, -58.3816], theme: "We have recognized the love that God has for us...", attendance: "1,000,000", description: "First WYD outside Europe and first in South America." },
  { id: "1989", year: "1989", location: "Santiago de Compostela, Spain", date: "19–20 August 1989", coordinates: [42.8782, -8.5448], theme: "I am the Way, the Truth and the Life", attendance: "600,000", description: "First WYD in Southwestern Europe. Held at Monte do Gozo." },
  { id: "1991", year: "1991", location: "Częstochowa, Poland", date: "10–15 August 1991", coordinates: [50.8118, 19.1203], theme: "You have received a spirit of children", attendance: "1,600,000", description: "First WYD in Central Europe and in the Pope's native country. Held at Jasna Góra Monastery." },
  { id: "1993", year: "1993", location: "Denver, United States", date: "10–15 August 1993", coordinates: [39.7392, -104.9903], theme: "I came that they might have life...", attendance: "700,000", description: "First WYD in North America. Held at Cherry Creek State Park." },
  { id: "1995", year: "1995", location: "Manila, Philippines", date: "10–15 January 1995", coordinates: [14.5995, 120.9842], theme: "As the Father has sent me, so am I sending you", attendance: "5,000,000", description: "Largest Papal gathering at the time. First WYD held in Asia and the tropical zone." },
  { id: "1997", year: "1997", location: "Paris, France", date: "19–24 August 1997", coordinates: [48.8566, 2.3522], theme: "Teacher, where do you live? Come and see", attendance: "1,200,000", description: "First WYD in Western Europe. Mass held at Longchamp Racecourse." },
  { id: "2000", year: "2000", location: "Rome, Italy", date: "15–20 August 2000", coordinates: [41.8700, 12.6300], theme: "The Word became flesh and dwelt among us", attendance: "2,000,000", description: "Held on the occasion of the Great Jubilee at Tor Vergata." },
  { id: "2002", year: "2002", location: "Toronto, Canada", date: "23–28 July 2002", coordinates: [43.7400, -79.4700], theme: "You are the salt of the earth... you are the light of the world", attendance: "800,000", description: "Last WYD attended by Pope John Paul II. Held at Downsview Park." },
  { id: "2005", year: "2005", location: "Cologne, Germany", date: "16–21 August 2005", coordinates: [50.8800, 6.7400], theme: "We have come to worship Him", attendance: "1,000,000", description: "First WYD attended by Pope Benedict XVI, himself a native German." },
  { id: "2008", year: "2008", location: "Sydney, Australia", date: "15–20 July 2008", coordinates: [-33.9060, 151.2290], theme: "You will receive power when the Holy Spirit comes upon you", attendance: "400,000", description: "First WYD in Oceania. Mass held at Randwick Racecourse." },
  { id: "2011", year: "2011", location: "Madrid, Spain", date: "16–21 August 2011", coordinates: [40.3700, -3.7800], theme: "Rooted and built up in Jesus Christ, Firm in the Faith", attendance: "2,000,000", description: "Last WYD attended by Pope Benedict XVI." },
  { id: "2013", year: "2013", location: "Rio de Janeiro, Brazil", date: "23–28 July 2013", coordinates: [-22.9711, -43.1822], theme: "Go and make disciples of all nations", attendance: "3,700,000", description: "First WYD attended by Pope Francis. Held at Copacabana Beach." },
  { id: "2016", year: "2016", location: "Kraków, Poland", date: "26–31 July 2016", coordinates: [50.0200, 20.0400], theme: "Blessed are the merciful, for they will receive mercy", attendance: "3,000,000", description: "Held on the Occasion of the Extraordinary Jubilee of Mercy." },
  { id: "2019", year: "2019", location: "Panama City, Panama", date: "22–27 January 2019", coordinates: [9.0300, -79.4400], theme: "I am the servant of the Lord.", attendance: "700,000", description: "First WYD to take place in Central America." },
  { id: "2023", year: "2023", location: "Lisbon, Portugal", date: "1–6 August 2023", coordinates: [38.7800, -9.0900], theme: "Mary arose and went with haste.", attendance: "1,500,000", description: "Last WYD attended by Pope Francis. First WYD after COVID-19 pandemic." },
  { id: "2027", year: "2027", location: "Seoul, South Korea", date: "3–8 August 2027", coordinates: [37.5665, 126.9780], theme: "Take courage! I have overcome the world.", attendance: "Upcoming", description: "First WYD held in East Asia and a Christian-minority country." }
];

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Map
  const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    doubleClickZoom: false
  }).setView([41.9029, 12.4534], 4);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: 'custom-map-marker',
    html: '<div class="marker-dot"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const timelineContainer = document.getElementById('dynamic-timeline');
  const placeList = document.getElementById('place-list');
  const introScreen = document.getElementById('intro-screen');
  const latlngs = [];

  // 2. Populate Sidebar and Timeline Cards
  const homeLi = document.createElement('li');
  homeLi.innerHTML = `<a href="#intro-screen" data-id="home" class="active">Home</a>`;
  placeList.appendChild(homeLi);

  wydData.forEach((data, index) => {
    latlngs.push(data.coordinates);
    
    L.marker(data.coordinates, { icon: markerIcon }).addTo(map);

    // Strip country to save space, and explicitly shorten long names
    let navLabel = data.location.split(',')[0];
    if (navLabel === "Santiago de Compostela") navLabel = "Santiago d.C.";
    if (navLabel === "Vatican City") navLabel = "Vatican";

    const li = document.createElement('li');
    li.innerHTML = `<a href="#card-${data.id}" data-id="${data.id}">${navLabel}</a>`;
    placeList.appendChild(li);

    // Skip index 0 because 1984 is baked in the HTML for SEO
    if (index > 0) {
      const article = document.createElement('article');
      article.className = 'timeline-card';
      article.id = `card-${data.id}`;
      article.setAttribute('data-index', index);
      
      const titleHTML = data.year === "2027" ? `<h2 class="seoul-title">WYD SEOUL 2027</h2>` : `<h2>${data.location}</h2>`;

      article.innerHTML = `
        <div class="card-meta">
          <span class="card-year">${data.year}</span>
          <span class="card-location">${data.location}</span>
        </div>
        ${titleHTML}
        <div class="card-details">
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Theme:</strong> ${data.theme}</p>
          <p><strong>Attendance:</strong> ${data.attendance}</p>
        </div>
        <p class="card-description">${data.description}</p>
      `;
      timelineContainer.appendChild(article);
    }
  });

  // 3. Draw Path Line connecting the cities
  L.polyline(latlngs, {
    color: '#1b43aa', // Seoul blue path
    weight: 2,
    opacity: 0.5,
    dashArray: '5, 10'
  }).addTo(map);

  // 4. Scroll Logic with IntersectionObserver
  const cards = document.querySelectorAll('.timeline-card');
  const navLinks = document.querySelectorAll('#place-list a');

  let currentActiveId = null;

  const observerOptions = {
    root: null,
    rootMargin: '-55% 0px -25% 0px',
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
        }

        const index = entry.target.getAttribute('data-index');
        const isCredits = entry.target.id === 'card-credits';
        const isFinal = entry.target.id === 'card-final';
        
        if (index !== null) {
          const data = wydData[index];
          
          if (currentActiveId !== data.id) {
            currentActiveId = data.id;

            navLinks.forEach(link => {
              if (link.getAttribute('data-id') === data.id) {
                link.classList.add('active');
                link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              } else {
                link.classList.remove('active');
              }
            });

            map.flyTo(data.coordinates, 9, {
              animate: true,
              duration: 1.2
            });
          }
        } else if (isCredits || isFinal) {
           currentActiveId = isCredits ? 'credits' : 'final';
           navLinks.forEach(link => link.classList.remove('active'));
           
           // Fly to Warsaw
           map.flyTo([52.2297, 21.0122], 9, {
             animate: true,
             duration: 1.5
           });
        } else if (entry.target.id === 'card-symbols') {
           currentActiveId = 'symbols';
           navLinks.forEach(link => link.classList.remove('active'));
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
           cards.forEach(c => c.classList.remove('active')); // clear cards when at top
           navLinks.forEach(link => {
             if (link.getAttribute('data-id') === 'home') {
               link.classList.add('active');
               link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             } else {
               link.classList.remove('active');
             }
           });
           
           // Fly back to original view
           map.flyTo([41.9029, 12.4534], 4, {
             animate: true,
             duration: 1.2
           });
        }
      });
    }, { rootMargin: '-10% 0px -10% 0px' });
    introObserver.observe(introScreen);
  }

});
