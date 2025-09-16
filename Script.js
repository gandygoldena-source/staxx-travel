async function loadJSON(path){ const r = await fetch(path); return await r.json(); }

const cfg = await loadJSON('data/config.json');
document.documentElement.style.setProperty('--accent', cfg.accent || '#B3F36D');
document.getElementById('site-title').textContent = cfg.siteName || 'Staxx Travel';
document.getElementById('site-tagline').textContent = cfg.tagline || '';
document.getElementById('brand').textContent = cfg.siteName || 'Staxx Travel';
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('ig').href = cfg.instagram || '#';
document.getElementById('tt').href = cfg.tiktok || '#';
document.getElementById('yt').href = cfg.youtube || '#';
document.getElementById('email').href = cfg.email ? 'mailto:' + cfg.email : '#';
document.getElementById('voteLink').href = cfg.voteUrl || '#';

// Destinations
const dests = await loadJSON('data/destinations.json');
document.getElementById('dest-grid').innerHTML = dests.map(d => `
  <article class="card">
    <img src="${d.image}" alt="${d.title}">
    <div class="body">
      <h3>${d.title}</h3>
      <div class="meta">${d.city || ''}</div>
      <p>${d.summary || ''}</p>
    </div>
  </article>
`).join('');

// Episodes
const eps = await loadJSON('data/episodes.json');
document.getElementById('ep-grid').innerHTML = eps.map(ep => `
  <article class="card">
    <img src="${ep.thumb}" alt="${ep.title}">
    <div class="body">
      <h3>${ep.title}</h3>
      <div class="meta">${ep.city || ''} · ${new Date(ep.date).toLocaleDateString()}</div>
      <p>${ep.summary || ''}</p>
      <div class="row" style="margin-top:8px;display:flex;gap:8px">
        <a class="btn primary" href="${ep.video}" target="_blank" rel="noopener">Watch</a>
      </div>
    </div>
  </article>
`).join('');

// Map
let map = L.map('map', { scrollWheelZoom: true }).setView([35.2,-80.8], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap' }).addTo(map);

const route = await loadJSON('data/route.geojson');
const layer = L.geoJSON(route, { style: { color: cfg.accent || '#B3F36D', weight: 4 } }).addTo(map);
map.fitBounds(layer.getBounds(), { padding:[20,20] });

(route.features?.[0]?.geometry?.coordinates || []).forEach((c,i) => {
  const [lng,lat] = c;
  L.circleMarker([lat,lng], { radius:6, color:cfg.accent, fillColor:cfg.accent, fillOpacity:1 })
   .addTo(map).bindTooltip('Stop #' + (i+1));
});
