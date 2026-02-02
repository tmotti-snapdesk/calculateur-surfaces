# Calculateur de Surfaces

Application de calcul de surfaces avec Next.js (frontend) et Node.js/Express (backend).

## Structure du projet

```
calculateur-surfaces/
├── frontend/          # Application Next.js
│   ├── src/
│   │   ├── app/       # App Router (pages et layouts)
│   │   ├── components/ # Composants React réutilisables
│   │   ├── lib/       # Utilitaires et helpers
│   │   └── styles/    # Styles globaux
│   └── public/        # Fichiers statiques
├── backend/           # API Node.js/Express
│   └── src/
│       ├── routes/     # Définition des routes
│       ├── controllers/ # Logique des contrôleurs
│       ├── services/   # Logique métier
│       ├── middleware/ # Middlewares Express
│       └── config/     # Configuration
└── README.md
```

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Le backend sera accessible sur http://localhost:3001

## Scripts disponibles

### Frontend

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

### Backend

- `npm run dev` - Démarre le serveur de développement avec hot-reload
- `npm run build` - Compile TypeScript en JavaScript
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## API Endpoints

- `GET /health` - Vérification de santé du serveur
- `GET /api` - Information sur l'API
- `GET /api/surfaces/shapes` - Liste des formes supportées
- `POST /api/surfaces/calculate` - Calcul de surface

## Technologies utilisées

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
