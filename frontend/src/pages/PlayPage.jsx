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

  // Cache revealed tiles from server or move response
  const revealedTiles = useMemo(() => {
    const cached = tileLog.readCache();
    if (serverState?.revealedTiles) {
      serverState.revealedTiles.forEach((t) => {
        if (!cached[t]) {
          tileLog.writeTile(t, { type: 'revealed' });
          cached[t] = { type: 'revealed' };
        }
      });
    }
    return cached;
  }, [serverState, tileLog]);

  // Update display tile when not actively in a roll/move sequence
  useEffect(() => {
    if (serverState && turn.phase === 'idle') {
      if (serverState.runOver) {
        turn.setRunOver();
      } else if (serverState.status === 'finished') {
        turn.setWin();
      } else if (serverState.promptAnswer && turn.phase !== 'question') {
        turn.restoreQuestion();
      }
      setDisplayTile(serverState.currentTile ?? 1);
    }
  }, [serverState, turn]);

  // Handle Roll Dice action
  const handleRoll = async () => {
    if (turn.isLocked || moveMutation.isPending) return;

    if (!turn.startRoll()) return;
    setDiceRollValue(null);

    try {
      const res = await moveMutation.mutateAsync();
      setDiceRollValue(res.diceRoll);
      turn.addLog(`Rolled a ${res.diceRoll}! Moved to tile ${res.newTile}`, 'move');
      turn.onMoveResult(res);

      // Animate player token movement step-by-step
      const start = displayTile;
      const target = res.newTile;
      const step = start < target ? 1 : -1;
      let curr = start;

      const interval = setInterval(() => {
        curr += step;
        setDisplayTile(curr);
        if ((step > 0 && curr >= target) || (step < 0 && curr <= target)) {
          clearInterval(interval);
          setDisplayTile(target);
          turn.onMoveDone();
          if (res.effect?.scoreDelta) {
            setScoreDelta(res.effect.scoreDelta);
          }
        }
      }, 150);
    } catch (err) {
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
      if (res.scoreDelta) setScoreDelta(res.scoreDelta);
      if (res.newTile) setDisplayTile(res.newTile);

      const statusText = res.correct ? 'Correct answer!' : 'Wrong answer.';
      turn.addLog(`${statusText} Score delta: ${res.scoreDelta > 0 ? '+' : ''}${res.scoreDelta}`, res.correct ? 'win' : 'error');
    } catch (err) {
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
              revealedTiles={revealedTiles}
            />
          </section>

          {/* Action & Interaction Area */}
          <section className="play-page__action-section" aria-label="Player Actions">
            {turn.phase === 'win' || gameStatus === 'finished' ? (
              <WinScreen
                finalScore={currentScore}
                message="You have successfully reached tile 30 and completed the Quest Board!"
              />
            ) : turn.phase === 'runOver' || serverState?.runOver ? (
              <RunOverScreen playerName={playerName} />
            ) : turn.phase === 'question' || serverState?.promptAnswer ? (
              <QuestionPanel
                onAnswer={handleAnswer}
                disabled={answerMutation.isPending}
              />
            ) : turn.phase === 'result' && turn.answerResult ? (
              <ResultCard
                result={turn.answerResult}
                onDismiss={handleDismissResult}
              />
            ) : turn.phase === 'effect' && turn.moveResult?.effect ? (
              <EffectCard
                effect={turn.moveResult.effect}
                onDismiss={() => turn.onEffectDone(turn.moveResult)}
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
                    Press Space or click to roll the d6.
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
