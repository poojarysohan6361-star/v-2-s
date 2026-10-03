-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('in_progress', 'completed', 'force_ended');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "currentTile" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,
    "status" "RunStatus" NOT NULL DEFAULT 'in_progress',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMoveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "pendingDifficulty" TEXT,
    "pendingTile" INTEGER,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevealedTile" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "tileNumber" INTEGER NOT NULL,
    "revealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevealedTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionLog" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "tileNumber" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "scoreDelta" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE INDEX "Run_playerId_idx" ON "Run"("playerId");

-- CreateIndex
CREATE INDEX "Run_status_idx" ON "Run"("status");

-- CreateIndex
CREATE INDEX "RevealedTile_runId_idx" ON "RevealedTile"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "RevealedTile_runId_tileNumber_key" ON "RevealedTile"("runId", "tileNumber");

-- CreateIndex
CREATE INDEX "QuestionLog_runId_idx" ON "QuestionLog"("runId");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevealedTile" ADD CONSTRAINT "RevealedTile_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionLog" ADD CONSTRAINT "QuestionLog_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
