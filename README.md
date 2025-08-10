# 🚀 OpinionOasis NestJS + PostgreSQL

Projet backend réalisé avec [NestJS](https://nestjs.com/) (TypeScript), connecté à une base de données PostgreSQL, démarrable en local via Docker Compose.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation de Docker pour PostgreSQL](#utilisation-de-docker-pour-postgresql)
- [Lancement de l'application](#lancement-de-lapplication)

---

## Fonctionnalités

- API REST avec NestJS et TypeORM
- Authentification JWT (optionnelle si déjà intégré)
- Module utilisateurs (CRUD: création, consultation)
- Validation avec class-validator
- Base PostgreSQL hébergée en Docker

## Prérequis

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)

## Installation

Clone le repo et installe les dépendances :

git clone <URL_DU_REPO>
cd <nom_du_dossier>
npm install


## Utilisation de Docker pour PostgreSQL

1. Démarre la base de données PostgreSQL :

docker-compose down

## Lancement de l'application

npm run start:dev

**Auteur :** JongChong  
