(function () {
  var AUTH_KEY = "georank_logged_in";

  function applyAuthState() {
    var loggedIn = localStorage.getItem(AUTH_KEY) === "1";
    var guest = document.getElementById("header-guest");
    var user = document.getElementById("header-user");
    if (!guest || !user) return;
    guest.hidden = loggedIn;
    user.hidden = !loggedIn;
  }

  function closeProfileMenu() {
    var menu = document.getElementById("profile-menu");
    var btn = document.getElementById("profile-btn");
    if (menu) {
      menu.hidden = true;
    }
    if (btn) {
      btn.setAttribute("aria-expanded", "false");
    }
  }

  function toggleProfileMenu() {
    var menu = document.getElementById("profile-menu");
    var btn = document.getElementById("profile-btn");
    if (!menu || !btn) return;
    var open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  var loginBtn = document.getElementById("btn-login");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      localStorage.setItem(AUTH_KEY, "1");
      applyAuthState();
    });
  }

  var logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem(AUTH_KEY);
      applyAuthState();
      closeProfileMenu();
      var path = "";
      try {
        path = window.location.pathname || "";
      } catch (e) {}
      var inRegions = path.indexOf("/regions/") !== -1 || /regions[\\/]/i.test(String(window.location.href || ""));
      window.location.href = inRegions ? "../index.html" : "index.html";
    });
  }

  var profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleProfileMenu();
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".profile-wrap")) return;
    closeProfileMenu();
  });

  applyAuthState();
  renderScoresPage();

  document.querySelectorAll(".mode-buttons").forEach(function (group) {
    var buttons = group.querySelectorAll("button[data-active]");
    if (buttons.length < 2) return;
    var first = buttons[0];
    var second = buttons[1];
    function setActive(useFirst) {
      first.dataset.active = useFirst ? "true" : "false";
      second.dataset.active = useFirst ? "false" : "true";
    }
    first.addEventListener("click", function () {
      setActive(true);
    });
    second.addEventListener("click", function () {
      setActive(false);
    });
  });

  document.querySelectorAll(".progress-ring[data-pct]").forEach(function (el) {
    var p = el.getAttribute("data-pct");
    el.style.setProperty("--pct", p != null ? p : "0");
  });

  var lastQuizTitle = "";
  var lastQuizAnchor = null;
  var SCORE_HISTORY_KEY = "georank_ranked_history_v1";
  var SCORE_HISTORY_MAX = 100;

  function loadRankedHistory() {
    try {
      var raw = localStorage.getItem(SCORE_HISTORY_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveRankedHistory(items) {
    try {
      localStorage.setItem(SCORE_HISTORY_KEY, JSON.stringify(items.slice(0, SCORE_HISTORY_MAX)));
    } catch (e) {}
  }

  function appendRankedHistory(entry) {
    var items = loadRankedHistory();
    items.unshift(entry);
    saveRankedHistory(items);
  }

  function formatDateTime(ts) {
    try {
      return new Date(ts).toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "—";
    }
  }

  function formatSecShort(sec) {
    var n = Math.max(0, Math.floor(sec || 0));
    var m = Math.floor(n / 60);
    var s = n % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function ensureScoresClipModal() {
    var existing = document.getElementById("scores-clip-modal");
    if (existing) return existing;
    var root = document.createElement("div");
    root.id = "scores-clip-modal";
    root.className = "scores-clip-modal";
    root.hidden = true;
    root.innerHTML =
      '<div class="scores-clip-modal__backdrop" data-close="1"></div>' +
      '<div class="scores-clip-modal__card" role="dialog" aria-modal="true" aria-labelledby="scores-clip-title">' +
      '<h3 id="scores-clip-title" class="scores-clip-modal__title">Clip classé</h3>' +
      '<p class="scores-clip-modal__meta" id="scores-clip-meta">—</p>' +
      '<div class="scores-clip-modal__current" id="scores-clip-current">—</div>' +
      '<div class="scores-clip-modal__actions">' +
      '<button type="button" id="scores-clip-play" class="scores-clip-btn">Lire</button>' +
      '<button type="button" id="scores-clip-next" class="scores-clip-btn">Suivant</button>' +
      '<button type="button" id="scores-clip-close" class="scores-clip-btn scores-clip-btn--close">Fermer</button>' +
      "</div></div>";
    document.body.appendChild(root);
    return root;
  }

  var clipPlayerState = { timer: null, events: [], idx: -1 };

  function stopClipPlayback() {
    if (clipPlayerState.timer) {
      clearInterval(clipPlayerState.timer);
      clipPlayerState.timer = null;
    }
  }

  function renderClipStep() {
    var cur = document.getElementById("scores-clip-current");
    if (!cur) return;
    if (clipPlayerState.idx < 0 || clipPlayerState.idx >= clipPlayerState.events.length) {
      cur.textContent = "Fin du clip.";
      return;
    }
    var e = clipPlayerState.events[clipPlayerState.idx];
    cur.textContent =
      "[" +
      formatSecShort(e.t) +
      "] " +
      e.action +
      (e.target ? " · cible: " + e.target : "") +
      (e.guess ? " · réponse: " + e.guess : "") +
      (e.ok == null ? "" : e.ok ? " · OK" : " · Faux");
  }

  function openClipModal(entry) {
    var modal = ensureScoresClipModal();
    var title = document.getElementById("scores-clip-title");
    var meta = document.getElementById("scores-clip-meta");
    if (title) title.textContent = "Clip classé · " + (entry.quizTitle || "Quiz");
    if (meta) meta.textContent = (entry.modeLabel || "ranked") + " · " + formatDateTime(entry.timestamp);
    clipPlayerState.events = Array.isArray(entry.clip) ? entry.clip : [];
    clipPlayerState.idx = clipPlayerState.events.length ? 0 : -1;
    renderClipStep();
    modal.hidden = false;

    var playBtn = document.getElementById("scores-clip-play");
    var nextBtn = document.getElementById("scores-clip-next");
    var closeBtn = document.getElementById("scores-clip-close");
    if (playBtn) {
      playBtn.onclick = function () {
        if (!clipPlayerState.events.length) return;
        stopClipPlayback();
        clipPlayerState.idx = 0;
        renderClipStep();
        clipPlayerState.timer = setInterval(function () {
          clipPlayerState.idx++;
          renderClipStep();
          if (clipPlayerState.idx >= clipPlayerState.events.length - 1) {
            stopClipPlayback();
          }
        }, 900);
      };
    }
    if (nextBtn) {
      nextBtn.onclick = function () {
        if (!clipPlayerState.events.length) return;
        stopClipPlayback();
        clipPlayerState.idx = Math.min(clipPlayerState.events.length - 1, clipPlayerState.idx + 1);
        renderClipStep();
      };
    }
    function closeModal() {
      stopClipPlayback();
      modal.hidden = true;
    }
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.onclick = function (ev) {
      var t = ev.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "1") {
        closeModal();
      }
    };
  }

  function renderScoresPage() {
    var tbody = document.getElementById("scores-tbody");
    if (!tbody) return;
    var rows = loadRankedHistory();
    if (!rows.length) {
      tbody.innerHTML =
        '<tr><td colspan="8" class="account-scores-empty">Aucune partie classée enregistrée pour le moment.</td></tr>';
      return;
    }
    tbody.innerHTML = "";
    rows.forEach(function (it) {
      var tr = document.createElement("tr");
      var clipCell =
        it.clip && it.clip.length
          ? '<button type="button" class="account-clip-btn" data-clip-id="' + it.id + '">Voir clip</button>'
          : '<span class="account-clip-none">—</span>';
      tr.innerHTML =
        "<td>" +
        (it.quizTitle || "Quiz") +
        "</td>" +
        "<td>" +
        (it.modeLabel || "Ranked") +
        "</td>" +
        "<td>" +
        it.correct +
        " / " +
        it.total +
        "</td>" +
        "<td>" +
        it.pct +
        "%</td>" +
        "<td>" +
        (it.rank || "—") +
        "</td>" +
        "<td>" +
        formatSecShort(it.durationSec || 0) +
        "</td>" +
        "<td>" +
        formatDateTime(it.timestamp) +
        "</td>" +
        "<td>" +
        clipCell +
        "</td>";
      tbody.appendChild(tr);
    });
    tbody.onclick = function (e) {
      var btn = e.target.closest && e.target.closest("button[data-clip-id]");
      if (!btn) return;
      var id = btn.getAttribute("data-clip-id");
      var entry = rows.find(function (x) {
        return x.id === id;
      });
      if (entry) openClipModal(entry);
    };
  }

  /* Panneau de lancement mini-jeu (scroll pour voir le catalogue en dessous) */
  var SVG_PIN =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>';
  /* Curseur « I » (saisie au clavier) */
  var SVG_TYPE =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path stroke="currentColor" stroke-width="2" stroke-linecap="square" d="M12 5v14M9 5h6M9 19h6"/></svg>';
  var SVG_FS =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';

  function ensureGameLaunch() {
    var catalog = document.querySelector(".quiz-catalog");
    if (!catalog) return null;
    var root = document.getElementById("game-launch-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "game-launch-root";
    root.className = "game-launch";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-labelledby", "game-launch-title");
    root.setAttribute("aria-modal", "false");
    root.hidden = true;
    root.innerHTML =
      '<div class="game-launch__card" id="game-launch-fs-target">' +
      '<div class="game-launch__mapbg" aria-hidden="true"></div>' +
      '<div class="game-launch__content">' +
      '<div class="game-launch__bar">' +
      '<button type="button" class="game-launch__back" id="game-launch-back">← Retour</button>' +
      '<div class="game-launch__actions">' +
      '<button type="button" class="game-launch__pill" id="game-launch-challenge">Créer un défi</button>' +
      '<button type="button" class="game-launch__fs" id="game-launch-fs" aria-label="Plein écran">' +
      SVG_FS +
      "</button>" +
      "</div></div>" +
      '<div class="game-launch__center">' +
      '<div class="game-launch__globe" id="game-launch-globe" aria-hidden="true">🌍</div>' +
      '<h2 class="game-launch__title" id="game-launch-title">Quiz</h2>' +
      '<p class="game-launch__mode-cap">MODE DE JEU</p>' +
      '<div class="game-launch-modes" role="radiogroup" aria-label="Mode de jeu" id="game-launch-modes">' +
      '<button type="button" class="game-launch-mode" role="radio" data-mode="pin" data-active="true" aria-checked="true" aria-label="Mode épingler">' +
      SVG_PIN +
      '<span class="game-launch-mode__lbl">EPINGLER</span></button>' +
      '<button type="button" class="game-launch-mode" role="radio" data-mode="type" data-active="false" aria-checked="false" aria-label="Mode saisir">' +
      SVG_TYPE +
      '<span class="game-launch-mode__lbl">SAISIR</span></button>' +
      "</div>" +
      '<div class="game-launch__ranked" id="game-launch-ranked-wrap" hidden>' +
      '<p class="game-launch__ranked-cap">Mode classé · temps limité</p>' +
      '<p class="game-launch__ranked-desc">Choisis une durée : le chrono affiche le temps restant (cooldown). Le rang dépend du score.</p>' +
      '<div class="game-launch__durations" role="radiogroup" aria-label="Durée du défi classé">' +
      '<label class="game-launch__dur"><input type="radio" name="ranked-dur" value="free" checked /> Partie libre</label>' +
      '<label class="game-launch__dur"><input type="radio" name="ranked-dur" value="25" /> 25 s</label>' +
      '<label class="game-launch__dur"><input type="radio" name="ranked-dur" value="45" /> 45 s</label>' +
      '<label class="game-launch__dur"><input type="radio" name="ranked-dur" value="90" /> 1 min 30</label>' +
      "</div></div>" +
      '<button type="button" class="game-launch__cta" id="game-launch-start">Commencer le quiz</button>' +
      "</div></div></div>";

    catalog.parentNode.insertBefore(root, catalog);
    bindGameLaunch(root);
    return root;
  }

  /** Défis autorisés pour le mode classé : ajoute data-ranked="true" sur le lien du mini-jeu. */
  function isRankedEligible(anchor) {
    return !!(anchor && anchor.getAttribute("data-ranked") === "true");
  }

  function updateLaunchRankedVisibility(root) {
    var wrap = document.getElementById("game-launch-ranked-wrap");
    if (!wrap) return;
    var pinOn = root.querySelector('.game-launch-mode[data-mode="pin"][data-active="true"]');
    var show = !!(pinOn && lastQuizAnchor && isRankedEligible(lastQuizAnchor));
    wrap.hidden = !show;
  }

  function setGameLaunchMode(root, mode) {
    root.querySelectorAll(".game-launch-mode").forEach(function (btn) {
      var on = btn.getAttribute("data-mode") === mode;
      btn.dataset.active = on ? "true" : "false";
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
    syncRegionPageMode(mode);
    updateLaunchRankedVisibility(root);
  }

  /** Aligne la rangée « MODE DE JEU » du haut de page (EPINGLER / SAISIR) sur l’overlay. */
  function syncRegionPageMode(mode) {
    var group = document.querySelector(".region-page .mode-buttons");
    if (!group) return;
    var btns = group.querySelectorAll("button[data-active]");
    if (btns.length < 2) return;
    var useSecond = mode === "type";
    btns[0].dataset.active = useSecond ? "false" : "true";
    btns[1].dataset.active = useSecond ? "true" : "false";
  }

  /** Lit la page pour pré-sélectionner l’overlay selon EPINGLER / SAISIR déjà choisis. */
  function getModeFromRegionPage() {
    var group = document.querySelector(".region-page .mode-buttons");
    if (!group) return "pin";
    var btns = group.querySelectorAll("button[data-active]");
    if (btns.length < 2) return "pin";
    return btns[1].getAttribute("data-active") === "true" ? "type" : "pin";
  }

  function bindGameLaunch(root) {
    var fsTarget = document.getElementById("game-launch-fs-target");
    var fsBtn = document.getElementById("game-launch-fs");

    document.getElementById("game-launch-back").addEventListener("click", function () {
      closeGameLaunch();
    });

    fsBtn.addEventListener("click", function () {
      var el = fsTarget;
      var doc = document;
      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        var req =
          el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen;
        if (req) {
          req.call(el);
        }
      } else {
        var exit =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;
        if (exit) exit.call(doc);
      }
    });

    root.querySelector("#game-launch-modes").addEventListener("click", function (e) {
      var btn = e.target.closest(".game-launch-mode");
      if (!btn) return;
      var m = btn.getAttribute("data-mode");
      if (m === "pin" || m === "type") {
        setGameLaunchMode(root, m);
      }
    });

    document.getElementById("game-launch-challenge").addEventListener("click", function () {
      /* réservé */
    });

    document.getElementById("game-launch-start").addEventListener("click", function () {
      var modeBtn = root.querySelector('.game-launch-mode[data-active="true"]');
      var mode = modeBtn ? modeBtn.getAttribute("data-mode") : "pin";
      var casual = true;
      var rankedSec = null;
      var rw = document.getElementById("game-launch-ranked-wrap");
      if (rw && !rw.hidden) {
        var inp = rw.querySelector('input[name="ranked-dur"]:checked');
        if (inp && inp.value !== "free") {
          casual = false;
          rankedSec = parseInt(inp.value, 10);
        }
      }
      closeGameLaunch();
      if (mode === "pin") {
        openGamePin({ casual: casual, rankedSeconds: rankedSec, typingMode: false });
      } else {
        if (isFlagsQuiz()) {
          openGamePin({ casual: true, rankedSeconds: null, typingMode: true });
        } else {
          window.alert("Le mode Saisir est disponible pour les quiz de drapeaux.");
        }
      }
    });
  }

  function closeGameLaunch() {
    var root = document.getElementById("game-launch-root");
    if (!root || root.hidden) return;
    var doc = document;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      var exit =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;
      if (exit) {
        exit.call(doc).catch(function () {});
      }
    }
    root.hidden = true;
  }

  function openGameLaunch(anchor) {
    var root = ensureGameLaunch();
    if (!root) return;
    lastQuizAnchor = anchor;
    var labelEl = anchor.querySelector(".quiz-link-row__label");
    var flagEl = anchor.querySelector(".quiz-link-row__flag");
    var title = document.getElementById("game-launch-title");
    var globe = document.getElementById("game-launch-globe");
    if (labelEl) {
      title.textContent = labelEl.textContent.trim();
      lastQuizTitle = labelEl.textContent.trim();
    }
    if (globe && flagEl) {
      var t = flagEl.textContent.trim();
      globe.textContent = t || "🌍";
    }
    setGameLaunchMode(root, getModeFromRegionPage());
    updateLaunchRankedVisibility(root);
    root.hidden = false;
    root.scrollIntoView({ behavior: "smooth", block: "start" });
    var back = document.getElementById("game-launch-back");
    if (back) back.focus();
  }

  document.addEventListener(
    "click",
    function (e) {
      var a = e.target.closest && e.target.closest("a.quiz-link-row");
      if (!a) return;
      var raw = a.getAttribute("href");
      if (raw && raw !== "#") return;
      e.preventDefault();
      openGameLaunch(a);
    },
    true
  );

  /* ——— Jeu Épingler (barre + carte Europe — même coque pour tout défi « pin ») ——— */
  var PIN_TOTAL = 46;
  var SVG_SKIP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5l14 7-14 7V5z"/><path d="M19 5v14"/></svg>';

  function getEuropeMapData() {
    try {
      return window.GEORANK_EUROPE_MAP || null;
    } catch (e) {
      return null;
    }
  }

  /** Quiz « capitales » : consigne sur la ville (points), pas sur le pays. */
  function isCapitalsPinQuiz() {
    return /capitale/i.test(lastQuizTitle || "");
  }

  /** Quiz silhouettes/contours : grille de formes séparées, comme Seterra. */
  function isSilhouettePinQuiz() {
    return /silhouette|contour/i.test(lastQuizTitle || "");
  }

  function isFlagsQuiz() {
    return /drapeau/i.test(lastQuizTitle || "");
  }

  var EUROPE_FLAG_ITEMS = [
    { id: "al", name: "Albanie", flag: "🇦🇱", answers: ["Albanie"] },
    { id: "de", name: "Allemagne", flag: "🇩🇪", answers: ["Allemagne"] },
    { id: "ad", name: "Andorre", flag: "🇦🇩", answers: ["Andorre"] },
    { id: "at", name: "Autriche", flag: "🇦🇹", answers: ["Autriche"] },
    { id: "be", name: "Belgique", flag: "🇧🇪", answers: ["Belgique"] },
    { id: "by", name: "Biélorussie", flag: "🇧🇾", answers: ["Biélorussie", "Bielorussie"] },
    { id: "ba", name: "Bosnie-Herzégovine", flag: "🇧🇦", answers: ["Bosnie-Herzégovine", "Bosnie Herzegovine"] },
    { id: "bg", name: "Bulgarie", flag: "🇧🇬", answers: ["Bulgarie"] },
    { id: "cy", name: "Chypre", flag: "🇨🇾", answers: ["Chypre"] },
    { id: "hr", name: "Croatie", flag: "🇭🇷", answers: ["Croatie"] },
    { id: "dk", name: "Danemark", flag: "🇩🇰", answers: ["Danemark"] },
    { id: "es", name: "Espagne", flag: "🇪🇸", answers: ["Espagne"] },
    { id: "ee", name: "Estonie", flag: "🇪🇪", answers: ["Estonie"] },
    { id: "fi", name: "Finlande", flag: "🇫🇮", answers: ["Finlande"] },
    { id: "fr", name: "France", flag: "🇫🇷", answers: ["France"] },
    { id: "gr", name: "Grèce", flag: "🇬🇷", answers: ["Grèce", "Grece"] },
    { id: "hu", name: "Hongrie", flag: "🇭🇺", answers: ["Hongrie"] },
    { id: "ie", name: "Irlande", flag: "🇮🇪", answers: ["Irlande"] },
    { id: "is", name: "Islande", flag: "🇮🇸", answers: ["Islande"] },
    { id: "it", name: "Italie", flag: "🇮🇹", answers: ["Italie"] },
    { id: "xk", name: "Kosovo", flag: "🇽🇰", answers: ["Kosovo"] },
    { id: "lv", name: "Lettonie", flag: "🇱🇻", answers: ["Lettonie"] },
    { id: "li", name: "Liechtenstein", flag: "🇱🇮", answers: ["Liechtenstein"] },
    { id: "lt", name: "Lituanie", flag: "🇱🇹", answers: ["Lituanie"] },
    { id: "lu", name: "Luxembourg", flag: "🇱🇺", answers: ["Luxembourg"] },
    { id: "mk", name: "Macédoine du Nord", flag: "🇲🇰", answers: ["Macédoine du Nord", "Macedoine du Nord"] },
    { id: "mt", name: "Malte", flag: "🇲🇹", answers: ["Malte"] },
    { id: "md", name: "Moldavie", flag: "🇲🇩", answers: ["Moldavie"] },
    { id: "mc", name: "Monaco", flag: "🇲🇨", answers: ["Monaco"] },
    { id: "me", name: "Monténégro", flag: "🇲🇪", answers: ["Monténégro", "Montenegro"] },
    { id: "no", name: "Norvège", flag: "🇳🇴", answers: ["Norvège", "Norvege"] },
    { id: "nl", name: "Pays-Bas", flag: "🇳🇱", answers: ["Pays-Bas", "Pays Bas"] },
    { id: "pl", name: "Pologne", flag: "🇵🇱", answers: ["Pologne"] },
    { id: "pt", name: "Portugal", flag: "🇵🇹", answers: ["Portugal"] },
    { id: "ro", name: "Roumanie", flag: "🇷🇴", answers: ["Roumanie"] },
    { id: "gb", name: "Royaume-Uni", flag: "🇬🇧", answers: ["Royaume-Uni", "Royaume Uni"] },
    { id: "ru", name: "Russie", flag: "🇷🇺", answers: ["Russie"] },
    { id: "sm", name: "Saint-Marin", flag: "🇸🇲", answers: ["Saint-Marin", "Saint Marin"] },
    { id: "rs", name: "Serbie", flag: "🇷🇸", answers: ["Serbie"] },
    { id: "sk", name: "Slovaquie", flag: "🇸🇰", answers: ["Slovaquie"] },
    { id: "si", name: "Slovénie", flag: "🇸🇮", answers: ["Slovénie", "Slovenie"] },
    { id: "se", name: "Suède", flag: "🇸🇪", answers: ["Suède", "Suede"] },
    { id: "ch", name: "Suisse", flag: "🇨🇭", answers: ["Suisse"] },
    { id: "cz", name: "Tchéquie", flag: "🇨🇿", answers: ["Tchéquie", "Tchequie", "République tchèque", "Republique tcheque"] },
    { id: "ua", name: "Ukraine", flag: "🇺🇦", answers: ["Ukraine"] },
    { id: "va", name: "Vatican", flag: "🇻🇦", answers: ["Vatican", "Cité du Vatican", "Cite du Vatican"] },
  ];

  function normalizeGuess(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function shuffled(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i];
      out[i] = out[j];
      out[j] = t;
    }
    return out;
  }

  var pinState = {
    queue: [],
    index: 0,
    correct: 0,
    wrong: 0,
    seconds: 0,
    timerId: null,
    countdownId: null,
    current: null,
    casual: true,
    rankedSeconds: null,
    timeLeft: 0,
    gameEnded: false,
    capitalMode: false,
    silhouetteMode: false,
    flagsMode: false,
    typingMode: false,
    clip: [],
    startedAtMs: 0,
    savedHistory: false,
    lastRankLabel: "",
  };

  function pushClipEvent(action, extra) {
    if (pinState.casual || pinState.savedHistory || !pinState.startedAtMs) return;
    var t = Math.max(0, Math.floor((Date.now() - pinState.startedAtMs) / 1000));
    pinState.clip.push({
      t: t,
      action: action,
      target: extra && extra.target ? extra.target : "",
      guess: extra && extra.guess ? extra.guess : "",
      ok: extra && Object.prototype.hasOwnProperty.call(extra, "ok") ? !!extra.ok : null,
    });
    if (pinState.clip.length > 500) {
      pinState.clip.shift();
    }
  }

  function currentModeLabel() {
    if (pinState.flagsMode && pinState.typingMode) return "Drapeaux · saisir";
    if (pinState.flagsMode) return "Drapeaux · épingler";
    if (pinState.capitalMode) return "Capitales · épingler";
    if (pinState.silhouetteMode) return "Silhouettes · épingler";
    return "Pays · épingler";
  }

  function persistRankedResult(reason) {
    if (pinState.casual || pinState.savedHistory) return;
    var durationSec = Math.max(0, Math.floor((Date.now() - pinState.startedAtMs) / 1000));
    var pct = Math.min(100, Math.round((pinState.correct / PIN_TOTAL) * 100));
    var entry = {
      id: "rk_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      timestamp: Date.now(),
      quizTitle: lastQuizTitle || "Quiz",
      modeLabel: currentModeLabel(),
      reason: reason,
      correct: pinState.correct,
      total: PIN_TOTAL,
      pct: pct,
      rank: pinState.lastRankLabel || rankFromPercent(pct).fullLabel,
      durationSec: durationSec,
      rankedSeconds: pinState.rankedSeconds || null,
      clip: pinState.clip.slice(),
    };
    appendRankedHistory(entry);
    pinState.savedHistory = true;
    renderScoresPage();
  }

  /* ——— Système de rang complet ——————————————————————————————————————————
   *  Barème sur % de bonnes réponses (correct / PIN_TOTAL * 100)
   *  Chaque tier contient 4 sous-rangs (IV → I).
   *  LP = points league (0-100 par sous-rang, 100 = promotion).
   */
  var RANK_TIERS = [
    {
      key: "fer",
      label: "Fer",
      cls: "game-pin-result__rank--fer",
      minPct: 0,
      maxPct: 14,
      color: "#6b7280",
      barColor: "#374151",
      barFill: "#4b5563",
      icon: "⚙️",
    },
    {
      key: "bronze",
      label: "Bronze",
      cls: "game-pin-result__rank--bronze",
      minPct: 14,
      maxPct: 28,
      color: "#cd7f32",
      barColor: "#c2410c",
      barFill: "#ef8c2e",
      icon: "🥉",
    },
    {
      key: "argent",
      label: "Argent",
      cls: "game-pin-result__rank--argent",
      minPct: 28,
      maxPct: 42,
      color: "#b0b8c8",
      barColor: "#6b7280",
      barFill: "#c0c7d3",
      icon: "🥈",
    },
    {
      key: "or",
      label: "Or",
      cls: "game-pin-result__rank--or",
      minPct: 42,
      maxPct: 56,
      color: "#facc15",
      barColor: "#a16207",
      barFill: "#eab308",
      icon: "🥇",
    },
    {
      key: "platine",
      label: "Platine",
      cls: "game-pin-result__rank--platine",
      minPct: 56,
      maxPct: 70,
      color: "#67e8f9",
      barColor: "#0e7490",
      barFill: "#22d3ee",
      icon: "💎",
    },
    {
      key: "rubis",
      label: "Rubis",
      cls: "game-pin-result__rank--rubis",
      minPct: 70,
      maxPct: 84,
      color: "#f43f5e",
      barColor: "#be123c",
      barFill: "#fb7185",
      icon: "♦️",
    },
    {
      key: "diamant",
      label: "Diamant",
      cls: "game-pin-result__rank--diamant",
      minPct: 84,
      maxPct: 100,
      color: "#38bdf8",
      barColor: "#0369a1",
      barFill: "#7dd3fc",
      icon: "🌟",
    },
  ];

  function rankFromPercent(pct) {
    var tier = RANK_TIERS[0];
    for (var i = RANK_TIERS.length - 1; i >= 0; i--) {
      if (pct >= RANK_TIERS[i].minPct) {
        tier = RANK_TIERS[i];
        break;
      }
    }
    /* Sous-rang I à IV : positionné dans la tranche du tier */
    var span = tier.maxPct - tier.minPct;
    var within = pct - tier.minPct;
    var subIdx = span > 0 ? Math.floor((within / span) * 4) : 0;
    subIdx = Math.min(3, Math.max(0, subIdx));
    var subLabels = ["IV", "III", "II", "I"];
    var subLabel = subLabels[subIdx];
    /* LP (0-100 dans le sous-rang) */
    var subSpan = span / 4;
    var subWithin = within - subIdx * subSpan;
    var lp = subSpan > 0 ? Math.round((subWithin / subSpan) * 100) : 0;
    lp = Math.min(100, Math.max(0, lp));
    /* Top % global (100 = bas, 1 = haut) */
    var topPct = Math.max(0.1, +(100 - pct).toFixed(2));
    return {
      tier: tier,
      label: tier.label,
      subLabel: subLabel,
      fullLabel: tier.label + " " + subLabel,
      cls: tier.cls,
      lp: lp,
      lpGain: Math.max(10, lp),
      topPct: topPct,
      pct: pct,
    };
  }

  function buildPinQueue() {
    var q = [];
    var M = getEuropeMapData();
    var cap = isCapitalsPinQuiz();
    var sil = !cap && isSilhouettePinQuiz();
    var flags = !cap && !sil && isFlagsQuiz();
    pinState.capitalMode = cap;
    pinState.silhouetteMode = sil;
    pinState.flagsMode = flags;
    if (flags) {
      q = shuffled(EUROPE_FLAG_ITEMS).slice(0, PIN_TOTAL).map(function (x) {
        return {
          kind: "f",
          id: x.id,
          name: x.name,
          flag: x.flag,
          answers: x.answers || [x.name],
        };
      });
      return q;
    }
    if (!M) {
      return q;
    } else if (cap) {
      var caps = M.capitals;
      var nc = caps.length;
      if (nc === 0) return q;
      for (var j = 0; j < PIN_TOTAL; j++) {
        var x = caps[Math.floor(Math.random() * nc)];
        q.push({
          kind: "k",
          id: x.id,
          city: x.city,
          name: x.name,
          flag: x.flag,
          iso: x.iso,
        });
      }
    } else {
      var lands = M.countries;
      var nl = lands.length;
      if (nl === 0) return q;
      for (var k = 0; k < PIN_TOTAL; k++) {
        var y = lands[Math.floor(Math.random() * nl)];
        q.push({
          kind: "c",
          iso: y.iso,
          name: y.name,
          flag: y.flag,
        });
      }
    }
    return q;
  }

  function applyPinMapMode(root) {
    if (!root) return;
    root.classList.toggle("game-pin--capitals", !!pinState.capitalMode);
    root.classList.toggle("game-pin--silhouettes", !!pinState.silhouetteMode);
    root.classList.toggle("game-pin--flags", !!pinState.flagsMode);
    root.classList.toggle("game-pin--typing", !!pinState.typingMode);
  }

  function layoutSilhouetteGrid() {
    if (!pinState.silhouetteMode) return;
    var svg = document.getElementById("game-pin-svg");
    var layer = document.getElementById("game-pin-silhouettes");
    if (!svg || !layer) return;
    var paths = Array.prototype.slice.call(layer.querySelectorAll("path[data-iso]"));
    if (!paths.length) return;
    var vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { width: 1000, height: 520 };
    var width = vb.width || 1000;
    var height = vb.height || 520;
    var cols = 6;
    var rows = Math.ceil(paths.length / cols);
    var padX = 34;
    var padY = 20;
    var cellW = (width - padX * 2) / cols;
    var cellH = (height - padY * 2) / rows;
    var inner = 10;
    paths.forEach(function (p, i) {
      p.removeAttribute("transform");
      var b;
      try {
        b = p.getBBox();
      } catch (e) {
        b = null;
      }
      if (!b || !b.width || !b.height) return;
      var s = Math.min((cellW - inner * 2) / b.width, (cellH - inner * 2) / b.height);
      var outW = b.width * s;
      var outH = b.height * s;
      var c = i % cols;
      var r = Math.floor(i / cols);
      var tx = padX + c * cellW + (cellW - outW) / 2;
      var ty = padY + r * cellH + (cellH - outH) / 2;
      p.setAttribute(
        "transform",
        "translate(" + tx + " " + ty + ") scale(" + s + ") translate(" + -b.x + " " + -b.y + ")"
      );
    });
  }

  function ensureGamePin() {
    var root = document.getElementById("game-pin-root");
    if (root) return root;
    root = document.createElement("div");
    root.id = "game-pin-root";
    root.className = "game-pin";
    root.setAttribute("aria-hidden", "true");
    root.hidden = true;
    root.innerHTML =
      '<header class="game-pin__bar">' +
      '<div class="game-pin__pill">' +
      '<span class="game-pin__pill-score" id="game-pin-score">0 / ' +
      PIN_TOTAL +
      "</span>" +
      '<span class="game-pin__pill-sep"></span>' +
      '<span id="game-pin-pct">0%</span>' +
      "</div>" +
      '<div class="game-pin__prompt">' +
      '<span class="game-pin__prompt-label">Cliquez sur</span> ' +
      '<span class="game-pin__target" id="game-pin-target">—</span> ' +
      '<button type="button" class="game-pin__skip" id="game-pin-skip" aria-label="Passer">' +
      SVG_SKIP +
      "</button>" +
      "</div>" +
      '<div class="game-pin__right">' +
      '<span class="game-pin__flag" id="game-pin-flagbar" aria-hidden="true"></span>' +
      '<div class="game-pin__timer" id="game-pin-timer">00:00</div>' +
      '<button type="button" class="game-pin__close" id="game-pin-close" aria-label="Fermer le quiz">×</button>' +
      "</div>" +
      "</header>" +
      '<div class="game-pin__map" id="game-pin-map">' +
      '<svg class="game-pin__svg" id="game-pin-svg" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet">' +
      '<rect id="game-pin-ocean" width="1000" height="520" fill="#9ec9ea"/>' +
      '<g id="game-pin-lands"></g>' +
      '<g id="game-pin-capitals" class="game-pin__capital-layer" aria-hidden="true"></g>' +
      '<g id="game-pin-silhouettes" class="game-pin__silhouette-layer" aria-hidden="true"></g>' +
      "</svg>" +
      '<div class="game-pin__flags-board" id="game-pin-flags-board" hidden></div>' +
      '<div class="game-pin__type-panel" id="game-pin-type-panel" hidden>' +
      '<div class="game-pin__type-flag" id="game-pin-type-flag" aria-hidden="true">🏳️</div>' +
      '<form class="game-pin__type-form" id="game-pin-type-form" autocomplete="off">' +
      '<input type="text" id="game-pin-type-input" class="game-pin__type-input" placeholder="Écrivez le pays" />' +
      '<button type="submit" class="game-pin__type-submit">Valider</button>' +
      "</form></div>" +
      '<div class="game-pin__tip" id="game-pin-tip" hidden>Cliquez sur <strong id="game-pin-tip-name">—</strong><span class="game-pin__tip-flag" id="game-pin-tip-flag"></span></div>' +
      '<div class="game-pin__subtitle" id="game-pin-subtitle"></div>' +
      /* ── HUD bottom ranked (visible uniquement en mode classé) ── */
      '<div class="game-pin__ranked-hud" id="game-pin-ranked-hud" aria-hidden="true">' +
        '<div class="game-pin__hud-timer">' +
          '<svg class="game-pin__hud-clock" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5V8l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
          '<span id="game-pin-hud-time">00:00</span>' +
        '</div>' +
        '<div class="game-pin__hud-score">' +
          '<span class="game-pin__hud-num" id="game-pin-hud-score">0</span>' +
          '<span class="game-pin__hud-label">POINTS</span>' +
        '</div>' +
      '</div>' +
      "</div>" +
      '<div class="game-pin-result" id="game-pin-result" hidden role="dialog" aria-modal="true" aria-labelledby="game-pin-result-title">' +
      '<div class="game-pin-result__backdrop"></div>' +
      '<div class="game-pin-result__card">' +
      /* ── Barre de progression multi-tiers ── */
      '<div class="rk-track" id="rk-track" aria-hidden="true">' +
      '<div class="rk-track__tiers" id="rk-track-tiers"></div>' +
      '<div class="rk-track__needle" id="rk-track-needle"><span class="rk-track__needle-label" id="rk-track-needle-label"></span></div>' +
      '<div class="rk-track__labels" id="rk-track-labels"></div>' +
      '</div>' +
      /* ── Points centraux ── */
      '<div class="rk-points"><span class="rk-points__num" id="rk-points-num">0</span><span class="rk-points__lbl">POINTS</span></div>' +
      /* ── Badge rang ── */
      '<div class="rk-badge" id="rk-badge">' +
      '<div class="rk-badge__shield" id="rk-badge-shield">' +
      '<svg class="rk-badge__wings" viewBox="0 0 120 72" aria-hidden="true"><path class="rk-badge__wing-l" d="M4 56 Q16 28 38 28 L42 40 Q26 40 18 60Z"/><path class="rk-badge__wing-r" d="M116 56 Q104 28 82 28 L78 40 Q94 40 102 60Z"/></svg>' +
      '<div class="rk-badge__body"><div class="rk-badge__star">★</div></div>' +
      '<div class="rk-badge__lp" id="rk-badge-lp">+0 LP</div>' +
      '</div>' +
      '<p class="rk-badge__name" id="rk-badge-name">—</p>' +
      '<p class="rk-badge__top" id="rk-badge-top">—</p>' +
      '</div>' +
      /* ── Pied : highscore message ── */
      '<p class="rk-footer" id="rk-footer">—</p>' +
      '<button type="button" class="game-pin-result__btn" id="game-pin-result-close">Fermer</button>' +
      "</div></div>";

    document.body.appendChild(root);

    var lands = document.getElementById("game-pin-lands");
    var capLayer = document.getElementById("game-pin-capitals");
    var silLayer = document.getElementById("game-pin-silhouettes");
    var flagsBoard = document.getElementById("game-pin-flags-board");
    var svg = document.getElementById("game-pin-svg");
    var ocean = document.getElementById("game-pin-ocean");
    var M = getEuropeMapData();
    if (M && ocean) {
      ocean.setAttribute("fill", M.ocean || "#9ec9ea");
      if (M.viewBox && M.viewBox.length === 4) {
        svg.setAttribute("viewBox", M.viewBox.join(" "));
      }
    }
    if (M && lands && capLayer && silLayer) {
      M.countries.forEach(function (c) {
        var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("class", "game-pin__land");
        p.setAttribute("data-iso", c.iso);
        p.setAttribute("d", c.d);
        lands.appendChild(p);
        var s = document.createElementNS("http://www.w3.org/2000/svg", "path");
        s.setAttribute("class", "game-pin__silhouette");
        s.setAttribute("data-iso", c.iso);
        s.setAttribute("d", c.d);
        silLayer.appendChild(s);
      });
      M.capitals.forEach(function (cap) {
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("class", "game-pin__capital-dot");
        circle.setAttribute("data-cap-id", cap.id);
        circle.setAttribute("data-iso", cap.iso);
        circle.setAttribute("cx", String(cap.cx));
        circle.setAttribute("cy", String(cap.cy));
        circle.setAttribute("r", "5");
        capLayer.appendChild(circle);
      });
    }
    if (flagsBoard) {
      EUROPE_FLAG_ITEMS.forEach(function (it) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "game-pin__flag-btn";
        b.setAttribute("data-flag-id", it.id);
        b.setAttribute("aria-label", it.name);
        b.innerHTML = '<span class="game-pin__flag-emoji" aria-hidden="true">' + it.flag + "</span>";
        flagsBoard.appendChild(b);
      });
      flagsBoard.addEventListener("click", function (e) {
        if (!pinState.flagsMode || pinState.typingMode) return;
        var btn = e.target.closest && e.target.closest("button[data-flag-id]");
        if (!btn) return;
        pinOnPick({ flagId: btn.getAttribute("data-flag-id"), el: btn });
      });
    }

    document.getElementById("game-pin-close").addEventListener("click", closeGamePin);
    document.getElementById("game-pin-skip").addEventListener("click", pinSkip);
    var resClose = document.getElementById("game-pin-result-close");
    if (resClose) {
      resClose.addEventListener("click", function () {
        document.getElementById("game-pin-result").hidden = true;
        closeGamePin();
      });
    }
    if (svg) {
      svg.addEventListener("click", function (e) {
        if (pinState.flagsMode) return;
        if (pinState.capitalMode) {
          var dot = e.target.closest && e.target.closest("circle[data-cap-id]");
          if (!dot) return;
          pinOnPick({ capId: dot.getAttribute("data-cap-id"), el: dot });
        } else if (pinState.silhouetteMode) {
          var sil = e.target.closest && e.target.closest("path.game-pin__silhouette[data-iso]");
          if (!sil) return;
          pinOnPick({ iso: sil.getAttribute("data-iso"), el: sil });
        } else {
          var path = e.target.closest && e.target.closest("path[data-iso]");
          if (!path) return;
          pinOnPick({ iso: path.getAttribute("data-iso"), el: path });
        }
      });
    }

    var typeForm = document.getElementById("game-pin-type-form");
    var typeInput = document.getElementById("game-pin-type-input");
    if (typeForm && typeInput) {
      typeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        pinSubmitTypeGuess();
      });
      typeInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          pinSubmitTypeGuess();
        }
      });
    }

    var mapEl = document.getElementById("game-pin-map");
    var tip = document.getElementById("game-pin-tip");
    mapEl.addEventListener("mousemove", function (e) {
      if (tip.hidden) return;
      var rect = mapEl.getBoundingClientRect();
      tip.style.left = e.clientX - rect.left + "px";
      tip.style.top = e.clientY - rect.top + "px";
    });

    return root;
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  function pinUpdateBar() {
    var answered = pinState.correct + pinState.wrong;
    var pct = answered === 0 ? 0 : Math.round((pinState.correct / answered) * 100);
    var scoreEl = document.getElementById("game-pin-score");
    var pctEl = document.getElementById("game-pin-pct");
    if (scoreEl) scoreEl.textContent = pinState.correct + " / " + PIN_TOTAL;
    if (pctEl) pctEl.textContent = pct + "%";
    /* ── HUD ranked ── */
    var hudScore = document.getElementById("game-pin-hud-score");
    if (hudScore) {
      hudScore.textContent = pinState.correct;
      hudScore.classList.remove("game-pin__hud-num--bump");
      void hudScore.offsetWidth; /* reflow pour redéclencher l'animation */
      hudScore.classList.add("game-pin__hud-num--bump");
      setTimeout(function () { hudScore.classList.remove("game-pin__hud-num--bump"); }, 200);
    }
  }

  function pinHudSyncTimer(text) {
    var el = document.getElementById("game-pin-hud-time");
    if (el) el.textContent = text;
  }

  function pinShowRound() {
    if (pinState.gameEnded) return;
    if (pinState.index >= pinState.queue.length) {
      pinEndComplete();
      return;
    }
    pinState.current = pinState.queue[pinState.index];
    var c = pinState.current;
    var target = document.getElementById("game-pin-target");
    var flagbar = document.getElementById("game-pin-flagbar");
    var tipName = document.getElementById("game-pin-tip-name");
    var tipFlag = document.getElementById("game-pin-tip-flag");
    var tip = document.getElementById("game-pin-tip");
    var sub = document.getElementById("game-pin-subtitle");
    var promptLabel = document.querySelector(".game-pin__prompt-label");
    var typePanel = document.getElementById("game-pin-type-panel");
    var typeFlag = document.getElementById("game-pin-type-flag");
    var typeInput = document.getElementById("game-pin-type-input");
    var flagsBoard = document.getElementById("game-pin-flags-board");
    var label = c.kind === "k" ? c.city : c.name;
    if (promptLabel) {
      promptLabel.textContent = pinState.typingMode ? "Écrivez" : "Cliquez sur";
    }
    if (target) target.textContent = pinState.typingMode ? "le pays" : label;
    if (flagbar) flagbar.textContent = pinState.typingMode ? "" : c.flag;
    if (tipName) tipName.textContent = label;
    if (tipFlag) tipFlag.textContent = " " + c.flag;
    if (tip) tip.hidden = !!pinState.silhouetteMode || !!pinState.flagsMode || !!pinState.typingMode;
    if (flagsBoard) flagsBoard.hidden = !pinState.flagsMode || !!pinState.typingMode;
    if (typePanel) typePanel.hidden = !pinState.flagsMode || !pinState.typingMode;
    if (typeFlag && pinState.flagsMode && pinState.typingMode) typeFlag.textContent = c.flag;
    if (typeInput && pinState.flagsMode && pinState.typingMode) {
      typeInput.value = "";
      typeInput.focus();
    }
    if (sub) sub.textContent = lastQuizTitle || "Europe : les pays";
    pushClipEvent("cible", { target: label });
    pinUpdateBar();
  }

  function pinOnPick(hit) {
    if (pinState.gameEnded || !pinState.current) return;
    var cur = pinState.current;
    var ok = false;
    var el = hit && hit.el;
    if (cur.kind === "k") {
      ok = hit.capId === cur.id;
    } else if (cur.kind === "f") {
      ok = hit.flagId === cur.id;
    } else {
      ok = hit.iso === cur.iso;
    }
    if (ok) {
      pinState.correct++;
      pinState.index++;
      if (el) {
        el.classList.add("is-correct");
        setTimeout(function () {
          if (el) el.classList.remove("is-correct");
        }, 500);
      }
      pinShowRound();
    } else {
      pinState.wrong++;
      if (el) {
        el.classList.add("is-wrong");
        setTimeout(function () {
          if (el) el.classList.remove("is-wrong");
        }, 450);
      }
      pinUpdateBar();
    }
    if (cur.kind === "f") {
      pushClipEvent("clic drapeau", {
        target: cur.name,
        guess: hit && hit.flagId ? hit.flagId.toUpperCase() : "",
        ok: ok,
      });
    } else {
      pushClipEvent("clic carte", {
        target: cur.name,
        guess: hit && hit.iso ? hit.iso.toUpperCase() : "",
        ok: ok,
      });
    }
  }

  function pinSubmitTypeGuess() {
    if (pinState.gameEnded || !pinState.current || !pinState.typingMode || !pinState.flagsMode) return;
    var input = document.getElementById("game-pin-type-input");
    if (!input) return;
    var val = normalizeGuess(input.value);
    if (!val) return;
    var cur = pinState.current;
    var ok = (cur.answers || []).some(function (a) {
      return normalizeGuess(a) === val;
    });
    pushClipEvent("saisie", { target: cur.name, guess: input.value, ok: ok });
    if (ok) {
      pinState.correct++;
      pinState.index++;
      pinShowRound();
    } else {
      pinState.wrong++;
      input.classList.add("is-wrong");
      setTimeout(function () {
        input.classList.remove("is-wrong");
      }, 350);
      pinUpdateBar();
    }
  }

  function pinSkip() {
    if (pinState.gameEnded || pinState.index >= pinState.queue.length) return;
    if (pinState.current) {
      pushClipEvent("passer", { target: pinState.current.name });
    }
    pinState.index++;
    pinShowRound();
  }

  function stopAllPinTimers() {
    if (pinState.timerId) {
      clearInterval(pinState.timerId);
      pinState.timerId = null;
    }
    if (pinState.countdownId) {
      clearInterval(pinState.countdownId);
      pinState.countdownId = null;
    }
  }

  function pinEndComplete() {
    pinState.gameEnded = true;
    document.getElementById("game-pin-tip").hidden = true;
    stopAllPinTimers();
    var el = document.getElementById("game-pin-timer");
    if (el) {
      el.classList.remove("game-pin__timer--cooldown", "game-pin__timer--warn");
    }
    if (pinState.casual) {
      document.getElementById("game-pin-target").textContent = "Terminé !";
    } else {
      showPinRankOverlay("complete");
    }
  }

  function pinTimeUp() {
    if (pinState.gameEnded) return;
    pinState.gameEnded = true;
    document.getElementById("game-pin-tip").hidden = true;
    stopAllPinTimers();
    var el = document.getElementById("game-pin-timer");
    if (el) {
      el.textContent = "00:00";
      el.classList.remove("game-pin__timer--warn");
    }
    showPinRankOverlay("timeout");
  }

  function showPinRankOverlay(reason) {
    var pct = Math.min(100, Math.round((pinState.correct / PIN_TOTAL) * 100));
    var r = rankFromPercent(pct);
    pinState.lastRankLabel = r.fullLabel;

    /* ── 1. Prépare la barre multi-tiers ── */
    var trackTiers = document.getElementById("rk-track-tiers");
    var trackLabels = document.getElementById("rk-track-labels");
    var needle = document.getElementById("rk-track-needle");
    var needleLabel = document.getElementById("rk-track-needle-label");

    if (trackTiers) {
      trackTiers.innerHTML = "";
      trackLabels && (trackLabels.innerHTML = "");
      RANK_TIERS.forEach(function (t) {
        var span = t.maxPct - t.minPct; /* width % relative to 100 */
        var seg = document.createElement("div");
        seg.className =
          "rk-track__seg" + (t.key === r.tier.key ? " rk-track__seg--active" : "");
        seg.style.cssText =
          "width:" + span + "%;background:" + t.barFill + ";" +
          (t.key === r.tier.key ? "opacity:1;" : "opacity:0.28;");
        trackTiers.appendChild(seg);

        if (trackLabels) {
          var lbl = document.createElement("span");
          lbl.className =
            "rk-track__tier-lbl" + (t.key === r.tier.key ? " rk-track__tier-lbl--active" : "");
          lbl.style.cssText = "width:" + span + "%;color:" + t.color + ";";
          lbl.textContent = t.label;
          trackLabels.appendChild(lbl);
        }
      });
    }

    /* Positionne l'aiguille sur le pct du joueur (0–100 → 0–100%) */
    if (needle) {
      needle.style.left = pct + "%";
      needleLabel && (needleLabel.textContent = pct + "%");
    }

    /* ── 2. Points (compteur animé) ── */
    var pointsEl = document.getElementById("rk-points-num");
    if (pointsEl) {
      pointsEl.textContent = "0";
      var target = pinState.correct;
      var start = 0;
      var steps = 30;
      var step = 0;
      var ptTimer = setInterval(function () {
        step++;
        var v = Math.round(start + (target - start) * (step / steps));
        pointsEl.textContent = v;
        if (step >= steps) clearInterval(ptTimer);
      }, 35);
    }

    /* ── 3. Badge ── */
    var badge = document.getElementById("rk-badge");
    var badgeShield = document.getElementById("rk-badge-shield");
    var badgeLp = document.getElementById("rk-badge-lp");
    var badgeName = document.getElementById("rk-badge-name");
    var badgeTop = document.getElementById("rk-badge-top");

    if (badge) {
      badge.className = "rk-badge rk-badge--" + r.tier.key;
      badge.style.setProperty("--rank-color", r.tier.color);
      badge.style.setProperty("--rank-fill", r.tier.barFill);
    }
    if (badgeShield) {
      badgeShield.querySelectorAll(".rk-badge__wing-l, .rk-badge__wing-r").forEach(function (p) {
        p.style.fill = r.tier.barFill;
      });
    }
    if (badgeLp) badgeLp.textContent = "+" + r.lpGain + " LP";
    if (badgeName) badgeName.textContent = r.fullLabel;
    if (badgeTop) badgeTop.textContent = "TOP  " + r.topPct.toFixed(2).replace(".", ",") + "%";

    /* ── 4. Footer ── */
    var footer = document.getElementById("rk-footer");
    if (footer) {
      /* Calcule l'écart par rapport au meilleur score personnel */
      var history = loadRankedHistory();
      var quizBests = history.filter(function (h) {
        return h.quizTitle === lastQuizTitle;
      });
      var bestPrev = quizBests.length
        ? Math.max.apply(null, quizBests.map(function (h) { return h.correct || 0; }))
        : 0;
      var diff = bestPrev - pinState.correct;
      if (diff > 0) {
        footer.textContent = "🏆 Il vous manquait " + diff + " point(s) pour battre votre record.";
      } else if (diff === 0 && bestPrev > 0) {
        footer.textContent = "🏆 Vous égalez votre meilleur score !";
      } else {
        footer.textContent = reason === "timeout" ? "⏱ Temps écoulé — " + pinState.correct + " / " + PIN_TOTAL + " trouvés." : "🎉 Nouveau record personnel !";
      }
    }

    document.getElementById("game-pin-target").textContent = "—";
    var modal = document.getElementById("game-pin-result");
    modal.hidden = false;
    modal.setAttribute("data-tier", r.tier.key);
    document.getElementById("game-pin-result-close").focus();
    pushClipEvent(reason === "timeout" ? "fin timeout" : "fin complete", { target: r.fullLabel });
    persistRankedResult(reason);
  }

  function startPinTimerElapsed() {
    stopAllPinTimers();
    pinState.seconds = 0;
    var el = document.getElementById("game-pin-timer");
    if (el) {
      el.textContent = "00:00";
      el.classList.remove("game-pin__timer--cooldown", "game-pin__timer--warn");
    }
    pinHudSyncTimer("00:00");
    pinState.timerId = setInterval(function () {
      pinState.seconds++;
      var t = formatTime(pinState.seconds);
      if (el) el.textContent = t;
      pinHudSyncTimer(t);
    }, 1000);
  }

  function startRankedCountdown() {
    stopAllPinTimers();
    pinState.timeLeft = pinState.rankedSeconds;
    var el = document.getElementById("game-pin-timer");
    var t0 = formatTime(pinState.timeLeft);
    if (el) {
      el.textContent = t0;
      el.classList.add("game-pin__timer--cooldown");
    }
    pinHudSyncTimer(t0);
    pinState.countdownId = setInterval(function () {
      pinState.timeLeft--;
      if (pinState.timeLeft <= 0) {
        pinHudSyncTimer("00:00");
        pinTimeUp();
        return;
      }
      var t = formatTime(pinState.timeLeft);
      if (el) {
        el.textContent = t;
        el.classList.toggle("game-pin__timer--warn", pinState.timeLeft <= 10);
      }
      pinHudSyncTimer(t);
      var hud = document.getElementById("game-pin-ranked-hud");
      if (hud) hud.classList.toggle("game-pin__ranked-hud--warn", pinState.timeLeft <= 10);
    }, 1000);
  }

  function openGamePin(opts) {
    opts = opts || {};
    var root = ensureGamePin();
    var res = document.getElementById("game-pin-result");
    if (res) res.hidden = true;
    pinState.rankedSeconds = opts.rankedSeconds > 0 ? opts.rankedSeconds : null;
    pinState.casual = opts.forceRanked ? false : !pinState.rankedSeconds;
    pinState.typingMode = !!opts.typingMode;
    pinState.queue = buildPinQueue();
    if (pinState.queue.length === 0) {
      window.alert("Carte Europe indisponible. Vérifiez que js/europe-map-data.js est chargé.");
      return;
    }
    var M = getEuropeMapData();
    if (M && M.land) {
      root.style.setProperty("--map-fill", M.land);
    }
    pinState.index = 0;
    pinState.correct = 0;
    pinState.wrong = 0;
    pinState.current = null;
    pinState.gameEnded = false;
    pinState.clip = [];
    pinState.startedAtMs = Date.now();
    pinState.savedHistory = false;
    pinState.lastRankLabel = "";
    applyPinMapMode(root);
    root.classList.toggle("game-pin--ranked", !pinState.casual);
    root.hidden = false;
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("game-pin-active");
    requestAnimationFrame(layoutSilhouetteGrid);
    var board = document.getElementById("game-pin-flags-board");
    if (board) {
      board.querySelectorAll("button[data-flag-id]").forEach(function (btn) {
        btn.classList.remove("is-correct", "is-wrong");
      });
    }
    pinShowRound();
    if (pinState.casual) {
      startPinTimerElapsed();
    } else {
      startRankedCountdown();
    }
    document.getElementById("game-pin-close").focus();
  }

  function closeGamePin() {
    var root = document.getElementById("game-pin-root");
    if (!root || root.hidden) return;
    if (!pinState.casual && !pinState.savedHistory && (pinState.correct + pinState.wrong > 0)) {
      pushClipEvent("fermeture", { target: "abandon" });
      persistRankedResult("quit");
    }
    stopAllPinTimers();
    var res = document.getElementById("game-pin-result");
    if (res) res.hidden = true;
    root.hidden = true;
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("game-pin-active");
    root.classList.remove("game-pin--ranked");
    var tip = document.getElementById("game-pin-tip");
    if (tip) tip.hidden = true;
    var el = document.getElementById("game-pin-timer");
    if (el) el.classList.remove("game-pin__timer--cooldown", "game-pin__timer--warn");
  }

  function closeGamePinIfOpen() {
    var root = document.getElementById("game-pin-root");
    if (root && !root.hidden) {
      closeGamePin();
      return true;
    }
    return false;
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE MODE CLASSÉ — ranked.html
     ═══════════════════════════════════════════════════════════════════════ */

  var RANKED_GAMES = [
    /* ── EUROPE · DÉBUTANT (libre, sans chrono) ── */
    { id:"eu-pays-lib",    region:"europe", diff:"basic",  cat:"CARTE",       catColor:"#22d3ee", icon:"🗺️",
      title:"Pays d'Europe",              timer:0,   typing:false,
      desc:"Identifiez l'emplacement de chaque pays d'Europe sur la carte. Mode libre : prenez le temps qu'il vous faut.", quizTitle:"Pays d'Europe" },
    { id:"eu-cap-lib",     region:"europe", diff:"basic",  cat:"CAPITALES",   catColor:"#a78bfa", icon:"⭐",
      title:"Capitales d'Europe",         timer:0,   typing:false,
      desc:"Épinglez chaque capitale européenne sur la carte. Taille des points réduite pour plus de challenge.", quizTitle:"Capitales d'Europe" },
    { id:"eu-drap-ep-lib", region:"europe", diff:"basic",  cat:"DRAPEAUX",    catColor:"#f59e0b", icon:"🏳️",
      title:"Drapeaux — Épingler",        timer:0,   typing:false,
      desc:"Un pays s'affiche — cliquez sur le bon drapeau parmi la grille. Mode libre.", quizTitle:"Drapeaux d'Europe" },
    { id:"eu-drap-ec-lib", region:"europe", diff:"basic",  cat:"DRAPEAUX",    catColor:"#f59e0b", icon:"✍️",
      title:"Drapeaux — Écrire",          timer:0,   typing:true,
      desc:"Un drapeau s'affiche — écrivez le nom du pays correspondant. Accents ignorés.", quizTitle:"Drapeaux d'Europe (écrire)" },
    { id:"eu-sil-lib",     region:"europe", diff:"basic",  cat:"SILHOUETTES", catColor:"#84cc16", icon:"👤",
      title:"Silhouettes d'Europe",       timer:0,   typing:false,
      desc:"Les pays sont affichés sous forme de silhouettes mélangées. Cliquez sur la bonne forme.", quizTitle:"Silhouettes d'Europe" },

    /* ── EUROPE · INTERMÉDIAIRE (1 min 30) ── */
    { id:"eu-pays-90",     region:"europe", diff:"inter",  cat:"CARTE",       catColor:"#22d3ee", icon:"🗺️",
      title:"Pays d'Europe — 1:30",       timer:90,  typing:false,
      desc:"Trouvez le maximum de pays européens sur la carte en 1 minute 30.", quizTitle:"Pays d'Europe" },
    { id:"eu-cap-90",      region:"europe", diff:"inter",  cat:"CAPITALES",   catColor:"#a78bfa", icon:"⭐",
      title:"Capitales d'Europe — 1:30",  timer:90,  typing:false,
      desc:"Épinglez le maximum de capitales en 1 minute 30.", quizTitle:"Capitales d'Europe" },
    { id:"eu-drap-ep-90",  region:"europe", diff:"inter",  cat:"DRAPEAUX",    catColor:"#f59e0b", icon:"🏳️",
      title:"Drapeaux Épingler — 1:30",   timer:90,  typing:false,
      desc:"Identifiez le maximum de drapeaux en cliquant sur la grille en 1 minute 30.", quizTitle:"Drapeaux d'Europe" },
    { id:"eu-drap-ec-90",  region:"europe", diff:"inter",  cat:"DRAPEAUX",    catColor:"#f59e0b", icon:"✍️",
      title:"Drapeaux Écrire — 1:30",     timer:90,  typing:true,
      desc:"Écrivez le pays correspondant à chaque drapeau affiché en 1 minute 30.", quizTitle:"Drapeaux d'Europe (écrire)" },
    { id:"eu-sil-90",      region:"europe", diff:"inter",  cat:"SILHOUETTES", catColor:"#84cc16", icon:"👤",
      title:"Silhouettes d'Europe — 1:30",timer:90,  typing:false,
      desc:"Reconnaissez les silhouettes de pays européens en 1 minute 30.", quizTitle:"Silhouettes d'Europe" },

    /* ── EUROPE · AVANCÉ (45 secondes) ── */
    { id:"eu-pays-45",     region:"europe", diff:"avance", cat:"CARTE",       catColor:"#22d3ee", icon:"🗺️",
      title:"Pays d'Europe — Sprint 45s", timer:45,  typing:false,
      desc:"Mode sprint : trouvez le maximum de pays en seulement 45 secondes.", quizTitle:"Pays d'Europe" },
    { id:"eu-cap-45",      region:"europe", diff:"avance", cat:"CAPITALES",   catColor:"#a78bfa", icon:"⭐",
      title:"Capitales — Sprint 45s",     timer:45,  typing:false,
      desc:"Sprint capitales : 45 secondes pour épingler le maximum de capitales.", quizTitle:"Capitales d'Europe" },
    { id:"eu-drap-ep-45",  region:"europe", diff:"avance", cat:"DRAPEAUX",    catColor:"#f59e0b", icon:"🏳️",
      title:"Drapeaux Épingler — 45s",    timer:45,  typing:false,
      desc:"Sprint drapeaux en mode épingler : 45 secondes, aucune pitié.", quizTitle:"Drapeaux d'Europe" },
    { id:"eu-drap-ec-45",  region:"europe", diff:"avance", cat:"DRAPEAUX",    catColor:"#f59e0b", icon:"✍️",
      title:"Drapeaux Écrire — 45s",      timer:45,  typing:true,
      desc:"Sprint écriture drapeaux : 45 secondes pour écrire le maximum de pays.", quizTitle:"Drapeaux d'Europe (écrire)" },
    { id:"eu-sil-45",      region:"europe", diff:"avance", cat:"SILHOUETTES", catColor:"#84cc16", icon:"👤",
      title:"Silhouettes — Sprint 45s",   timer:45,  typing:false,
      desc:"Le sprint des silhouettes — 45 secondes pour reconnaître les formes de pays.", quizTitle:"Silhouettes d'Europe" },
  ];

  var RANKED_FAKE_USERS = [
    "PierreGeo","Marianne_C","AlexCarto","SophieMap","LucasFlag",
    "ChloeW","JulienGeo","EmilieC","MaxRank","LaetPays",
    "NicoTop","CamilleS","AntoineG","JessM","KevinW",
    "NathGeo","OlivierC","MelFlag","RomainP","CelineWorld",
    "ThomasGeo","AmelieC","BaptistM","IsabelleF","GuillaumeG",
  ];

  function _seededRand(seed) {
    var x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  }

  function _strHash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (Math.imul ? Math.imul(31, h) : 31 * h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  function buildFakeLeaderboard(gameId, period) {
    var counts = { day: 8, week: 15, month: 20, all: 24 };
    var n = counts[period] || 10;
    var seed = _strHash(gameId + period);
    var entries = [];
    for (var i = 0; i < n; i++) {
      var s1 = _seededRand(seed + i * 7);
      var s2 = _seededRand(seed + i * 13);
      var uIdx = Math.floor(_seededRand(seed + i * 19) * RANKED_FAKE_USERS.length);
      /* Scores décroissants, top ~ 38-46, bas ~ 5-15 */
      var maxS = Math.round(PIN_TOTAL * (0.82 + s1 * 0.18));
      var score = Math.max(1, Math.round(maxS * (1 - (i / n) * 0.75) * (0.85 + s2 * 0.15)));
      entries.push({ rank: i + 1, username: RANKED_FAKE_USERS[uIdx] || "Joueur" + (i+1), score: score });
    }
    return entries;
  }

  function getRankedPersonalBest(game) {
    var hist = loadRankedHistory();
    var matches = hist.filter(function (h) { return h.quizTitle === game.quizTitle; });
    if (!matches.length) return null;
    return Math.max.apply(null, matches.map(function (h) { return h.correct || 0; }));
  }

  function getRankedPersonalRank(game) {
    var best = getRankedPersonalBest(game);
    if (best === null) return null;
    return rankFromPercent(Math.round((best / PIN_TOTAL) * 100));
  }

  /* ── State pour la page ranked ── */
  var rankedState = {
    diff: "basic",
    region: "all",
    activeGame: null,
    activePeriod: "all",
  };

  function launchRankedGame(game) {
    lastQuizTitle = game.quizTitle;
    lastQuizAnchor = null;
    closeRankedPanel();
    openGamePin({
      casual: false,
      forceRanked: true,
      rankedSeconds: game.timer > 0 ? game.timer : null,
      typingMode: !!game.typing,
    });
  }

  function closeRankedPanel() {
    var panel = document.getElementById("rk-panel");
    if (panel) panel.classList.remove("is-open");
    var grid = document.getElementById("rk-grid");
    if (grid) grid.classList.remove("rk-grid--panel-open");
    rankedState.activeGame = null;
  }

  function openRankedPanel(game) {
    rankedState.activeGame = game;
    var panel = document.getElementById("rk-panel");
    if (!panel) return;

    /* Thumbnail dans le panel */
    var panelThumb = panel.querySelector(".rk-panel__thumb");
    if (panelThumb) panelThumb.className = "rk-panel__thumb rk-thumb rk-thumb--" + game.cat.toLowerCase();

    /* Catégorie + titre */
    var catEl = panel.querySelector(".rk-panel__cat");
    var titleEl = panel.querySelector(".rk-panel__title");
    if (catEl) { catEl.textContent = game.cat; catEl.style.color = game.catColor; }
    if (titleEl) titleEl.textContent = game.title;

    /* Description */
    var descEl = panel.querySelector(".rk-panel__desc");
    if (descEl) descEl.textContent = game.desc;

    /* Timer badge */
    var timerBadge = panel.querySelector(".rk-panel__timer-badge");
    if (timerBadge) {
      timerBadge.textContent = game.timer === 0 ? "Libre" : game.timer === 90 ? "1:30" : game.timer + "s";
      timerBadge.className = "rk-panel__timer-badge rk-panel__timer-badge--" + game.diff;
    }

    /* Play button */
    var playBtn = panel.querySelector(".rk-panel__play");
    if (playBtn) {
      playBtn.onclick = function () { launchRankedGame(game); };
    }

    /* My highscore */
    renderPanelHighscore(game);

    /* Leaderboard tabs — reset to active period */
    panel.querySelectorAll(".rk-panel__lb-tab").forEach(function (t) {
      var active = t.getAttribute("data-period") === rankedState.activePeriod;
      t.classList.toggle("is-active", active);
    });
    renderLeaderboard(game, rankedState.activePeriod);

    panel.classList.add("is-open");
    var grid = document.getElementById("rk-grid");
    if (grid) grid.classList.add("rk-grid--panel-open");
  }

  function renderPanelHighscore(game) {
    var best = getRankedPersonalBest(game);
    var r = best !== null ? rankFromPercent(Math.round((best / PIN_TOTAL) * 100)) : null;
    var container = document.getElementById("rk-panel-hs");
    if (!container) return;
    if (best === null) {
      container.innerHTML = '<span class="rk-panel__hs-empty">Pas encore joué</span>';
      return;
    }
    container.innerHTML =
      '<div class="rk-panel__hs-badge rk-badge--' + r.tier.key + '" style="--rank-color:' + r.tier.color + ';--rank-fill:' + r.tier.barFill + '">' +
        '<div class="rk-panel__hs-body"><span class="rk-panel__hs-star">★</span></div>' +
      '</div>' +
      '<div class="rk-panel__hs-info">' +
        '<span class="rk-panel__hs-score">' + best + ' / ' + PIN_TOTAL + '</span>' +
        '<span class="rk-panel__hs-rank">' + r.fullLabel + '</span>' +
      '</div>' +
      '<span class="rk-panel__hs-label">MY HIGHSCORE</span>';
  }

  function renderLeaderboard(game, period) {
    var tbody = document.getElementById("rk-panel-lb-body");
    if (!tbody) return;
    var entries = buildFakeLeaderboard(game.id, period);

    /* Injecte le vrai score du joueur si disponible */
    var best = getRankedPersonalBest(game);
    var playerInserted = false;
    if (best !== null) {
      var insertAt = entries.findIndex(function (e) { return e.score <= best; });
      if (insertAt === -1) insertAt = entries.length;
      entries.splice(insertAt, 0, { rank: 0, username: "Vous", score: best, isMe: true });
      entries.forEach(function (e, i) { if (!e.isMe) e.rank = i + 1; });
      playerInserted = true;
    }

    tbody.innerHTML = "";
    entries.slice(0, 20).forEach(function (e, i) {
      var tr = document.createElement("tr");
      if (e.isMe) tr.className = "rk-lb__me";
      var rankStr = i + 1;
      var medal = rankStr === 1 ? "🥇" : rankStr === 2 ? "🥈" : rankStr === 3 ? "🥉" : "#" + rankStr;
      tr.innerHTML =
        '<td class="rk-lb__rank">' + medal + '</td>' +
        '<td class="rk-lb__user">' + (e.isMe ? '<strong>Vous</strong>' : e.username) + '</td>' +
        '<td class="rk-lb__score">' + e.score + '<span class="rk-lb__total"> / ' + PIN_TOTAL + '</span></td>';
      tbody.appendChild(tr);
    });
  }

  function renderRankedCardBadge(game) {
    var r = getRankedPersonalRank(game);
    if (!r) return '<span class="rk-card__badge rk-card__badge--none" title="Pas encore joué">?</span>';
    return (
      '<span class="rk-card__badge rk-card__badge--' + r.tier.key + '" style="--rank-color:' + r.tier.color + ';--rank-fill:' + r.tier.barFill + '" title="' + r.fullLabel + '">★</span>'
    );
  }

  function renderRankedGrid() {
    var grid = document.getElementById("rk-grid");
    if (!grid) return;
    var filtered = RANKED_GAMES.filter(function (g) {
      return (rankedState.diff === "all" || g.diff === rankedState.diff) &&
             (rankedState.region === "all" || g.region === rankedState.region);
    });
    grid.innerHTML = "";
    if (filtered.length === 0) {
      grid.innerHTML = '<p class="rk-empty">Aucun jeu disponible pour cette sélection.</p>';
      return;
    }
    filtered.forEach(function (game) {
      var card = document.createElement("div");
      card.className = "rk-card" + (rankedState.activeGame && rankedState.activeGame.id === game.id ? " is-active" : "");
      card.setAttribute("data-game-id", game.id);
      card.innerHTML =
        '<div class="rk-card__thumb rk-thumb rk-thumb--' + game.cat.toLowerCase() + '">' +
          '<span class="rk-card__thumb-icon" aria-hidden="true">' + game.icon + '</span>' +
          '<div class="rk-card__hover-overlay">' +
            '<button type="button" class="rk-card__info-btn">Info &amp; Stats</button>' +
          '</div>' +
        '</div>' +
        '<div class="rk-card__footer">' +
          '<span class="rk-card__cat" style="color:' + game.catColor + '">' + game.cat + '</span>' +
          '<div class="rk-card__bottom">' +
            '<span class="rk-card__title">' + game.title + '</span>' +
            '<div class="rk-card__right">' +
              renderRankedCardBadge(game) +
              '<button type="button" class="rk-card__arr" aria-label="Voir détails">▾</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      card.addEventListener("click", function (e) {
        if (e.target.closest(".rk-card__arr") || e.target.closest(".rk-card__info-btn")) {
          e.preventDefault();
          openRankedPanel(game);
          return;
        }
        openRankedPanel(game);
      });
      grid.appendChild(card);
    });
  }

  function renderRankedPageUserBar() {
    var bar = document.getElementById("rk-user-bar");
    if (!bar) return;
    var loggedIn = localStorage.getItem(AUTH_KEY) === "1";
    var hist = loadRankedHistory();
    /* Calcule le rang global en agrégeant tous les pct */
    var bestPct = 0;
    if (hist.length) {
      bestPct = Math.round(hist.reduce(function (acc, h) { return Math.max(acc, h.pct || 0); }, 0));
    }
    var r = rankFromPercent(bestPct);
    bar.innerHTML =
      '<div class="rk-userbar__left">' +
        '<h1 class="rk-userbar__title">MODE CLASSÉ</h1>' +
        '<p class="rk-userbar__sub">Montez en rang · Battez vos records · Défiez la planète</p>' +
      '</div>' +
      '<div class="rk-userbar__right">' +
        (loggedIn
          ? '<div class="rk-userbar__player">' +
              '<div class="rk-userbar__mini-badge rk-badge--' + r.tier.key + '" style="--rank-color:' + r.tier.color + ';--rank-fill:' + r.tier.barFill + '"><span>★</span></div>' +
              '<div class="rk-userbar__player-info">' +
                '<span class="rk-userbar__username">' + (localStorage.getItem("georank_username") || "Joueur") + '</span>' +
                '<span class="rk-userbar__rank-lbl">' + r.fullLabel + '</span>' +
              '</div>' +
            '</div>'
          : '<span class="rk-userbar__unranked">UNRANKED</span>') +
      '</div>';
  }

  function initRankedPage() {
    if (!document.getElementById("rk-grid")) return;

    renderRankedPageUserBar();
    renderRankedGrid();

    /* Diff tabs */
    document.querySelectorAll(".rk-diff-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        rankedState.diff = btn.getAttribute("data-diff");
        document.querySelectorAll(".rk-diff-tab").forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-diff") === rankedState.diff);
        });
        closeRankedPanel();
        renderRankedGrid();
      });
    });

    /* Region tabs */
    document.querySelectorAll(".rk-region-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        rankedState.region = btn.getAttribute("data-region");
        document.querySelectorAll(".rk-region-tab").forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-region") === rankedState.region);
        });
        closeRankedPanel();
        renderRankedGrid();
      });
    });

    /* Panel close button */
    var panelClose = document.getElementById("rk-panel-close");
    if (panelClose) panelClose.addEventListener("click", closeRankedPanel);

    /* Leaderboard period tabs */
    document.querySelectorAll(".rk-panel__lb-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        rankedState.activePeriod = btn.getAttribute("data-period");
        document.querySelectorAll(".rk-panel__lb-tab").forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-period") === rankedState.activePeriod);
        });
        if (rankedState.activeGame) renderLeaderboard(rankedState.activeGame, rankedState.activePeriod);
      });
    });
  }

  initRankedPage();

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (closeGamePinIfOpen()) return;
    closeRankedPanel();
    closeProfileMenu();
    closeGameLaunch();
  });
})();
