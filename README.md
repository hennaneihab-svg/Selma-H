# Selma H — Site Vitrine

Site vitrine multi-pages statique pour **Selma H**, maison de couture algérienne sur-mesure basée à **Oran**, spécialisée dans le patrimoine vestimentaire de l'Algérie de l'Ouest : chedda, karakou, caftan, robes de soirée et de cérémonie.

## Aperçu

**URL de production** : https://hennaneihab-svg.github.io/Selma-H/

---

## Structure du projet

```
/
├── index.html          → Accueil
├── atelier.html        → L'Atelier (histoire, savoir-faire, Oran)
├── collections.html    → Collections (4 univers)
├── sur-mesure.html     → Le Sur-Mesure (processus + FAQ)
├── galerie.html        → Galerie (grille masonry + filtres)
├── contact.html        → Contact (formulaire + carte Oran + WhatsApp)
├── css/
│   └── style.css       → Design system complet (tokens, composants, layout)
├── js/
│   └── main.js         → GSAP + Lenis + animations + interactions
└── assets/
    ├── logo.png        → Logo officiel Selma H
    └── hero_bg.jpg     → Image hero (générée IA)
```

---

## Stack technique

- **HTML5** sémantique — 6 pages statiques sans framework, sans build tool
- **CSS vanilla** — variables CSS, typographie fluide (`clamp()`), grilles CSS, animations
- **JavaScript vanilla** — GSAP + Lenis (via CDN), IntersectionObserver, accordéon, filtres
- **Zéro dépendance locale** — compatible GitHub Pages sans configuration

## Design system

| Token | Valeur | Rôle |
|---|---|---|
| `--black` | `#0A0908` | Fond principal |
| `--black-soft` | `#151210` | Sections alternées |
| `--gold` | `#DCA050` | Couleur signature |
| `--gold-pale` | `#F0DCA0` | Titres en relief |
| `--ivory` | `#F6EFE2` | Corps de texte |

**Polices** : Cormorant Garamond (titres) · Marcellus (labels) · Jost (corps)

---

## Ouvrir en local

Double-cliquer sur `index.html` dans votre explorateur de fichiers.

Pour un serveur local (évite les restrictions CORS sur les iframes) :
```bash
# Python 3
python -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## Coordonnées & Réseaux configurés

1. **WhatsApp & Téléphone** : `+213 553 26 81 31` (`https://wa.me/213553268131`)
2. **Instagram** : `https://www.instagram.com/selma.salhi05?igsi=MThncDZldnJicnRtOA==`
3. **TikTok** : `https://tiktok.com/@selmasalhi5?_r=1&_t=ZS-994UITYHSjw`
4. **Email & Formulaire** : `selmasalhi.pro@gmail.com` via **Web3Forms** (clé active `b3702116-e898-42f5-9fb2-fe70a364af69`)
5. **Photos** : Remplacer les dégradés CSS par les photographies réelles des créations

---

## Déploiement GitHub Pages

1. Pousser sur la branche `main` du dépôt `https://github.com/hennaneihab-svg/Selma-H`
2. Aller dans **Settings → Pages**
3. Source : **Deploy from a branch** → branche `main`, dossier `/root`
4. Le site sera disponible à : **https://hennaneihab-svg.github.io/Selma-H/**

---

© 2026 Selma H — Haute Couture Algérienne, Oran
