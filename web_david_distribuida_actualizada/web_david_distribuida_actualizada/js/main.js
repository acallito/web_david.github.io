/* ============================================================
   2. INTERFÍCIE — aparicions en fer scroll
   ============================================================ */
const observador = 'IntersectionObserver' in window
  ? new IntersectionObserver((entrades, obs) => {
      entrades.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          obs.unobserve(en.target);
        }
      });
    }, {threshold: .12, rootMargin: '0px 0px -60px 0px'})
  : {observe: el => el.classList.add('is-in')};   /* navegadors antics: es mostra directament */

/* ============================================================
   3. TARGETES D'EXCURSIÓ — generades des de l'array
   ============================================================ */
const contenidor = document.getElementById('rutes');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const classeDificultat = nivell => 'dif--' + nivell;   /* nivell ja és una clau interna: facil, mitjana, alta */

function plantillaRuta(r){
  return `
  <article class="ruta reveal${r.especial ? ' ruta--especial' : ''}" data-dificultat="${esc(r.dificultad)}">
    ${r.especial ? `<span class="ruta__etiqueta">${T().especial}</span>` : ''}
    <div class="ruta__top">
      <span class="ruta__data">${esc(camp(r,"fecha"))}</span>
      <span class="ruta__dif ${classeDificultat(r.nivell)}">${esc(camp(r,"dificultad"))}</span>
    </div>
    <h3>${esc(r.nombre)}</h3>
    <p class="ruta__sub">${esc(camp(r,"subtitol"))} · ${esc(camp(r,"zona"))}</p>
    <p class="ruta__desc">${esc(camp(r,"descripcion"))}</p>
    <div class="ruta__dades">
      <div class="dada"><b>${esc(r.distancia)}</b><span>${T().distancia}</span></div>
      <div class="dada"><b>${esc(r.desnivel)}</b><span>${T().desnivell}</span></div>
      <div class="dada"><b>${esc(r.duracion)}</b><span>${T().durada}</span></div>
    </div>
    <p class="ruta__trobada">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      ${esc(camp(r,"puntoEncuentro"))}
    </p>
    <details class="ruta__mes">
      <summary>${T().material}</summary>
      <p><b>${T().calPortar}</b> ${esc(camp(r,"material"))}</p>
      ${r.avis ? `<p class="ruta__avis">${esc(camp(r,"avis"))}</p>` : ''}
    </details>
    <div class="ruta__peu">
      <span class="ruta__preu">${esc(r.precio)}<small>${T().perPersona}</small></span>
      ${r.especial ? `<a class="btn btn--crema" href="/singles-montral/${idioma === 'es' ? '?lang=es' : ''}">${T().masInfo}</a>` : ''}
      <a class="btn ${r.especial ? 'btn--ocre' : 'btn--outline'}" href="#contacte" data-reserva="${esc(r.nombre)}">${T().reservar}</a>
    </div>
  </article>`;
}

/* ============================================================
   Rutes vigents: les que encara no han passat.
   La data final és r.data, excepte l'escapada de dos dies.
   ============================================================ */
const TALLER_GPS_FINAL = '2026-10-18';
function dataFinal(r){ return r.especial ? '2026-11-08' : r.data; }
function haPassat(dataIso){
  const avui = new Date(); avui.setHours(0, 0, 0, 0);
  return new Date(dataIso + 'T00:00:00') < avui;
}
const vigents = () => EXCURSIONS.filter(r => !haPassat(dataFinal(r)));

let filtreActual = 'totes';
/* Franja de l'escapada: només surt si hi ha una ruta especial que encara no ha passat,
   així desapareix tota sola quan passi la data. */
function pintarFranja(){
  const caixa = document.getElementById('franjaEspecial');
  const especial = vigents().find(r => r.especial);
  if (!especial) { caixa.hidden = true; caixa.innerHTML = ''; return; }
  caixa.hidden = false;
  caixa.innerHTML = `<a href="/singles-montral/${idioma === 'es' ? '?lang=es' : ''}">`
    + `<b>${T().franjaEspecial}</b><span>— ${T().franjaMes} →</span></a>`;
}

/* ============================================================
   ENLLAÇOS DE WHATSAPP
   El botó flotant apareix després d'un petit scroll; tant aquest
   com el de la secció de contacte porten el missatge en l'idioma actiu.
   ============================================================ */
const waFlotant = document.getElementById('waFlotant');
const waContacte = document.getElementById('wa-contacte');
const enllacWa = () => 'https://wa.me/34633459662?text=' + encodeURIComponent(T().waMissatge);
function pintarWaFlotant(){
  waFlotant.href = enllacWa();
  waFlotant.setAttribute('aria-label', T().waFlotantAria);
  waContacte.href = enllacWa();
}
const mostraWaFlotant = () => waFlotant.classList.toggle('is-visible', window.scrollY > 200);
window.addEventListener('scroll', mostraWaFlotant, {passive: true});

/* ============================================================
   PARÀMETRES DE LA URL
   ?lang=es  -> arrenca en castellà
   ?reserva= -> preselecciona aquella activitat al formulari
   ============================================================ */
