# Lift-On

Egy egyszerű edzésnaplózó webalkalmazás, "Webfejlesztés" tantárgy keretében készült projekt.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI:** HeroUI, Tailwind CSS
- **Backend:** Next.js API Routes
- **Adatbázis:** SQLite (Prisma ORM)
- **Autentikáció:** JWT + bcrypt
- **Validáció:** Zod
- **Grafikonok:** Chart.js

## Adatbázis Séma
![database schema](./assets/schema.png)

## Telepítés
### Lokalis Fejlesztői Környezet

#### Előfeltételek

- Node.js v22.16.0 LTS vagy újabb
- npm v11.4.2 vagy újabb

#### Környezeti Változók

Hozz létre egy `.env` fájlt a projekt gyökerében:

```env
DATABASE_URL="file:./db/dev.db"
JWT_SECRET="your-secret-key-here"
DYNAMIC_IMAGES_DIR="public/images/"
```

#### Fejlesztői környezet

1. Klónozd le a repót:
```bash
git clone https://github.com/GitDevla/lift-on.git
cd lift-on
```

2. Telepítsd a függőségeket:
```bash
npm install
```

3. Állítsd be az adatbázist:
```bash
npx prisma generate
npm run db:setup
```

4. Indítsd el a fejlesztői szervert:
```bash
npm run dev
```

5. Nyisd meg a böngészőt: [http://localhost:3000](http://localhost:3000)

### Docker

#### Docker Build

```bash
docker build -t lift-on:latest .
```

#### Docker Compose

```bash
docker compose up
```

Az alkalmazás elérhető lesz: [http://localhost:3000](http://localhost:3000)