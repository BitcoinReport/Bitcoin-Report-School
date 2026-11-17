/*
 * Configurazione condivisa delle iscrizioni al percorso Bitcoin (secondo ciclo).
 * Caricato dalla pagina di iscrizione (workshop.html) e da tutte le pagine con il banner.
 *
 * LA DATA DI SCADENZA DELL'EARLY BIRD STA SOLO QUI (earlyBirdDeadline).
 * Offset esplicito +01:00: il 22 novembre 2026 e' ora solare (CET).
 * Fino a quell'istante incluso: early bird. Dal secondo successivo: prezzo pieno.
 */
(function () {
  var cfg = {
    earlyBirdDeadline: '2026-11-22T23:59:59+01:00',
    priceEarly: 170,
    priceFull: 200,
    cycleStart: '2026-12-01T00:00:00+01:00', // workshop del ciclo = data >= di questa
    expectedWorkshops: 8,
    // Pagamento in bitcoin (onchain) con fatture BTCPay Server Italia:
    // link early bird fino alla scadenza, link prezzo pieno dopo.
    btcPayEarly: 'https://pos.btcpayserver.it/apps/2cbez9ZCV1ocAe73xzMpkbBbG3fF/pos',
    btcPayFull: 'https://pos.btcpayserver.it/apps/4XzwDVx7FNtmjQ227FK9DLmEkiNs/pos',
    startLabel: '3 dicembre'
  };

  cfg.isEarlyBird = function (now) {
    var t = (now instanceof Date ? now : new Date()).getTime();
    return t <= new Date(cfg.earlyBirdDeadline).getTime();
  };

  cfg.btcPayLink = function (now) {
    return cfg.isEarlyBird(now) ? cfg.btcPayEarly : cfg.btcPayFull;
  };

  cfg.currentPrice = function (now) {
    return cfg.isEarlyBird(now) ? cfg.priceEarly : cfg.priceFull;
  };

  // "22 novembre" ricavato dalla scadenza, in fuso Europe/Rome
  cfg.deadlineDayLabel = function () {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric', month: 'long', timeZone: 'Europe/Rome'
    }).format(new Date(cfg.earlyBirdDeadline));
  };

  cfg.bannerTitle = function (now) {
    var t = 'Percorso Bitcoin dal ' + cfg.startLabel;
    if (cfg.isEarlyBird(now)) {
      t += ' \u00b7 Early bird ' + cfg.priceEarly + ' \u20ac fino al ' + cfg.deadlineDayLabel();
    }
    return t;
  };

  window.WS_CONFIG = cfg;

  // Stile del banner, piu' visibile di quello base presente nelle pagine. Sta qui
  // (un solo posto) e viene inserito in <head> prima che la pagina venga disegnata.
  var st = document.createElement('style');
  st.textContent =
    '.workshop-banner{background:linear-gradient(90deg,rgba(247,147,26,0.24) 0%,rgba(247,147,26,0.10) 55%,rgba(34,211,160,0.10) 100%);' +
    'border-bottom:2px solid rgba(247,147,26,0.7);padding:0.95rem 2rem;box-shadow:0 2px 14px rgba(247,147,26,0.12)}' +
    '.workshop-banner-date{font-size:0.66rem;font-weight:700;color:var(--gold)}' +
    '.workshop-banner-date::before{content:"\\25CF  ";font-size:0.55rem;vertical-align:middle}' +
    '.workshop-banner-title{font-size:0.9rem;font-weight:700;letter-spacing:0.01em}' +
    '.workshop-banner-cta{background:var(--gold);color:#07080a;border-color:var(--gold);font-weight:700;padding:0.55rem 1.2rem}' +
    '.workshop-banner-cta:hover{background:#ffa733;color:#07080a;border-color:#ffa733}' +
    '@media(max-width:700px){.workshop-banner{padding:0.8rem 1rem}.workshop-banner-title{font-size:0.82rem}}';
  document.head.appendChild(st);

  // Banner: l'HTML statico mostra la versione "dopo la scadenza";
  // prima della scadenza il testo viene completato con l'early bird.
  function updateBanners() {
    var els = document.querySelectorAll('.workshop-banner-title');
    for (var i = 0; i < els.length; i++) els[i].textContent = cfg.bannerTitle();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBanners);
  } else {
    updateBanners();
  }
})();