function aplicaParametres(){
  const p = new URLSearchParams(location.search);
  if (p.get('lang') === 'es') canviaIdioma('es');
  const reserva = p.get('reserva');
  if (reserva && [...selectActivitat.options].some(o => o.value === reserva)) {
    selectActivitat.value = reserva;
  }
}

function pintarRutes(filtre){
  const f = filtre || filtreActual;
  filtreActual = f;
  const disponibles = vigents();
  const llista = f === 'totes' ? disponibles : disponibles.filter(r => r.nivell === f);

  contenidor.innerHTML = llista.length
    ? llista.map(plantillaRuta).join('')
    : `<p class="buit">${disponibles.length ? T().buit : T().capProgramada}</p>`;

  contenidor.querySelectorAll('.reveal').forEach(el => observador.observe(el));
}

/* Avís de la pròxima sortida al hero, calculat des de l'array */
function pintarProxima(){
  const avui = new Date(); avui.setHours(0, 0, 0, 0);
  const propera = EXCURSIONS.find(r => new Date(r.data + 'T00:00:00') >= avui);
  const r = propera || EXCURSIONS[0];
  const etiqueta = propera ? T().proxima : T().properes;
  document.getElementById('proxima').innerHTML = `
    <span class="proxima__et">${etiqueta}</span>
    <span class="proxima__cos">
      <span class="proxima__nom">${esc(camp(r,"fecha"))} · ${esc(r.nombre)}</span>
      <span class="proxima__dades">${esc(camp(r,"subtitol"))} · ${esc(r.distancia)} · ${esc(r.desnivel)} · ${esc(camp(r,"dificultad"))}</span>
    </span>
    <svg class="proxima__fletxa" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
}

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    pintarRutes(chip.dataset.filtre);
  });
});

/* ============================================================
   3b. CATÀLEG DE RUTES — rutes sota demanda (sense data fixada)
   ============================================================ */
const contenidorCat = document.getElementById('cataleg-rutes');

function plantillaCataleg(r){
  return `
  <article class="ruta reveal" data-dificultat-cat="${esc(r.dificultad)}">
    <div class="ruta__top">
      <span class="ruta__data ruta__data--demanda">${T().catSobDemanda}</span>
      <span class="ruta__dif ${classeDificultat(r.nivell)}">${esc(camp(r,"dificultad"))}</span>
    </div>
    <h3>${esc(r.nombre)}</h3>
    <p class="ruta__sub">${esc(camp(r,"subtitol"))} · ${esc(camp(r,"zona"))}</p>
    <p class="ruta__desc">${esc(camp(r,"descripcion"))}</p>
    <div class="ruta__dades">
      <div class="dada"><b>${esc(r.distancia)}</b><span>${T().distancia}</span></div>
      <div class="dada"><b>${esc(r.desnivel)}</b><span>${T().desnivell}</span></div>
      <div class="dada"><b>${esc(r.duracion)}</b><span>${T().durada}</span></div>
    </div>
    <details class="ruta__mes">
      <summary>${T().material}</summary>
      <p><b>${T().calPortar}</b> ${esc(camp(r,"material"))}</p>
      ${r.avis ? `<p class="ruta__avis">${esc(camp(r,"avis"))}</p>` : ''}
    </details>
    <div class="ruta__peu">
      <span class="ruta__preu">${esc(r.precio)}<small>${T().perPersona}</small></span>
      <a class="btn btn--outline" href="#contacte" data-reserva="${esc(r.nombre)}">${T().catReservar}</a>
    </div>
  </article>`;
}

let filtreCatActual = 'totes';

function pintarCataleg(filtre){
  if (!contenidorCat) return;
  const f = filtre || filtreCatActual;
  filtreCatActual = f;
  const llista = f === 'totes' ? CATALEG : CATALEG.filter(r => r.nivell === f);

  contenidorCat.innerHTML = llista.length
    ? llista.map(plantillaCataleg).join('')
    : `<p class="buit">${T().catBuit}</p>`;

  contenidorCat.querySelectorAll('.reveal').forEach(el => observador.observe(el));
}

document.querySelectorAll('.chip--cat').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip--cat').forEach(c => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', 'true');
    pintarCataleg(chip.dataset.filtreCat);
  });
});

/* ============================================================
   4. FORMULARI — desplegable d'activitats i enviament per correu
   ============================================================ */
const selectActivitat = document.getElementById('activitat');
function pintarActivitats(){
  const triat = selectActivitat.value;
  selectActivitat.innerHTML =
    `<option value="">${T().senseDecidir}</option>` +
    vigents().map(r => `<option value="${esc(r.nombre)}">${esc(r.nombre)} — ${esc(camp(r,'fecha'))}</option>`).join('') +
    CATALEG.map(r => `<option value="${esc(r.nombre)}">${esc(r.nombre)} — ${T().catSobDemanda}</option>`).join('') +
    (haPassat(TALLER_GPS_FINAL) ? '' : `<option value="Taller pràctic de GPS: OruxMaps i Wikiloc">${T().tallerOpcio}</option>`);
  selectActivitat.value = triat;   /* no es perd el que ja havia triat l'usuari */
}
pintarActivitats();

/* Els botons "Reservar plaça" preseleccionen l'activitat */
document.addEventListener('click', e => {
  const boto = e.target.closest('[data-reserva]');
  if (!boto) return;
  selectActivitat.value = boto.dataset.reserva;
});

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (!f.nom.value.trim() || !f.email.value.trim()) {
    alert(T().falten);
    return;
  }
  const activitat = f.activitat.value || T().consulta;
  const cos = [
    T().cNom + ': ' + f.nom.value,
    T().cCorreu + ': ' + f.email.value,
    T().cTelefon + ': ' + (f.telefon.value || '-'),
    T().cActivitat + ': ' + activitat,
    T().cPlaces + ': ' + f.places.value,
    '',
    f.missatge.value || T().senseMissatge
  ].join('\n');
  window.location.href = 'mailto:Territoriapeu@gmail.com'
    + '?subject=' + encodeURIComponent(T().assumpte + activitat)
    + '&body=' + encodeURIComponent(cos);
});

/* ============================================================
   5. CAPÇALERA I MENÚ MÒBIL
   ============================================================ */
const header = document.getElementById('header');
const marcarHeader = () => header.classList.toggle('is-solid', window.scrollY > 40);
marcarHeader();
window.addEventListener('scroll', marcarHeader, {passive: true});

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const obert = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!obert));
  burger.setAttribute('aria-label', obert ? 'Obrir el menú' : 'Tancar el menú');
  nav.classList.toggle('is-open', !obert);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ============================================================
   6. DADES ESTRUCTURADES per a Google
   Es generen des del mateix array: si canvies la programació,
   no cal tocar res més perquè Google en vegi les dates noves.
   ============================================================ */
function dadesEstructurades(){
  const web = document.querySelector('link[rel="canonical"]').href;
  const adreca = {
    "@type": "PostalAddress",
    addressLocality: "Alcover",
    addressRegion: "Tarragona",
    addressCountry: "ES"
  };

  const negoci = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "Territori a Peu",
    slogan: "Coneix la teva terra",
    description: document.querySelector('meta[name="description"]').content,
    url: web,
    image: web + "og.jpg",
    email: "Territoriapeu@gmail.com",
    telephone: "+34633459662",
    sameAs: ["https://www.instagram.com/territoriapeu"],
    address: adreca,
    areaServed: ["Alcover", "Muntanyes de Prades", "Montsant", "Priorat"],
    priceRange: "18-57 €",
    founder: {
      "@type": "Person",
      name: "David Velasco Tenor",
      jobTitle: "Guia de senderisme en baixa muntanya"
    }
  };

  const activitats = vigents().map(r => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: r.nombre,
    description: r.descripcion,
    startDate: r.data + (r.especial ? "T09:00" : "T08:00"),
    ...(r.especial ? { endDate: "2026-11-08" } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: r.especial
      ? { "@type": "Place", name: "Refugi de Mont-ral",
          address: { "@type": "PostalAddress", addressLocality: "Mont-ral", addressRegion: "Tarragona", addressCountry: "ES" } }
      : { "@type": "Place", name: "Aparcament d'Alcover", address: adreca },
    organizer: { "@type": "Organization", name: "Territori a Peu", url: web },
    offers: {
      "@type": "Offer",
      price: r.precio.replace(/[^\d.,]/g, '').replace(',', '.'),
      priceCurrency: "EUR",
      url: web + "#excursions",
      availability: "https://schema.org/InStock"
    }
  }));

  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify([negoci, ...activitats]);
  document.head.appendChild(s);
}

/* ============================================================
   CANVI D'IDIOMA
   Substitueix els textos marcats i torna a pintar les parts
   que genera el JavaScript. No recarrega la pàgina.
   ============================================================ */
function canviaIdioma(nou){
  if (nou === idioma) return;
  idioma = nou;
  document.documentElement.lang = nou;

  document.querySelectorAll('[data-ca]').forEach(el => {
    const text = el.dataset[nou];
    if (text !== undefined) el.innerHTML = text;
  });
  document.querySelectorAll('[data-ca-ph]').forEach(el => {
    el.placeholder = nou === 'es' ? el.dataset.esPh : el.dataset.caPh;
  });
  document.querySelectorAll('[data-ca-aria]').forEach(el => {
    el.setAttribute('aria-label', nou === 'es' ? el.dataset.esAria : el.dataset.caAria);
  });

  document.title = T().titol;
  document.querySelector('meta[name="description"]').content = T().descripcio;

  document.querySelectorAll('.idioma').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.idioma === nou)));

  pintarProxima();
  pintarRutes();
  pintarCataleg();
  pintarActivitats();
  pintarFranja();
  pintarWaFlotant();
}
document.querySelectorAll('.idioma').forEach(boto =>
  boto.addEventListener('click', () => canviaIdioma(boto.dataset.idioma)));

/* Arrencada */
dadesEstructurades();
pintarProxima();
pintarRutes();
pintarCataleg();
pintarFranja();
pintarWaFlotant();
mostraWaFlotant();
aplicaParametres();
document.querySelectorAll('.reveal').forEach(el => observador.observe(el));
