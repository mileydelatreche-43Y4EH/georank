# 🌍 PROMPTS DÉTAILLÉS – REPRODUCTION DU SITE SETERRA (GeoGuessr)
> Document destiné à Cursor pour reproduire fidèlement le site seterra.geoguessr.com
> URL de référence : https://www.geoguessr.com/fr/quiz/seterra

---

## 📐 PROMPT 1 — DESIGN SYSTEM & FONDATIONS

```
Crée le design system complet pour une application web de quiz de géographie appelée "Seterra".

### Typographie
- Font principale : 'ggFont', sans-serif (importer une Google Font similaire comme 'Nunito' ou 'Poppins' en fallback)
- Titres de section : 22–28px, font-weight: 700
- Sous-titres de quiz : 14–16px, font-weight: 600
- Texte courant : 14px, font-weight: 400
- Labels de navigation : 13px, font-weight: 500

### Palette de couleurs (variables CSS)
:root {
  --color-primary: #1a73e8;         /* Bleu principal (boutons, liens actifs) */
  --color-primary-dark: #1558b0;    /* Bleu foncé (hover) */
  --color-bg: #f5f7fa;              /* Fond général de la page */
  --color-bg-card: #ffffff;         /* Fond des cartes */
  --color-text-main: #1c1c1c;       /* Texte principal */
  --color-text-muted: #6b7280;      /* Texte secondaire/gris */
  --color-border: #e5e7eb;          /* Bordures légères */
  --color-nav-bg: #1e2a38;          /* Fond de la navbar (bleu-nuit foncé) */
  --color-nav-text: #ffffff;        /* Texte navbar */
  --color-nav-active: #f59e0b;      /* Onglet actif (jaune/or) */
  --color-badge-bronze: #cd7f32;    /* Badge progression bronze */
  --color-badge-silver: #a8a9ad;    /* Badge progression argent */
  --color-badge-gold: #ffd700;      /* Badge progression or */
  --color-success: #22c55e;
  --color-danger: #ef4444;
}

### Espacement
- Grille : 12px de base
- Padding section : 40px horizontal, 32px vertical
- Gap entre cartes : 16px
- Border-radius cartes : 10px
- Border-radius boutons : 6px

### Composants globaux à créer :
1. Badge de progression (bronze/argent/or + pourcentage)
2. Carte de quiz (image + titre + catégorie + badge)
3. Bouton primaire (bleu rempli)
4. Bouton secondaire (outline)
5. Sélecteur de mode (Pin / Type)
6. Tag de catégorie (Pays / Drapeaux / Capitales)
7. Indicateur de score (X / YY%)
```

---

## 📐 PROMPT 2 — LAYOUT GLOBAL & STRUCTURE DE PAGE

```
Crée la structure HTML/CSS de base de l'application Seterra avec les zones suivantes :

### Structure générale
<body>
  <header>         <!-- Navbar fixe en haut -->
  <main>
    <aside>        <!-- Sidebar de navigation régionale (optionnel sur mobile) -->
    <section>      <!-- Contenu principal : liste des quiz -->
  </main>
  <footer>         <!-- Footer avec liens -->
</body>

### Comportement responsive
- Desktop (>1024px) : layout 2 colonnes (sidebar gauche + contenu)
- Tablet (768–1024px) : sidebar collapsible
- Mobile (<768px) : navigation en scroll horizontal, sidebar cachée

### Dimensions
- Largeur max du contenu : 1280px, centré
- Sidebar largeur : 220px fixe
- Header hauteur : 56px
- Footer hauteur : auto (3–4 lignes de liens)
```

---

## 🔝 PROMPT 3 — HEADER / NAVBAR

```
Crée un composant Header pour l'application Seterra avec ces spécifications :

### Structure visuelle
- Fond : bleu-nuit foncé (#1e2a38)
- Hauteur : 56px
- Position : sticky top:0, z-index: 1000
- Ombre portée légère en bas

### Contenu de gauche à droite :
1. LOGO "Seterra" (texte stylisé blanc + icône globe 🌍 ou SVG carte)
2. Navigation régionale centrale (liens horizontaux) :
   - "Toutes" | "Europe" | "Amérique du Nord" | "Amérique du Sud" | "Afrique" | "Asie" | "Océanie" | "Monde" | "Imprimables"
   - Onglet actif : souligné + couleur #f59e0b (or/jaune)
   - Hover : couleur #f59e0b avec transition 0.2s
3. Zone droite :
   - Sélecteur de langue (dropdown avec drapeau + code langue : FR, EN, DE, ES, IT, etc.)
   - Bouton "Se connecter" : fond blanc, texte bleu, border-radius 20px, padding 6px 16px

### Mobile (<768px)
- Logo + Burger menu icon
- Navigation en drawer/menu latéral coulissant
- Sélecteur langue et connexion dans le drawer

### États interactifs
- Lien actif : couleur or + underline
- Hover sur liens : transition couleur 150ms ease
- Bouton connexion hover : fond bleu clair
```

