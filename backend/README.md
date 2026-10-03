# Quest Board Backend

Backend for a solo-play, async-multiplayer board game website.

## Tech Stack
- Node.js + Express
- PostgreSQL via Prisma ORM
- REST API

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Run database migrations
```bash
npx prisma migrate dev --name init
```

### 4. Seed the database (optional)
```bash
npm run db:seed
```

### 5. Start the server
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/move` | Roll dice and move player |
| GET | `/api/move/state/:playerName` | Get player's current state |
| POST | `/api/answer` | Answer a pending question |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get ranked leaderboard |

### Admin (requires API key)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | God view: board + all players |
| POST | `/api/admin/force-end` | Force end all runs |

Admin endpoints require `X-API-Key` header.

## Quick Test

```bash
# Make a move
curl -X POST http://localhost:3001/api/move \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Alice"}'

# Answer a question
curl -X POST http://localhost:3001/api/answer \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Alice", "answer": true}'

# Check leaderboard
curl http://localhost:3001/api/leaderboard
```
