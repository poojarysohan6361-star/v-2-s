import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerState } from '../hooks/usePlayerState.js';
import { useTurnSequence } from '../hooks/useTurnSequence.js';
import { useMove } from '../hooks/useMove.js';
import { useAnswer } from '../hooks/useAnswer.js';
import { useTileLog } from '../hooks/useTileLog.js';
import { Board } from '../components/board/Board.jsx';
import { HUD } from '../components/play/HUD.jsx';
import { Dice } from '../components/play/Dice.jsx';
import { EffectCard } from '../components/play/EffectCard.jsx';
import { QuestionPanel } from '../components/play/QuestionPanel.jsx';
import { ResultCard } from '../components/play/ResultCard.jsx';
import { WinScreen } from '../components/play/WinScreen.jsx';
import { RunOverScreen } from '../components/play/RunOverScreen.jsx';
import { TurnLog } from '../components/play/TurnLog.jsx';
import { AlertCircle, Dices, RefreshCw } from 'lucide-react';
import './PlayPage.css';

/**
 * @param {Object} props
 * @param {string|null} props.playerName
 */
export function PlayPage({ playerName }) {
  const navigate = useNavigate();

  // Redirect if no player name set
  useEffect(() => {
    if (!playerName) {
      navigate('/', { replace: true });
    }
  }, [playerName, navigate]);

  const playerQuery = usePlayerState(playerName);
  const moveMutation = useMove(playerName);
  const answerMutation = useAnswer(playerName);
  const tileLog = useTileLog(playerName);

  const turn = useTurnSequence();

  // Local state for smooth tile movement animation
  const [displayTile, setDisplayTile] = useState(1);
  const [scoreDelta, setScoreDelta] = useState(null);
  const [diceRollValue, setDiceRollValue] = useState(null);

  // Sync state from server query
  const serverState = playerQuery.data;

  // Local tile cache from localStorage
  const [tileCache, setTileCache] = useState(() => tileLog.readCache());

  useEffect(() => {
    setTileCache(tileLog.readCache());
  }, [playerName, tileLog.readCache]);

  // Update display tile and restore pending questions when idle
  useEffect(() => {
    if (serverState && turn.phase === 'idle') {
      if (serverState.pendingDifficulty && turn.phase !== 'question') {
        turn.restoreQuestion();
      } else if (serverState.currentTile != null) {
        setDisplayTile(serverState.currentTile);
      }
    }
  }, [serverState?.currentTile, serverState?.pendingDifficulty, turn.phase, turn.restoreQuestion]);

  // Handle Roll Dice action
  const handleRoll = async () => {
    if (turn.isLocked || moveMutation.isPending) return;

    if (!turn.startRoll()) return;
    setDiceRollValue(null);

    try {
      const res = await moveMutation.mutateAsync();
      setDiceRollValue(res.roll);
      turn.addLog(`Rolled a ${res.roll}! Moved to tile ${res.newPosition}`, 'move');
      turn.onMoveResult(res);

      // Persist discovered landing tile type
      if (res.effect?.tileNumber && res.effect?.type) {
        tileLog.writeTile(res.effect.tileNumber, { type: res.effect.type });
        setTileCache(tileLog.readCache());
      }

      // Animate player token movement step-by-step
      const start = displayTile;
      const target = res.newPosition;
      const step = start < target ? 1 : -1;
      let curr = start;

      const finishMove = () => {
        setDisplayTile(target);
        if (res.promptAnswer || res.effect?.type === 'question' || res.effect?.type === 'final_checkpoint') {
          turn.onEffectDone(res);
        } else {
          turn.onMoveDone();
          if (res.effect?.scoreDelta) {
            setScoreDelta(res.effect.scoreDelta);
          }
        }
      };

      if (start === target) {
        finishMove();
        return;
      }

      const interval = setInterval(() => {
        curr += step;
        setDisplayTile(curr);
        if ((step > 0 && curr >= target) || (step < 0 && curr <= target)) {
          clearInterval(interval);
          finishMove();
        }
      }, 150);
    } catch (err) {
      if (err.status === 400 && err.message?.toLowerCase().includes('not in progress')) {
        turn.setRunOver();
        return;
      }
      turn.addLog(`Move failed: ${err.message}`, 'error');
      turn.forceIdle();
    }
  };

  // Handle Answer Question action
  const handleAnswer = async (choice) => {
    if (answerMutation.isPending) return;
    turn.startAnswer();

    try {
      const res = await answerMutation.mutateAsync(choice);
      turn.onAnswerResult(res);
      if (res.scoreDelta != null) setScoreDelta(res.scoreDelta);
      if (res.currentTile != null) setDisplayTile(res.currentTile);

      const isWin = res.outcome === 'win';
      const isCorrect = res.outcome === 'correct';
      const statusText = isWin
        ? (res.message || 'Victory! You completed the quest!')
        : isCorrect
        ? 'Correct answer!'
        : 'Wrong answer.';

      const deltaText = res.scoreDelta != null
        ? ` Score delta: ${res.scoreDelta > 0 ? '+' : ''}${res.scoreDelta}`
        : '';

      turn.addLog(`${statusText}${deltaText}`, isWin || isCorrect ? 'win' : 'error');
    } catch (err) {
      if (err.status === 400 && err.message?.toLowerCase().includes('not in progress')) {
        turn.setRunOver();
        return;
      }
      turn.addLog(`Answer failed: ${err.message}`, 'error');
      turn.forceIdle();
    }
  };

  const handleDismissResult = () => {
    setScoreDelta(null);
    turn.dismiss();
    playerQuery.refetch();
  };

  if (!playerName) return null;

  if (playerQuery.isLoading) {
    return (
      <main className="play-page play-page--loading" id="main-content">
        <div className="play-page__spinner">
          <RefreshCw size={36} className="play-page__spin-icon" aria-hidden="true" />
          <p>Loading quest state…</p>
        </div>
      </main>
    );
  }

  if (playerQuery.isError) {
    return (
      <main className="play-page play-page--error" id="main-content">
        <div className="play-page__error-card">
          <AlertCircle size={40} className="play-page__error-icon" aria-hidden="true" />
          <h2>Connection Error</h2>
          <p>{playerQuery.error?.message || 'Failed to connect to game server.'}</p>
          <button className="btn btn--primary" onClick={() => playerQuery.refetch()}>
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  const currentScore = serverState?.score ?? 0;
  const gameStatus = serverState?.status ?? 'active';

  return (
    <main className="play-page" id="main-content">
      <div className="play-page__container">
        {/* Top HUD */}
        <HUD
          score={currentScore}
          currentTile={displayTile}
          status={gameStatus}
          scoreDelta={scoreDelta}
        />

        <div className="play-page__main-layout">
          {/* Board View */}
          <section className="play-page__board-section" aria-label="Game Board">
            <Board
              currentTile={displayTile}
              playerName={playerName}
              revealedTiles={serverState?.revealedTiles ?? []}
              tileCache={tileCache}
            />
          </section>

          {/* Action & Interaction Area */}
          <section className="play-page__action-section" aria-label="Player Actions">
            {turn.phase === 'win' ? (
              <WinScreen
                finalScore={turn.answerResult?.finalScore ?? currentScore}
                message={turn.answerResult?.message || "You have successfully reached tile 30 and completed the Quest Board!"}
              />
            ) : turn.phase === 'runOver' ? (
              <RunOverScreen playerName={playerName} />
            ) : turn.phase === 'question' || Boolean(serverState?.pendingDifficulty) ? (
              <QuestionPanel
                difficulty={turn.moveResult?.effect?.difficulty || serverState?.pendingDifficulty || 'easy'}
                tileNumber={turn.moveResult?.effect?.tileNumber || serverState?.pendingTile || displayTile}
                isSubmitting={answerMutation.isPending}
                onAnswer={handleAnswer}
              />
            ) : turn.phase === 'result' && turn.answerResult ? (
              <ResultCard
                result={turn.answerResult}
                onDismiss={handleDismissResult}
              />
            ) : turn.phase === 'effect' && turn.moveResult?.effect ? (
              <EffectCard
                effect={turn.moveResult.effect}
                onDismiss={() => {
                  setScoreDelta(null);
                  turn.onEffectDone(turn.moveResult);
                  playerQuery.refetch();
                }}
              />
            ) : (
              <div className="play-page__roll-box">
                <div className="play-page__dice-container">
                  <Dice
                    value={diceRollValue}
                    isRolling={turn.phase === 'rolling'}
                  />
                </div>

                <div className="play-page__roll-controls">
                  <button
                    className="btn btn--primary btn--lg btn--full play-page__roll-btn"
                    onClick={handleRoll}
                    disabled={turn.isLocked || moveMutation.isPending || turn.phase !== 'idle'}
                  >
                    <Dices size={22} aria-hidden="true" />
                    {turn.phase === 'rolling'
                      ? 'Rolling…'
                      : turn.phase === 'moving'
                      ? 'Moving…'
                      : 'Roll Dice'}
                  </button>

                  <p className="play-page__roll-hint">
                    Click to roll the d6.
                  </p>
                </div>
              </div>
            )}

            {/* Turn Log */}
            <TurnLog entries={turn.turnLog} />
          </section>
        </div>
      </div>
    </main>
  );
}