---

## 🏠 PROMPT 4 — PAGE D'ACCUEIL PRINCIPALE (/)

```
Crée la page d'accueil principale de Seterra (page /quiz/seterra) avec les sections suivantes :

### Section Hero / Introduction
- Fond : blanc ou bleu très clair
- Titre : "Seterra – Le site de quiz de cartes ultime"
- Sous-titre : "Plus de 300 jeux et exercices de géographie disponibles en 40 langues"
- Description courte : paragraphe de 2-3 lignes expliquant l'apprentissage par le jeu
- Pas de grand visuel hero, style sobre et éducatif

### Organisation du contenu
Le contenu est organisé en BLOCS PAR CONTINENT, chacun comprenant :
- Un titre de section H2 (ex: "Europe", "Afrique", etc.)
- Sous chaque section : 3 colonnes "Pays", "Drapeaux", "Capitales"
- Chaque colonne liste les quiz correspondants avec un badge de progression bronze (0%)

### Blocs de continents à créer (dans cet ordre) :
1. Amérique du Nord (33 quiz)
2. Amérique du Sud (31 quiz)
3. Europe (49 quiz)
4. Afrique (43 quiz)
5. Asie (51 quiz)
6. Océanie (40 quiz)
7. Monde (52 quiz)

### Structure d'un bloc de quiz
<div class="region-section">
  <h2>Europe</h2>
  <div class="quiz-columns">
    <div class="quiz-col">
      <h3>Pays</h3>
      <ul>
        <li>
          <span class="flag-icon">🏳️</span>
          <a href="/quiz/europe-countries">Europe : Pays</a>
          <span class="badge bronze">0%</span>
        </li>
        ...
      </ul>
    </div>
    <div class="quiz-col">Drapeaux...</div>
    <div class="quiz-col">Capitales...</div>
  </div>
</div>

### Visuels
- Chaque région a une couleur d'accent légère pour son titre
- Badge de progression : médaille bronze circulaire + pourcentage
- Icône drapeau 32×32px à gauche de chaque ligne de quiz
```

---

## 🌍 PROMPT 5 — PAGE DE RÉGION (ex: /region/europe)

```
Crée la page d'une région spécifique, par exemple "Europe geography games".

### Header de page
- Titre H1 : "Europe : jeux de géographie"
- Description intro : 2 lignes présentant la région
- Sélecteur de mode de jeu : boutons toggle [PIN] [TYPE]
  - PIN = cliquer sur la carte
  - TYPE = taper le nom
  - Bouton actif : fond bleu, texte blanc
  - Bouton inactif : fond blanc, texte bleu, bordure

### Sections de contenu (4 catégories principales)
Chaque section a un titre H2 et une liste de quiz sous forme de grille ou liste :

#### 1. Map Games (Jeux Cartographiques)
Liste de tous les quiz avec carte interactive :
- Europe : Pays
- Europe : Capitales (Version facile / Version normale)
- Europe : Villes (Version normale / Difficile)
- Europe : Caractéristiques physiques
- Europe : Étendues d'eau / Rivières / Chaînes de montagnes
- Cartes historiques : Guerre froide, WW2, Europe médiévale, Empire romain
- Quiz par pays individuels : Allemagne, France, Italie, Espagne, etc.

#### 2. Map Games – Pays individuels (subdivisions)
- Albania: Counties
- Austria: Districts
- Belgium: Provinces
- Czech Republic: Regions
- Germany: States (+ districts par land : Bavière, Saxe...)
- France: Departments
- Italy: Regions
- ... (50+ entrées)

#### 3. Flag Games (Jeux de Drapeaux)
- Europe : Drapeaux (Version facile / normale)
- Drapeaux régionaux/provinciaux : Allemagne, France, Suisse, Italie...
- (29 quiz au total)

#### 4. Wine Games (Jeux Viticoles)
- France : Régions viticoles
- Italie : Régions viticoles
- Allemagne : Régions viticoles
- Portugal : Régions viticoles

#### 5. Printables (Imprimables)
- Europe Countries (PDF)
- Norden (PDF)
- Sweden Landscapes (PDF)

### Design des cartes de quiz
Chaque entrée = une ligne avec :
- [Miniature 48×32px de la carte/drapeau]
- [Titre du quiz]
- [Score personnel si connecté]
- [Badge progression]
Hover : fond bleu très clair, curseur pointer

### Pagination / Scroll
Longue page scrollable, pas de pagination. Ancres de navigation par section.
```

