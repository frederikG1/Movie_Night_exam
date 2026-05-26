## Kom i gang

### 1. Klon projektet
```bash
git clone 
cd Movie_Night_exam
```

### 2. Backend setup
```bash
cd backend
npm install
```

Opret en `.env` fil i `backend/` baseret på `.env.example`:
SESSION_SECRET= (kør i terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
TMDB_API_KEY

Opret databasen:
```bash
npm run setup-db
```

Start backend:
```bash
npm run dev
```
Kører på `http://localhost:8080`

### 3. Frontend setup
I en ny terminal:
```bash
cd frontend
npm install
npm run dev
```
Kører på `http://localhost:5173`

For at nulstille databasen:
```bash
npm run reset-db
```

**Backend**
- `npm run dev` – start serveren med nodemon
- `npm run setup-db` – opret tabeller
- `npm run reset-db` – slet og genopret tabeller
