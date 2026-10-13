# FinLogger - Application de gestion de depenses

Projet Fin Module Mise en place un backend avec MongoDB & Express.js de la formation software engineer - Web, chez IBM SkillsBuild .
Application web full-stack (MongoDB, Express, React, Node.js) permettant de suivre ses depenses mensuelles.
Ce projet s'appuie sur les connaissances et les competences que vous avez acquises dans ces modules :
- Systemes de gestion de bases de donnees relationnelles
- Integration avec des bases de donnees structurees
- Bases de donnees non structurees
- Integration avec des bases de donnees non structurees

## Fonctionnalites

-  Tableau de bord avec vue d'ensemble (depenses, revenu, solde)
-  Resume des depenses par categorie (avec pourcentages)
-  Details des depenses (date, description, montant)
-  Ajout / Modification / Suppression de depenses
-  Filtrage par mois
-  Notifications Toast pour le feedback utilisateur

## Architecture

FinLoggerApplication/
├── backendFinlogger/ # API REST (Node.js + Express + MongoDB)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── package.json
└── frontendFinlogger/ # Interface utilisateur (React + Vite)
├── src/
│ ├── components/
│ ├── context/
│ └── assets/
└── package.json

## Technologies utilisees

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- CORS, body-parser

### Frontend
- React 18
- Vite
- React-Bootstrap
- Bootstrap 5

## Installation

### Prerequis
- Node.js (v18+)
- MongoDB (demarre en local sur le port 27017)
- npm ou yarn