---

## 🎮 PROMPT 6 — PAGE D'UN QUIZ INDIVIDUEL (vue avant de jouer)

```
Crée la page de présentation d'un quiz individuel (avant de démarrer), exemple : "World: Physical Features".

### Layout de la page
Deux colonnes :
- Gauche (60%) : carte interactive SVG/image + zone de jeu
- Droite (40%) : panneau de configuration et d'infos

### Colonne gauche – Carte
- Carte géographique SVG interactive (ex: carte du monde, d'Europe, etc.)
- Sur la carte : les zones/pays cliquables sont en gris clair (#d1d5db)
- Zone hover : couleur bleu clair (#93c5fd)
- Zone correctement répondue : couleur verte (#22c55e)
- Zone incorrecte : couleur rouge (#ef4444)
- Fond de la carte : bleu océan clair (#bfdbfe ou #dbeafe)

### Colonne droite – Panneau info
Contenu du panneau AVANT le démarrage :

1. Titre du quiz (H1) : "World: Physical Features"
2. Description : 2-3 lignes décrivant le quiz
3. Nombre d'éléments : "23 éléments à identifier"
4. Liste des éléments : scrollable, avec nom de chaque élément
   ex: Amazon, Andes, Antarctique, Océan Arctique, Mer d'Arabie...

5. Onglets de mode :
   [Quiz] [Apprentissage]
   - Quiz = mode chronométré avec score
   - Apprentissage = mode libre sans pression

6. Sélecteur de mode de jeu :
   [📍 Épingler] [⌨️ Saisir] [⚙️ Plus]
   - Épingler : cliquer sur la carte
   - Saisir : taper le nom dans un input
   - Plus : options avancées (sans frontières, sans spoilers)

7. Indicateur de progression :
   "0 / 23 — 0%"
   Barre de progression horizontale

8. Meilleur score personnel :
   "Votre meilleur score (Épingler) : —"
   (Si connecté, affiche le score)

9. Bouton principal :
   [▶ Commencer le quiz]
   Fond bleu #1a73e8, texte blanc, width: 100%, height: 48px, border-radius: 8px

10. Bouton secondaire :
    [Créer un défi]
    Outline bleu, même width

11. Sélecteur de langue du quiz :
    Dropdown avec drapeaux : 22 langues disponibles

### Indicateur de score pendant le jeu (state actif)
- Compteur animé : "12 / 23 — 52%"
- Bouton reset (icône ×) pour recommencer
- Chronomètre si mode timed

### Comportement du panneau droit pendant le jeu
- La liste des éléments se met à jour en temps réel
- Éléments trouvés : fond vert + ✓
- Éléments non trouvés : texte normal
- L'élément courant à trouver : en gras + surligné jaune
```

---

## 🎮 PROMPT 7 — INTERFACE DE JEU ACTIVE (pendant la partie)

```
Crée l'interface de jeu active lorsqu'un quiz est en cours.

### Mode PIN (Épingler)
- La carte occupe 60–70% de l'écran
- En haut de l'écran : bandeau avec le nom de l'élément à trouver
  Style : fond bleu foncé, texte blanc, font-size 20px, centré
  Ex: "Cliquez sur : Andes"
- La carte est interactive : le curseur devient une épingle
- Au clic :
  - Bonne réponse : la zone flashe en vert + son "ding" + score +1
  - Mauvaise réponse : la zone flashe en rouge + la bonne zone apparaît en vert
- Transition entre questions : 1.5s avant question suivante

### Mode TYPE (Saisir)
- Input text centré sous le nom de l'élément
- Placeholder : "Tapez votre réponse..."
- Touche Enter pour valider
- Auto-complétion possible
- Même feedback couleur sur la carte

### HUD (Heads-Up Display) – toujours visible
- Haut gauche : [Score : X/Y — ZZ%]
- Haut droite : [⏱ Chrono : 02:34] (si mode chronométré)
- Bas : barre de progression horizontale animée

### Écran de fin de quiz
Affiché quand tous les éléments ont été trouvés ou temps écoulé :
- Grande animation de succès (confettis ou étoiles)
- Score final : "18/23 — 78%"
- Nouveau record personnel : badge doré si meilleur score
- Temps écoulé
- Boutons :
  [🔄 Rejouer]    [📊 Voir les résultats détaillés]    [🏆 Créer un défi]
- Liste des éléments manqués mis en évidence

### Mode Apprentissage (Learn)
- Pas de chronomètre
- Pas de pression
- Survol d'une zone → affiche le nom
- Clic sur une zone → affiche un encadré info (nom + capital + drapeau si pertinent)
- Pas de score
```

