#!/usr/bin/env python3
"""Génère les pages régions avec le catalogue scrollable (sections + grille 2 colonnes)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REG = ROOT / "regions"


def li(text: str, flag: str, href: str = "#", ranked: bool = False) -> str:
    ranked_attr = ' data-ranked="true"' if ranked else ""
    return (
        "          <li>\n"
        f"            <a class=\"quiz-link-row\" href=\"{href}\"{ranked_attr}>\n"
        f"              <span class=\"quiz-link-row__flag\" aria-hidden=\"true\">{flag}</span>\n"
        f"              <span class=\"quiz-link-row__label\">{text}</span>\n"
        "            </a>\n"
        "          </li>"
    )


def _item_parts(item: str | tuple[str, str]) -> tuple[str, str]:
    if isinstance(item, str):
        return item, "#"
    return item[0], item[1]


def section(sid: str, title: str, items: list[str | tuple[str, str]], flag: str) -> str:
    lines: list[str] = []
    for t in items:
        text, href = _item_parts(t)
        lines.append(li(text, flag, href))
    rows = "\n".join(lines)
    return f"""      <section class="quiz-section" aria-labelledby="{sid}">
        <h2 id="{sid}" class="quiz-section__title">{title}</h2>
        <div class="quiz-section__panel">
          <ul class="quiz-link-grid">
{rows}
          </ul>
        </div>
      </section>"""


def europe_jeux_carte_section() -> str:
    """Catalogue Europe uniquement, calqué sur les sections Seterra visibles sur les captures."""

    def section_from_columns(
        sid: str,
        title: str,
        left: list[tuple[str, str]],
        right: list[tuple[str, str]],
        ranked_first: bool = False,
    ) -> str:
        ordered: list[tuple[str, str, bool]] = []
        n = max(len(left), len(right))
        for i in range(n):
            if i < len(left):
                ordered.append((left[i][0], left[i][1], ranked_first and i == 0))
            if i < len(right):
                ordered.append((right[i][0], right[i][1], False))
        rows = "\n".join(li(text, flag, ranked=r) for text, flag, r in ordered)
        return f"""      <section class="quiz-section" aria-labelledby="{sid}">
        <h2 id="{sid}" class="quiz-section__title">{title}</h2>
        <div class="quiz-section__panel">
          <ul class="quiz-link-grid">
{rows}
          </ul>
        </div>
      </section>"""

    main_left = [
        ("Europe : les pays", "🇪🇺"),
        ("Europe : les pays (avec des images)", "🇪🇺"),
        ("Europe : silhouettes des pays", "🇪🇺"),
        ("Union européenne : les pays (après Brexit)", "🇪🇺"),
        ("Europe du Sud : Pays", "🇪🇺"),
        ("Europe : les capitales (version facile)", "🇪🇺"),
        ("Europe : les capitales", "🇪🇺"),
        ("Europe : les villes", "🇪🇺"),
        ("Europe : les villes (version difficile)", "🇪🇺"),
        ("Europe : géographie physique", "🇪🇺"),
        ("Europe du Nord : les pays", "🇪🇺"),
        ("Europe du Sud : les pays", "🇪🇺"),
        ("Europe de l’Est : les pays", "🇪🇺"),
        ("Europe de l’Ouest : les pays", "🇪🇺"),
        ("Europe : les mers et lacs", "🇪🇺"),
        ("Europe : les fleuves et rivières", "🇪🇺"),
        ("Europe : les chaînes de montagnes", "🇪🇺"),
        ("Europe : 12 points d’intérêt", "🇪🇺"),
        ("Europe de la guerre froide (1949-1989)", "🛡️"),
        ("Europe : événements de la Seconde Guerre mondiale", "📜"),
        ("Europe 1939 (Mars-Septembre)", "📜"),
    ]
    main_right = [
        ("Europe 1919", "🇪🇺"),
        ("Europe 1914", "🇪🇺"),
        ("Europe médiévale (1444)", "🏰"),
        ("L’Empire romain en l’an 117 : les provinces et États clients", "🏛️"),
        ("Concours Eurovision de la chanson 2025", "🎶"),
        ("Pays nordiques : les pays", "🌲"),
        ("Pays nordiques : les pays et les capitales", "🌲"),
        ("Scandinavie : les villes", "🌲"),
        ("Norden : Testaments du géographe", "🌲"),
        ("Europe : Testaments des géographes", "🇪🇺"),
        ("UEFA EURO 2024", "⚽"),
        ("Norvège : comtés (-2019)", "🇳🇴"),
        ("Allemagne : de grands paysages", "🇩🇪"),
        ("Allemagne : les montagnes", "🇩🇪"),
        ("La mer Méditerranée : les pays et les îles", "🌊"),
        ("Allemagne : districts de Munich", "🇩🇪"),
        ("Allemagne : Région de la Ruhr", "🇩🇪"),
        ("Suède : zones urbaines autour du lac Mälaren", "🇸🇪"),
        ("Allemagne : quartiers d’Aix-la-Chapelle", "🇩🇪"),
        ("Allemagne : Districts de Bavière", "🇩🇪"),
    ]

    indiv_left = [
        ("Albanie : les préfectures", "🇦🇱"),
        ("Allemagne : Bundesländer", "🇩🇪"),
        ("Allemagne : les capitales des lands", "🇩🇪"),
        ("Allemagne : les districts de Berlin", "🇩🇪"),
        ("Allemagne : les pays voisins", "🇩🇪"),
        ("Autriche : les Länder", "🇦🇹"),
        ("Autriche : les capitales des lands", "🇦🇹"),
        ("Belgique : les provinces", "🇧🇪"),
        ("Belgique : les villes", "🇧🇪"),
        ("Biélorussie : les oblasts", "🇧🇾"),
        ("Bosnie-Herzégovine : divisions politiques", "🇧🇦"),
        ("Croatie : les comtés", "🇭🇷"),
        ("Danemark : les comtés", "🇩🇰"),
        ("Danemark : les régions", "🇩🇰"),
        ("Espagne : les communautés autonomes", "🇪🇸"),
        ("Espagne : les provinces", "🇪🇸"),
        ("Espagne : les Îles Baléares", "🇪🇸"),
        ("Espagne : les Canaries", "🇪🇸"),
        ("Estonie : comtés", "🇪🇪"),
        ("Finlande : les régions", "🇫🇮"),
        ("Finlande : les villes", "🇫🇮"),
        ("France : arrondissements de Paris", "🇫🇷"),
        ("France : les régions", "🇫🇷"),
        ("France : les villes", "🇫🇷"),
        ("France : les villes (version difficile)", "🇫🇷"),
        ("Grèce : régions administratives", "🇬🇷"),
        ("Grèce : municipalités d’Athènes", "🇬🇷"),
        ("Hongrie : les comtés", "🇭🇺"),
        ("Hongrie : les villes", "🇭🇺"),
        ("Irlande (République) : les comtés", "🇮🇪"),
        ("Italie : les provinces", "🇮🇹"),
        ("Italie : les régions", "🇮🇹"),
        ("Italie : les villes", "🇮🇹"),
        ("Kosovo : districts", "🇽🇰"),
        ("Lettonie : les villes", "🇱🇻"),
        ("Liechtenstein : municipalités", "🇱🇮"),
    ]
    indiv_right = [
        ("Lituanie : comtés", "🇱🇹"),
        ("Luxembourg : les cantons", "🇱🇺"),
        ("Macédoine du Nord : municipalités", "🇲🇰"),
        ("Malte : les régions", "🇲🇹"),
        ("Moldavie : divisions administratives", "🇲🇩"),
        ("Monaco : les quartiers", "🇲🇨"),
        ("Monténégro : municipalités", "🇲🇪"),
        ("Norvège : les comtés", "🇳🇴"),
        ("Norvège : les villes", "🇳🇴"),
        ("Pays-Bas : les provinces", "🇳🇱"),
        ("Pays-Bas : les villes", "🇳🇱"),
        ("Pologne : les voïvodies", "🇵🇱"),
        ("Pologne : les villes", "🇵🇱"),
        ("Portugal : les districts", "🇵🇹"),
        ("Portugal : les villes", "🇵🇹"),
        ("Roumanie : les comtés", "🇷🇴"),
        ("Roumanie : les villes", "🇷🇴"),
        ("Royaume-Uni : Angleterre : les comtés", "🇬🇧"),
        ("Royaume-Uni : Écosse : les council areas", "🏴"),
        ("Royaume-Uni : Irlande du Nord : zones de conseil", "🇬🇧"),
        ("Russie : les sujets de la Fédération", "🇷🇺"),
        ("Russie : les villes", "🇷🇺"),
        ("Russie : ville de Moscou", "🇷🇺"),
        ("République tchèque : les régions", "🇨🇿"),
        ("République tchèque : districts", "🇨🇿"),
        ("Saint-Marin : municipalités", "🇸🇲"),
        ("Serbie : districts", "🇷🇸"),
        ("Slovaquie : les régions", "🇸🇰"),
        ("Slovénie : municipalités", "🇸🇮"),
        ("Suisse : les cantons", "🇨🇭"),
        ("Suisse : les lacs", "🇨🇭"),
        ("Suisse : les montagnes", "🇨🇭"),
        ("Suède : les provinces", "🇸🇪"),
        ("Suède : les villes", "🇸🇪"),
        ("Ukraine : les régions", "🇺🇦"),
        ("Ukraine : les villes", "🇺🇦"),
    ]

    pays_left = [
        ("Mecklembourg-Poméranie occidentale : districts", "🇩🇪"),
        ("Sarre : comtés", "🇩🇪"),
        ("Saxe : districts administratifs et districts urbains", "🇩🇪"),
        ("Saxe-Anhalt : districts ruraux et districts urbains", "🇩🇪"),
        ("Schleswig-Holstein : districts administratifs", "🇩🇪"),
        ("Thuringe : districts ruraux et districts urbains", "🇩🇪"),
        ("Hesse : districts administratifs et districts urbains", "🇩🇪"),
    ]
    pays_right = [
        ("Rhénanie-Palatinat : districts administratifs", "🇩🇪"),
        ("Rhénanie du Nord-Westphalie : districts urbains", "🇩🇪"),
        ("Basse-Saxe : districts administratifs", "🇩🇪"),
        ("Brandebourg : districts ruraux et districts urbains", "🇩🇪"),
        ("Bade-Wurtemberg : districts ruraux et urbains", "🇩🇪"),
        ("Bavière : districts administratifs et districts urbains", "🇩🇪"),
        ("Allemagne : districts administratifs et districts urbains", "🇩🇪"),
    ]

    muni_left = [
        ("Suède : municipalités du Götaland", "🇸🇪"),
        ("Suède : municipalités du Svealand", "🇸🇪"),
        ("Suède : municipalités du Norrland", "🇸🇪"),
        ("Suède : communes de Stockholm", "🇸🇪"),
        ("Suède : communes du Grand Göteborg", "🇸🇪"),
        ("Suède : communes de Stormalmö", "🇸🇪"),
        ("Suède : municipalités du comté d’Uppsala", "🇸🇪"),
        ("Suède : municipalités du comté de Kronoberg", "🇸🇪"),
        ("Suède : municipalités du comté de Kalmar", "🇸🇪"),
        ("Suède : municipalités du comté de Gotland", "🇸🇪"),
    ]
    muni_right = [
        ("Suède : communes du comté de Blekinge", "🇸🇪"),
        ("Suède : municipalités du comté de Skåne", "🇸🇪"),
        ("Suède : communes du comté de Halland", "🇸🇪"),
        ("Suède : municipalités du comté de Värmland", "🇸🇪"),
        ("Suède : municipalités du comté d’Örebro", "🇸🇪"),
        ("Suède : municipalités du comté de Västmanland", "🇸🇪"),
        ("Suède : municipalités du comté de Dalarna", "🇸🇪"),
        ("Suède : municipalités du comté de Gävleborg", "🇸🇪"),
        ("Suède : municipalités du comté de Västerbotten", "🇸🇪"),
        ("Suède : municipalités du comté de Norrbotten", "🇸🇪"),
    ]

    drapeau_left = [
        ("Europe : silhouettes des pays", "🇪🇺"),
        ("Europe : les drapeaux (version facile)", "🇪🇺"),
        ("Europe : les drapeaux", "🇪🇺"),
        ("Europe occidentale : les drapeaux", "🇪🇺"),
        ("Europe de l’Est : les drapeaux", "🇪🇺"),
        ("Allemagne : les drapeaux des lands", "🇩🇪"),
        ("Suisse : les drapeaux des cantons", "🇨🇭"),
        ("France : les drapeaux des régions", "🇫🇷"),
        ("Espagne : drapeaux des communautés autonomes", "🇪🇸"),
        ("Italie : les drapeaux régionaux", "🇮🇹"),
        ("Pays-Bas : les drapeaux des provinces", "🇳🇱"),
        ("Royaume-Uni : drapeaux des comtés d’Angleterre", "🇬🇧"),
        ("Autriche : les drapeaux des lands", "🇦🇹"),
        ("Russie : les drapeaux", "🇷🇺"),
    ]
    drapeau_right = [
        ("Suisse : les blasons des cantons", "🇨🇭"),
        ("Norvège : comtés, armoiries", "🇳🇴"),
        ("Belgique : les drapeaux des provinces", "🇧🇪"),
        ("Ukraine : les drapeaux", "🇺🇦"),
        ("Biélorussie : les drapeaux régionaux", "🇧🇾"),
        ("Hongrie : drapeaux des comtés", "🇭🇺"),
        ("Pologne : drapeaux des voïvodies", "🇵🇱"),
        ("Suède : provinces, armoiries", "🇸🇪"),
        ("Suède : comtés, armoiries", "🇸🇪"),
        ("Allemagne : armoiries des lands", "🇩🇪"),
        ("Slovaquie : drapeaux", "🇸🇰"),
        ("Lituanie : armoiries", "🇱🇹"),
        ("République tchèque : drapeaux régionaux", "🇨🇿"),
    ]

    sections = [
        section_from_columns("eu-m1", "Jeux de carte", main_left, main_right, ranked_first=True),
        section_from_columns(
            "eu-m2", "Jeux de carte (pays individuels)", indiv_left, indiv_right
        ),
        section_from_columns("eu-m3", "Jeux de carte (pays)", pays_left, pays_right),
        section_from_columns("eu-m4", "Jeux de carte (municipalités)", muni_left, muni_right),
        section_from_columns("eu-m5", "Jeux de drapeau", drapeau_left, drapeau_right),
    ]
    return "\n\n".join(sections)


def nav_html(active: str) -> str:
    items = [
        ("../index.html", "Toutes", None),
        ("europe.html", "Europe", "europe"),
        ("amerique-nord.html", "Amérique du Nord", "amerique-nord"),
        ("amerique-sud.html", "Amérique du Sud", "amerique-sud"),
        ("afrique.html", "Afrique", "afrique"),
        ("asie.html", "Asie", "asie"),
        ("oceanie.html", "Océanie", "oceanie"),
        ("monde.html", "Monde", "monde"),
    ]
    lines = []
    for href, label, key in items:
        cls = ' class="is-active"' if key == active else ""
        lines.append(f'          <a href="{href}"{cls}>{label}</a>')
    return "\n".join(lines)


def hero_svg(kind: str) -> str:
    if kind == "monde":
        return """            <svg viewBox="0 0 200 200" width="150" height="150" aria-hidden="true">
                <circle cx="100" cy="100" r="78" fill="#87ceeb" opacity="0.35" />
                <path
                  fill="#2d8a45"
                  d="M100 28c40 0 72 32 72 72s-32 72-72 72-72-32-72-72 32-72 72-72zm-20 24c-16 8-24 28-18 46 6 18 24 28 42 24 18-4 30-22 28-40-2-20-20-36-40-36-4 0-8 2-12 4zm48 52c8 4 12 14 8 24-4 10-16 14-26 10-10-4-14-16-10-26 4-10 16-14 28-8z"
                />
              </svg>"""
    if kind == "oceanie":
        return """            <svg viewBox="0 0 240 160" width="200" height="133" aria-hidden="true">
                <path fill="#2d8a45" d="M48 72c10-6 24-4 32 6 8 10 6 26-6 34-12 8-30 4-38-8-8-12-2-28 12-32z" />
                <path fill="#2d8a45" d="M118 38c14-4 30 2 38 16 8 14 4 34-10 44-14 10-34 6-44-10-10-16-4-38 16-50z" />
                <path fill="#2d8a45" d="M168 96c8 2 14 12 12 22-2 10-12 16-22 12-10-4-14-16-8-26 4-8 12-12 18-8z" />
                <path fill="#2d8a45" d="M88 108c6 4 8 14 2 22-6 8-18 8-26 2-8-6-8-18 2-24 6-4 16-4 22 0z" />
              </svg>"""
    paths = {
        "europe": (
            "220 150",
            "200 136",
            "M108 18c16 0 32 8 42 22 6-4 14-5 22-2 12 4 20 16 20 30 0 8-3 16-9 22 6 10 5 24-4 34-9 10-24 13-36 8-4 14-16 26-31 30-15 4-32 0-44-10-12 8-28 10-42 4-18-8-28-28-24-48 4-18 20-32 38-34 2-18 16-34 34-38 10-2 20-1 30 2zm-58 52c-6 8-5 20 4 26 9 6 22 3 28-6 6-9 3-22-8-26-11-4-24 0-24 6z",
        ),
        "an": (
            "240 200",
            "180 150",
            "M45 20c28-8 58-6 82 8 18 10 30 28 34 50 4 22-4 46-20 64-16 18-40 28-64 26-28-2-54-18-68-42-14-26-12-58 8-82 12-14 28-22 28-24zm18 48c-6 10-4 24 6 32 10 8 26 6 34-4 8-10 6-26-6-34-12-8-28-6-34 6z",
        ),
        "as": (
            "140 220",
            "110 170",
            "M70 12c18 8 28 28 30 52 2 28-8 56-22 80-14 26-32 48-52 64-8-18-12-40-10-62 2-28 14-54 32-74 8-10 16-18 22-22v-38zm-8 118c6 14 4 32-6 44-10 12-28 16-42 8-14-8-20-26-14-42 6-14 22-22 38-18 8 2 16 4 24 8z",
        ),
        "afrique": (
            "160 220",
            "120 165",
            "M78 18c22 4 38 22 42 46 4 28-6 58-20 86-14 30-34 56-58 74-6-20-8-42-4-64 6-34 22-66 44-92 8-10 16-18 24-24l-28-26zm-12 108c10 8 12 24 4 36-8 12-24 16-38 8-14-8-18-26-10-40 8-14 26-18 44-4z",
        ),
        "asie": (
            "280 180",
            "220 140",
            "M32 48c28-18 62-22 92-12 30 10 52 34 62 62 10 28 8 60-8 86-16 26-44 42-74 44-36 2-72-16-92-48-20-32-18-74 8-104 4-6 8-12 12-16zm48 28c-12 8-16 26-8 40 8 14 26 20 42 12 16-8 22-28 14-44-8-16-28-22-48-8zm88 24c10 6 14 20 8 32-6 12-20 18-34 12-14-6-20-22-12-36 8-14 24-18 38-8z",
        ),
    }
    vb, wh, d = paths[kind]
    return f"""            <svg viewBox="0 0 {vb}" width="{wh.split()[0]}" height="{wh.split()[1]}" aria-hidden="true">
                <path fill="#2d8a45" d="{d}" />
              </svg>"""


def pills_standard() -> str:
    return """            <div class="pill-list">
              <div class="pill"><span class="pill-cat">Pays</span><span class="pill-right">0% <span class="progress-ring" data-pct="0" aria-hidden="true"></span></span></div>
              <div class="pill"><span class="pill-cat">Drapeaux</span><span class="pill-right">0% <span class="progress-ring" data-pct="0" aria-hidden="true"></span></span></div>
              <div class="pill"><span class="pill-cat">Capitales</span><span class="pill-right">0% <span class="progress-ring" data-pct="0" aria-hidden="true"></span></span></div>
            </div>"""


def pills_monde() -> str:
    return """            <div class="pill-list">
              <div class="pill"><span class="pill-cat">Pays</span><span class="pill-right">0% <span class="progress-ring" data-pct="0" aria-hidden="true"></span></span></div>
              <div class="pill"><span class="pill-cat">Drapeaux</span><span class="pill-right">0% <span class="progress-ring" data-pct="0" aria-hidden="true"></span></span></div>
              <div class="pill"><span class="pill-cat">Villes</span><span class="pill-right">0% <span class="progress-ring" data-pct="0" aria-hidden="true"></span></span></div>
            </div>"""


def render_page(
    filename: str,
    title: str,
    nav_active: str,
    h1: str,
    breadcrumb: str,
    badge: str,
    hero_kind: str,
    pills_fn,
    intro: str,
    flag: str,
    blocks: list[tuple[str, str, list[str]]] | str,
    outro: str,
) -> str:
    if isinstance(blocks, str):
        catalog = blocks
    else:
        catalog = "\n\n".join(section(sid, tit, items, flag) for sid, tit, items in blocks)
    return f"""<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Lobster&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../tokens.css" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body class="theme-ranked">
    <div class="ambient-bg" aria-hidden="true"></div>
    <div class="top-bar">
      <header class="site-header">
        <div class="brand">
          <a href="../index.html" class="brand-link"><span class="brand-name">GeoRank</span></a>
          <span class="brand-sub">BY GEOGUESSR</span>
        </div>
        <nav class="nav-main" aria-label="Régions">
{nav_html(nav_active)}
        </nav>
        <div class="header-actions">
          <div class="header-auth header-auth--guest" id="header-guest">
            <button type="button" class="btn-login" id="btn-login">Se connecter</button>
          </div>
          <div class="header-auth header-auth--user" id="header-user" hidden>
            <div class="profile-wrap">
              <button type="button" class="profile-btn" id="profile-btn" aria-expanded="false" aria-haspopup="menu" aria-controls="profile-menu" aria-label="Ouvrir le menu profil">
                <span class="profile-avatar" id="profile-avatar-initials">GR</span>
              </button>
              <ul class="profile-menu" id="profile-menu" role="menu" hidden>
                <li role="none"><a href="../profil.html" role="menuitem">Mon profil</a></li>
                <li role="none"><a href="../scores.html" role="menuitem">Mes scores</a></li>
                <li role="none"><button type="button" class="profile-menu-logout" role="menuitem" id="btn-logout">Déconnexion</button></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>

    <main class="page-content region-page">
      <nav class="breadcrumbs" aria-label="Fil d'Ariane">
        <a href="../index.html">jeux de géographie</a>
        <span class="sep">&gt;&gt;</span>
        <span>{breadcrumb}</span>
      </nav>

      <h1 class="page-title">{h1}</h1>

      <div class="mode-row">
        <span class="mode-label">MODE DE JEU :</span>
        <div class="mode-buttons" role="group" aria-label="Mode de jeu">
          <button type="button" data-active="true">EPINGLER</button>
          <button type="button" data-active="false">SAISIR</button>
        </div>
      </div>

      <div class="region-hero">
        <div class="region-hero__card-wrap">
          <article class="region-card region-card--static">
            <div class="card-map-wrap">
{hero_svg(hero_kind)}
              <span class="region-badge">{badge}</span>
            </div>
{pills_fn()}
          </article>
        </div>
        <div class="region-hero__intro">
          <p class="region-hero__text">
            {intro}
          </p>
        </div>
      </div>

      <div class="quiz-catalog">

