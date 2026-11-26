# DevOnDeck - Monorepo (Projet Global)

Ce dépôt regroupe le projet complet **DevOnDeck** comprenant le Backend (API REST) et le Frontend (Application Web).

---

## 📁 Structure du projet

```text
devondeck/
├── devondeck-api/         # Backend (Java 21, Spring Boot 3.3.5, PostgreSQL, JPA/Hibernate)
│   ├── pom.xml
│   └── src/
└── devondeck-web/         # Frontend (React 18, Vite, Tailwind CSS, React Router)
    ├── package.json
    └── src/
```

---

## 🛠️ Prérequis

- **Java JDK 21**
- **Node.js** (version 18 ou supérieure) et **npm**
- **PostgreSQL** (version 14 ou supérieure)
- Un IDE (IntelliJ IDEA, VS Code ou Eclipse)

---

## 🚀 Démarrage rapide

### 1. Base de données PostgreSQL
Créez la base de données requise :
```sql
CREATE DATABASE devondeck;
```
> Vérifiez dans `devondeck-api/src/main/resources/application.properties` que les identifiants (`spring.datasource.username` et `spring.datasource.password`) correspondent à votre PostgreSQL local.

---

### 2. Démarrer le Backend (Spring Boot)
Ouvrez un terminal dans `devondeck-api` :
```bash
cd devondeck-api
./mvnw spring-boot:run
# ou avec maven installé :
mvn spring-boot:run
```
L'API sera disponible sur : **http://localhost:8080**

---

### 3. Démarrer le Frontend (React / Vite)
Ouvrez un second terminal dans `devondeck-web` :
```bash
cd devondeck-web
npm install
npm run dev
```
L'interface sera accessible sur : **http://localhost:5173** (ou l'URL affichée par Vite).