---

## 🗺️ PROMPT 8 — COMPOSANT CARTE SVG INTERACTIVE

```
Crée un composant de carte SVG interactive réutilisable pour les quiz de géographie.

### Props du composant
interface MapProps {
  regions: Region[];           // Liste des zones cliquables
  mode: 'pin' | 'type' | 'learn';
  currentTarget?: string;      // Élément courant à trouver
  answeredCorrect: string[];   // Éléments correctement identifiés
  answeredWrong: string[];     // Éléments ratés
}

interface Region {
  id: string;                  // ex: "FR" pour France
  name: string;                // ex: "France"
  svgPath: string;             // Chemin SVG du pays/région
  capital?: string;
  flagUrl?: string;
}

### États visuels des zones
- Default (non répondu) : fill="#d1d5db", stroke="#ffffff", stroke-width: 1
- Hover : fill="#93c5fd", cursor: pointer, transition: fill 150ms
- Correct : fill="#22c55e", stroke="#16a34a"
- Incorrect : fill="#ef4444", stroke="#dc2626"
- Cible actuelle (mode learn) : fill="#fef3c7", stroke="#f59e0b" (jaune)

### Interactions
- Click sur région → callback onRegionClick(regionId)
- Hover → tooltip avec nom de la région (si mode learn)
- Zoom/Pan : optionnel avec molette souris
- Responsive : viewBox adaptatif, width: 100%

### Implémentation suggérée
Utiliser react-simple-maps ou des paths SVG hardcodés.
Chaque path SVG = un pays/région avec un attribut data-id.

### Tooltip au hover (mode apprentissage)
<div class="map-tooltip">
  <img src={flagUrl} alt={name} width="24" />
  <span>{name}</span>
</div>
Positionné dynamiquement à côté du curseur.
```

---

## 📋 PROMPT 9 — SIDEBAR DE NAVIGATION

```
Crée la sidebar de navigation latérale présente sur les pages de région/catégorie.

### Position & style
- Gauche fixe
- Largeur : 220px
- Fond : blanc (#ffffff)
- Bordure droite : 1px solid #e5e7eb
- Hauteur : 100vh sticky

### Contenu
1. Section "Continents / Régions"
   Liens de navigation :
   - 🌍 Toutes les régions
   - 🇪🇺 Europe
   - 🌎 Amérique du Nord
   - 🌎 Amérique du Sud
   - 🌍 Afrique
   - 🌏 Asie
   - 🌏 Océanie
   - 🌐 Monde
   - 🇺🇸 États-Unis (section spéciale)

2. Section "Types de jeux"
   - 🗺️ Jeux de cartes
   - 🏴 Jeux de drapeaux
   - 🍷 Jeux de vins
   - 🖨️ Imprimables

3. Section "Catégories"
   - Pays
   - Capitales
   - Villes
   - Géographie physique
   - Histoire

### Style des liens
- Padding : 10px 16px
- Font-size : 14px
- Couleur inactive : #4b5563
- Couleur active : #1a73e8 + fond #eff6ff
- Hover : fond #f3f4f6
- Border-left actif : 3px solid #1a73e8
- Transition : background 150ms

### Mobile
- Cachée par défaut
- Accessible via bouton hamburger ou swipe
- Drawer overlay depuis la gauche
```

---

## 👤 PROMPT 10 — SYSTÈME D'AUTHENTIFICATION