{catalog}

      </div>

      <div class="region-page-outro">
        <p>
          {outro}
        </p>
        <a class="quiz-footer-more" href="../index.html">&gt;&gt; Voir plus de jeux de géographie</a>
      </div>
    </main>

    <script src="../js/europe-map-data.js"></script>
    <script src="../app.js"></script>
  </body>
</html>
"""


def main() -> None:
    EU = "🇪🇺"
    NA = "🌎"
    SA = "🌎"
    MO = "🌐"
    AF = "🌍"
    AS = "🌏"
    OC = "🏝️"

    na_blocks = [
        ("na-m1", "Jeux de carte", [
            "Amérique du Nord : pays et capitales",
            "Amérique du Nord : drapeaux",
            "Amérique du Nord : test des capitales",
            "Amérique centrale : pays",
            "Caraïbes : îles et pays",
            "Canada : provinces et territoires",
            "Mexique : États",
            "Groenland : communes (aperçu)",
            "Grands lacs : villes riveraines",
        ]),
        ("na-m2", "Jeux de carte (pays individuels)", [
            ("États-Unis : hub complet", "etats-unis.html"),
            "Canada : provinces (carte)",
            "Mexique : États (carte)",
            "Cuba : provinces",
            "République dominicaine : provinces",
            "Jamaïque : paroisses",
        ]),
        ("na-fl", "Jeux de drapeau", [
            "Amérique du Nord : drapeaux nationaux",
            "Canada : drapeaux provinciaux",
            "États-Unis : drapeaux d’État (aperçu)",
        ]),
        ("na-pr", "Documents à imprimer", [
            "Amérique du Nord : carte politique",
            "Canada : provinces (PDF)",
        ]),
    ]

    sa_blocks = [
        ("sa-m1", "Jeux de carte", [
            "Amérique du Sud : pays et capitales",
            "Amérique du Sud : drapeaux",
            "Amérique du Sud : fleuves",
            "Amérique du Sud : cordillère des Andes",
            "Cône Sud : pays",
            "Brésil : États",
            "Argentine : provinces",
            "Chili : régions",
            "Colombie : départements",
            "Pérou : régions",
            "Amazonie : pays riverains",
        ]),
        ("sa-m2", "Jeux de carte (pays individuels)", [
            "Venezuela : États",
            "Équateur : provinces",
            "Bolivie : départements",
            "Paraguay : départements",
            "Uruguay : départements",
        ]),
        ("sa-fl", "Jeux de drapeau", [
            "Amérique du Sud : drapeaux",
            "Amérique du Sud : drapeaux (silhouettes)",
        ]),
        ("sa-pr", "Documents à imprimer", [
            "Amérique du Sud : carte muette",
        ]),
    ]

    mo_blocks = [
        ("mo-m1", "Jeux de carte", [
            "Monde : tous les pays",
            "Monde : pays (version difficile)",
            "Monde : capitales",
            "Monde : grandes villes",
            "Monde : drapeaux",
            "Monde : pays par continent",
            "Monde : océans et mers",
            "Monde : déserts",
            "Monde : chaînes montagneuses",
            "Monde : fuseaux et méridien de Greenwich",
        ]),
        ("mo-m2", "Jeux de carte (régions)", [
            "Moyen-Orient : pays",
            "Asie du Sud-Est : pays",
            "Pacifique : États insulaires",
            "Europe : aperçu",
            "Afrique : aperçu",
        ]),
        ("mo-fl", "Jeux de drapeau", [
            "Monde : drapeaux emblématiques",
            "Monde : drapeaux similaires",
        ]),
        ("mo-pr", "Documents à imprimer", [
            "Monde : planisphère politique",
            "Monde : planisphère physique",
        ]),
    ]

    af_blocks = [
        ("af-m1", "Jeux de carte", [
            "Afrique : pays et capitales",
            "Afrique : drapeaux",
            "Afrique : pays côtiers vs intérieurs",
            "Afrique : déserts et Sahel",
            "Afrique : grands fleuves",
            "Afrique du Nord : pays",
            "Afrique de l’Ouest : pays",
            "Afrique centrale : pays",
            "Afrique de l’Est : pays",
            "Afrique australe : pays",
            "Maghreb : villes",
            "Corne de l’Afrique : pays",
        ]),
        ("af-m2", "Jeux de carte (pays individuels)", [
            "Nigeria : États",
            "Égypte : gouvernorats",
            "Afrique du Sud : provinces",
            "Maroc : régions",
            "Kenya : comtés (aperçu)",
            "Algérie : wilayas (aperçu)",
        ]),
        ("af-fl", "Jeux de drapeau", [
            "Afrique : drapeaux",
            "Afrique : drapeaux (version difficile)",
        ]),
        ("af-pr", "Documents à imprimer", [
            "Afrique : carte politique",
            "Afrique : fleuves (fiche)",
        ]),
    ]

    as_blocks = [
        ("as-m1", "Jeux de carte", [
            "Asie : pays et capitales",
            "Asie : drapeaux",
            "Asie du Sud-Est : pays",
            "Asie centrale : pays",
            "Moyen-Orient : pays",
            "Asie du Sud : pays",
            "Asie de l’Est : pays",
            "Russie (partie asiatique) : sujets fédéraux (aperçu)",
            "Chine : provinces",
            "Inde : États et territoires",
            "Japon : préfectures",
            "Indonésie : grandes îles",
        ]),
        ("as-m2", "Jeux de carte (pays individuels)", [
            "Arabie saoudite : provinces",
            "Iran : provinces",
            "Turquie : provinces",
            "Thaïlande : provinces",
            "Viêt Nam : provinces",
            "Philippines : régions",
        ]),
        ("as-fl", "Jeux de drapeau", [
            "Asie : drapeaux",
            "Asie : drapeaux (silhouettes)",
        ]),
        ("as-pr", "Documents à imprimer", [
            "Asie : carte régionale",
        ]),
    ]

    oc_blocks = [
        ("oc-m1", "Jeux de carte", [
            "Océanie : pays et territoires",
            "Océanie : drapeaux",
            "Australie : États et territoires",
            "Nouvelle-Zélande : régions",
            "Polynésie française : subdivisions (aperçu)",
            "Mélanésie : archipels",
            "Micronésie : États fédérés",
            "Pacifique : dépendances et territoires",
        ]),
        ("oc-m2", "Jeux de carte (pays individuels)", [
            "Australie : États (carte)",
            "Papouasie-Nouvelle-Guinée : provinces",
            "Fidji : divisions",
            "Samoa : districts",
        ]),
        ("oc-fl", "Jeux de drapeau", [
            "Océanie : drapeaux",
            "Océanie : drapeaux (silhouettes)",
        ]),
        ("oc-pr", "Documents à imprimer", [
            "Océanie : carte politique",
            "Pacifique : îles (fiche)",
        ]),
    ]

    specs = [
        (
            "europe.html",
            "Europe — GeoRank",
            "europe",
            "Europe — Jeux de géographie",
            "Europe",
            "Europe",
            "europe",
            pills_standard,
            "L’Europe rassemble des dizaines de pays aux frontières et histoires riches. Faites défiler pour parcourir des centaines de mini-jeux : cartes politiques, grandes régions, subdivisions nationales, drapeaux et fiches — le tout organisé en sections comme sur les grands sites de géographie.",
            EU,
            europe_jeux_carte_section(),
            "De l’Atlantique à l’Oural, des fjords nordiques à la Méditerranée, chaque série aide à relier pays, capitales et emblèmes. Les listes sont conçues pour défiler sur une longue page, comme un catalogue de quiz.",
        ),
        (
            "amerique-nord.html",
            "Amérique du Nord — GeoRank",
            "amerique-nord",
            "Amérique du Nord — Jeux de géographie",
            "Amérique du Nord",
            "Amérique du Nord",
            "an",
            pills_standard,
            "Du Canada au Mexique et aux Caraïbes, l’Amérique du Nord mélange grands espaces et archipels. Ce hub regroupe cartes, focus par pays et drapeaux — avec un renvoi vers la page détaillée des États-Unis.",
            NA,
            na_blocks,
            "Pour aller plus loin sur les États fédérés, ouvrez la page « Les États-Unis » : subdivisions, villes et drapeaux y sont listés sur une page encore plus fournie.",
        ),
        (
            "amerique-sud.html",
            "Amérique du Sud — GeoRank",
            "amerique-sud",
            "Amérique du Sud — Jeux de géographie",
            "Amérique du Sud",
            "Amérique du Sud",
            "as",
            pills_standard,
            "L’Amérique du Sud unit Amazonie, Andes et côtes océaniques. Les sections ci-dessous regroupent jeux par pays, thèmes physiques et drapeaux.",
            SA,
            sa_blocks,
            "Du Brésil au Chili, entraînez-vous sur les contours des pays, leurs subdivisions et les grands repères naturels.",
        ),
        (
            "monde.html",
            "Monde — GeoRank",
            "monde",
            "Monde — Jeux de géographie",
            "Monde",
            "Monde",
            "monde",
            pills_monde,
            "Les jeux « Monde » offrent une vision planétaire : pays, capitales, grandes villes et repères physiques. Faites défiler pour parcourir l’ensemble des modes.",
            MO,
            mo_blocks,
            "Idéal pour réviser avant un concours ou un duel entre amis : chaque ligne mène à un mini-jeu focalisé.",
        ),
        (
            "afrique.html",
            "Afrique — GeoRank",
            "afrique",
            "Afrique — Jeux de géographie",
            "Afrique",
            "Afrique",
            "afrique",
            pills_standard,
            "L’Afrique compte plus de cinquante États souverains et une diversité de paysages extraordinaire. Ce catalogue liste quiz par région, pays et thèmes de drapeaux.",
            AF,
            af_blocks,
            "Du Maghreb à Madagascar, progressez pays par pays et région par région.",
        ),
        (
            "asie.html",
            "Asie — GeoRank",
            "asie",
            "Asie — Jeux de géographie",
            "Asie",
            "Asie",
            "asie",
            pills_standard,
            "L’Asie s’étend du Moyen-Orient au Pacifique. Les sections couvrent ensembles régionaux, grands pays fédéraux et îles.",
            AS,
            as_blocks,
            "De la chaîne de l’Himalaya à la mer de Chine méridionale, reliez noms, formes et symboles.",
        ),
        (
            "oceanie.html",
            "Océanie — GeoRank",
            "oceanie",
            "Océanie — Jeux de géographie",
            "Océanie",
            "Océanie",
            "oceanie",
            pills_standard,
            "L’Océanie relie Australie, Nouvelle-Zélande et d’innombrables archipels. Les listes ci-dessous couvrent pays, territoires et subdivisions locales.",
            OC,
            oc_blocks,
            "Chaque entrée correspond à un mini-jeu à venir : la page est volontairement longue et scrollable, comme un annuaire.",
        ),
    ]

    for spec in specs:
        text = render_page(*spec)
        (REG / spec[0]).write_text(text, encoding="utf-8")
        print("wrote", spec[0])


if __name__ == "__main__":
    main()
