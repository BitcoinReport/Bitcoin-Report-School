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
    startLabel: '3 dicembre'
  };

  cfg.isEarlyBird = function (now) {
    var t = (now instanceof Date ? now : new Date()).getTime();
    return t <= new Date(cfg.earlyBirdDeadline).getTime();
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
      t += ' · Early bird ' + cfg.priceEarly + ' € fino al ' + cfg.deadlineDayLabel();
    }
    return t;
  };

  window.WS_CONFIG = cfg;

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