```
Crée le système de connexion/inscription pour Seterra.

### Modal de connexion
Déclenchée par le bouton "Se connecter" dans le header.

Contenu du modal :
1. Titre : "Connectez-vous à Seterra"
2. Sous-titre : "Pour sauvegarder vos scores et défier vos amis"
3. Bouton Google SSO :
   [G  Continuer avec Google]
   Fond blanc, bordure grise, icône Google, texte #3c4043
4. Bouton Apple SSO :
   [🍎  Continuer avec Apple]
   Fond noir, texte blanc
5. Séparateur : "— ou —"
6. Formulaire email/mot de passe :
   - Input Email (type: email, placeholder: "Votre email")
   - Input Mot de passe (type: password, placeholder: "Votre mot de passe")
   - Bouton [Se connecter] fond bleu
   - Lien "Mot de passe oublié ?"
7. Bas du modal : "Pas de compte ? [S'inscrire]"

### Style du modal
- Overlay fond semi-transparent rgba(0,0,0,0.5)
- Carte blanche, border-radius: 16px
- Largeur max: 400px, centré
- Padding: 32px
- Animation d'entrée : fade + scale depuis 0.95 à 1

### État connecté (header)
- Avatar circulaire (initiales ou photo)
- Dropdown : Mon profil / Mes scores / Défis / Déconnexion
```

---

## 🏆 PROMPT 11 — SYSTÈME DE PROGRESSION & BADGES

```
Crée le système de progression et badges pour Seterra.

### Types de badges
1. Bronze  : 0-49% de réussite  → couleur #cd7f32
2. Argent  : 50-79%             → couleur #a8a9ad
3. Or      : 80-94%             → couleur #ffd700
4. Platine : 95-100%            → couleur #e5e4e2 + brillance

### Composant Badge
<Badge type="bronze" score={34} />

Rendu visuel :
- Cercle de 40×40px
- Fond couleur du badge
- Icône médaille SVG au centre
- Pourcentage en dessous en petit texte

### Affichage sur les cartes de quiz
Chaque quiz affiche :
- Colonne "Pays" → badge Pays + %
- Colonne "Drapeaux" → badge Drapeaux + %
- Colonne "Capitales" → badge Capitales + %
Si score = 0 ou non joué : badge bronze vide (0%)

### Profil utilisateur – Page de stats
- Header : avatar + nom + date d'inscription
- Statistiques globales :
  - Quiz joués
  - Meilleur score moyen
  - Streak (jours consécutifs)
  - Pays couverts (sur carte visuelle)
- Tableau de progression par région :
  | Région    | Pays | Drapeaux | Capitales | Score moyen |
  |-----------|------|----------|-----------|-------------|
  | Europe    | 78%  |   45%    |    62%    |    62%      |
  | Afrique   | 30%  |    0%    |    15%    |    15%      |
  ...

### Animation de progression
Lors de la complétion d'un quiz :
- Barre de progression animée (CSS transition width)
- Si nouveau badge atteint : animation pop + confettis
- Notification toast en bas à droite : "🥇 Nouveau record ! 87%"
```

---

## 🔍 PROMPT 12 — SYSTÈME DE RECHERCHE & FILTRES

```
Crée le système de recherche et filtres pour les quiz Seterra.

### Barre de recherche
Position : en haut de la page de liste des quiz
Style :
- Largeur : 100% ou max 600px centré
- Hauteur : 44px
- Border-radius : 22px (pill)
- Fond : blanc, bordure #d1d5db
- Icône loupe à gauche (padding-left: 40px)
- Placeholder : "Rechercher un quiz... (ex: Europe, drapeaux, capitales)"
- Touche Escape efface la recherche

Comportement :
- Recherche en temps réel (debounce 300ms)
- Met en évidence les quiz correspondants
- Affiche le nombre de résultats : "12 quiz trouvés"
- Si aucun résultat : message "Aucun quiz trouvé pour '{terme}'"

### Filtres actifs
Row de chips/tags de filtre sous la barre de recherche :

[Toutes les régions ▾] [Type de jeu ▾] [Catégorie ▾] [Difficulté ▾]

Chaque filtre = dropdown avec cases à cocher :

Filtre "Type de jeu" :
- ✅ Jeux de cartes
- ✅ Jeux de drapeaux
- ☐ Jeux de vins
- ☐ Imprimables

Filtre "Catégorie" :
- ✅ Pays
- ✅ Capitales
- ☐ Villes
- ☐ Géographie physique
- ☐ Histoire

Filtre "Difficulté" :
- ☐ Facile
- ✅ Normal
- ☐ Difficile

### Tags de filtre actifs
Quand un filtre est actif, afficher un chip :
[🗺️ Jeux de cartes ×] [Europe ×] [Effacer tout]

### Tri
Sélecteur de tri à droite :
[Trier par : Popularité ▾]
Options : Popularité / Nouveautés / Alphabétique / Score personnel
```

---

## 🖨️ PROMPT 13 — PAGE IMPRIMABLES (Printables)

```
Crée la page des ressources imprimables de Seterra.

### Layout
- Titre H1 : "Cartes à imprimer"
- Sous-titre : "Des cartes muettes pour apprendre et tester vos connaissances"
- Grille de cartes : 3 colonnes sur desktop, 2 sur tablet, 1 sur mobile

### Carte imprimable (composant)
<PrintableCard>
  - Image prévisualisation de la carte (thumbnail 280×200px)
  - Titre : "Europe : Les pays"
  - Description courte
  - Badge : "PDF Gratuit"
  - Bouton [📥 Télécharger] : fond bleu
  - Bouton [👁️ Aperçu] : outline
</PrintableCard>

### Liste des imprimables disponibles
Monde :
- World Countries (carte muette du monde)
- World Physical Features
- Continents and Oceans

Europe :
- Europe Countries
- Norden (Pays nordiques)
- Sweden Landscapes

États-Unis :
- USA States
- USA: 13 Colonies
- USA: Civil War

### Style
- Fond des cartes : blanc
- Ombre légère : box-shadow 0 2px 8px rgba(0,0,0,0.08)
- Badge PDF : fond vert clair #d1fae5, texte vert #065f46
- Hover : élévation de l'ombre + léger scale(1.02)
```

---

## 🌐 PROMPT 14 — FOOTER

```
Crée le footer complet du site Seterra.

### Layout
- Fond : #1e2a38 (bleu nuit, même que navbar)
- Texte : blanc/gris clair
- Padding : 48px horizontal, 40px vertical
- 4 colonnes sur desktop, 2 sur tablet, 1 sur mobile

### Colonne 1 — À propos
Titre : "À propos"
Liens :
- Notre histoire
- L'équipe
- Blog
- Presse

### Colonne 2 — Jeux
Titre : "Jeux"
Liens :
- Tous les quiz
- Quiz Europe
- Quiz Monde
- Quiz Drapeaux
- Imprimables

### Colonne 3 — Support
Titre : "Support"
Liens :
- Nous contacter
- FAQ
- Tarification
- Signaler un problème

### Colonne 4 — Légal
Titre : "Légal"
Liens :
- Conditions d'utilisation
- Politique de confidentialité
- Politique des cookies
- Paramètres des cookies

### Bas du footer
Ligne séparatrice + ligne inférieure :
- Gauche : "© 2024 Seterra – Tous droits réservés"
- Centre : Icônes réseaux sociaux (Facebook, Twitter/X, Instagram, YouTube)
- Droite : Sélecteur de langue

### Style des liens footer
- Couleur : #9ca3af
- Hover : couleur blanche, transition 150ms
- Font-size : 13px
```

---

## 📱 PROMPT 15 — RESPONSIVITÉ MOBILE

```
Adapte toute l'interface Seterra pour les écrans mobiles (<768px).

### Header mobile
- Logo + texte "Seterra" à gauche
- Icône hamburger (☰) à droite
- La navigation régionale passe dans un menu drawer

### Menu drawer mobile
- Overlay fond semi-transparent
- Panneau blanc depuis la gauche (width: 280px)
- Animation slide-in 250ms ease
- Contenu :
  - Avatar/connexion en haut
  - Navigation régionale (liste verticale)
  - Sélecteur de langue
  - Liens secondaires
  - Bouton fermeture (×)

### Page d'accueil mobile
- Les blocs par continent passent en colonne unique
- Les 3 colonnes (Pays/Drapeaux/Capitales) passent en onglets
  [Pays] [Drapeaux] [Capitales] → scroll horizontal de tabs
- Chaque onglet affiche sa liste verticale de quiz

### Page de quiz mobile
- La carte occupe 100% de la largeur
- Le panneau de configuration passe en DESSOUS de la carte
- Le panneau devient une bottom sheet collapsible
- Bouton "Commencer" toujours visible en sticky bottom

### Interface de jeu mobile
- Carte : hauteur fixe 50vh
- Le bandeau "Trouvez : Andes" en haut (hauteur 48px)
- HUD score en haut
- En mode TYPE : input clavier qui remonte automatiquement
- Bouton de renonciation "Passer" toujours visible

### Touch interactions
- Swipe gauche/droite sur la liste des quiz → changer de région
- Pinch-to-zoom sur les cartes SVG
- Double-tap pour zoomer sur une zone de carte
```

---

## 🔔 PROMPT 16 — NOTIFICATIONS & TOASTS

```
Crée un système de notifications toast pour Seterra.

### Types de toasts
1. Succès (vert) : "✅ Quiz terminé ! Score : 18/23"
2. Erreur (rouge) : "❌ Mauvaise réponse – C'était la {réponse}"
3. Info (bleu) : "💡 Astuce : Activez le mode apprentissage pour découvrir les zones"
4. Badge gagné (or) : "🏆 Nouveau badge ! Vous avez atteint le niveau Argent en Europe"

### Position
- Bas droite de l'écran
- Offset : 24px from bottom, 24px from right
- Stack vertical si plusieurs toasts (gap: 8px)

### Style toast
- Width : 320px
- Padding : 12px 16px
- Border-radius : 10px
- Ombre : 0 4px 16px rgba(0,0,0,0.15)
- Icône à gauche
- Message texte
- Bouton × à droite pour fermer

### Animations
- Entrée : slide-in depuis la droite + fade-in (300ms)
- Sortie : slide-out + fade-out (200ms)
- Auto-dismiss : 4 secondes
- Pause au hover
```

---

## 🏗️ PROMPT 17 — ARCHITECTURE DES DONNÉES (DATA MODEL)

```
Définis le modèle de données complet pour l'application Seterra.

### Types TypeScript

interface Quiz {
  id: string;                    // ex: "3459"
  title: string;                 // ex: "World: Physical Features"
  titleFr: string;               // ex: "Monde : Caractéristiques physiques"
  region: Region;                // Europe | Africa | World | etc.
  category: QuizCategory;        // countries | flags | capitals | physical | history | wine
  mode: QuizGameMode;            // map | flag
  difficulty: 'easy' | 'normal' | 'hard';
  elementCount: number;          // nombre d'éléments à trouver (ex: 23)
  elements: QuizElement[];
  thumbnailUrl: string;
  supportedLanguages: string[];  // ['fr', 'en', 'de', ...]
  isPrintable: boolean;
  printableUrl?: string;
}

type Region = 'europe' | 'north-america' | 'south-america' | 'africa' | 'asia' | 'oceania' | 'world' | 'usa';
type QuizCategory = 'countries' | 'flags' | 'capitals' | 'cities' | 'physical' | 'history' | 'wine' | 'sports';
type QuizGameMode = 'pin' | 'type';

interface QuizElement {
  id: string;
  name: string;                  // Nom dans la langue du quiz
  svgPathId?: string;            // ID du path SVG sur la carte
  flagUrl?: string;
  capitalName?: string;
  audioUrl?: string;             // Prononciation audio
  coordinates?: [number, number]; // [lat, lng] pour mode pin
}

interface UserScore {
  userId: string;
  quizId: string;
  mode: QuizGameMode;
  score: number;                 // 0–100
  correctCount: number;
  totalCount: number;
  timeSeconds: number;
  date: Date;
  isPersonalBest: boolean;
}

interface UserProgress {
  userId: string;
  quizId: string;
  badgeLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
  bestScore: number;
  playCount: number;
  lastPlayedAt: Date;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  preferredLanguage: string;
  progress: UserProgress[];
}

interface Challenge {
  id: string;
  creatorId: string;
  quizId: string;
  mode: QuizGameMode;
  shareCode: string;
  createdAt: Date;
  participants: ChallengeParticipant[];
}

interface ChallengeParticipant {
  userId?: string;
  displayName: string;
  score: number;
  completedAt: Date;
}

### Routes de l'application
GET  /api/quizzes                     → Liste tous les quiz (avec filtres)
GET  /api/quizzes/:id                 → Détail d'un quiz
GET  /api/quizzes/region/:region      → Quiz par région
GET  /api/user/progress               → Progression de l'utilisateur
POST /api/user/scores                 → Soumettre un score
GET  /api/challenges/:shareCode       → Rejoindre un défi
POST /api/challenges                  → Créer un défi
```

---

## ⚙️ PROMPT 18 — STACK TECHNIQUE & CONFIGURATION

```
Configure le projet technique pour reproduire Seterra.

### Stack recommandée
Frontend :
- Framework : Next.js 14 (App Router)
- Langage : TypeScript
- Styling : Tailwind CSS + CSS Modules pour les composants spécifiques
- Cartes SVG : react-simple-maps ou SVG custom
- State management : Zustand (global) + React state (local)
- Animations : Framer Motion
- Icons : Lucide React

Backend :
- API Routes Next.js (si simple) ou Express.js
- Base de données : PostgreSQL (scores/users) + JSON statique (données quiz)
- Auth : NextAuth.js (Google + Apple OAuth)
- Cache : Redis (optionnel, pour leaderboards)

### Structure de dossiers
/src
  /app
    /[locale]               ← Internationalisation (fr, en, de...)
      /quiz
        /seterra            ← Page d'accueil Seterra
        /[region]           ← Page par région (europe, africa...)
      /vgp
        /[quizId]           ← Page d'un quiz individuel
      /play
        /[quizId]           ← Interface de jeu active
      /profile              ← Profil utilisateur
      /printables           ← Page imprimables
  /components
    /layout
      Header.tsx
      Sidebar.tsx
      Footer.tsx
    /quiz
      QuizCard.tsx
      QuizList.tsx
      QuizRegionSection.tsx
      ProgressBadge.tsx
    /game
      MapGame.tsx
      SvgMap.tsx
      GameHUD.tsx
      ResultScreen.tsx
      LearnMode.tsx
    /ui
      Button.tsx
      Modal.tsx
      Toast.tsx
      Dropdown.tsx
      SearchBar.tsx
      FilterChips.tsx
  /data
    /quizzes
      europe.json
      africa.json
      world.json
      ...
  /hooks
    useGameState.ts
    useUserProgress.ts
    useQuizTimer.ts
  /lib
    auth.ts
    db.ts
  /styles
    globals.css
    variables.css

### Internationalisation
- next-intl pour les traductions
- Langues : fr, en, de, es, it, nl, pt, tr, ja, pl, ko, sv
- Routes : /fr/quiz/seterra, /en/quiz/seterra, /de/quiz/seterra

### Données quiz (JSON statique)
Les données de quiz peuvent être stockées en JSON dans /data/quizzes/ :
Chaque fichier contient la liste des quiz d'une région avec tous leurs éléments (noms, coordonnées, drapeaux, SVG path IDs).
Les fichiers SVG des cartes sont dans /public/maps/
```

---

## 🌟 PROMPT 19 — RÉCAPITULATIF : ORDRE DE DÉVELOPPEMENT

```
Voici l'ordre de développement recommandé pour reproduire Seterra avec Cursor :

### Phase 1 — Fondations (Jour 1-2)
1. Setup Next.js 14 + TypeScript + Tailwind
2. Créer le design system (variables CSS, typographie, couleurs)
3. Créer le composant Header avec navigation régionale
4. Créer le Footer
5. Layout de base avec sidebar

### Phase 2 — Pages de liste (Jour 3-4)
6. Page d'accueil /quiz/seterra avec tous les blocs continent
7. Page de région /region/europe (avec toutes les sections)
8. Composant QuizCard + ProgressBadge
9. Barre de recherche + filtres

### Phase 3 — Page de quiz individuel (Jour 5-6)
10. Page /vgp/[id] avec layout 2 colonnes
11. Liste des éléments scrollable
12. Sélecteur de mode (Pin/Type)
13. Bouton "Commencer le quiz"

### Phase 4 — Interface de jeu (Jour 7-10)
14. Composant SvgMap avec zones interactives
15. Mode PIN (clic sur carte)
16. Mode TYPE (input texte)
17. HUD (score, timer, progression)
18. Écran de résultats
19. Mode Apprentissage

### Phase 5 — Fonctionnalités utilisateur (Jour 11-14)
20. Authentification (NextAuth + Google)
21. Sauvegarde des scores
22. Système de badges/progression
23. Profil utilisateur
24. Système de défis (challenges)

### Phase 6 — Polish (Jour 15-16)
25. Animations (Framer Motion)
26. Responsive mobile complet
27. Système de toasts/notifications
28. Internationalisation (fr/en au minimum)
29. Page Imprimables
30. Tests et optimisations
```

---

*Document généré pour reproduction du site Seterra (geoguessr.com/fr/quiz/seterra)*
*Prompts conçus pour être utilisés avec Cursor AI*
