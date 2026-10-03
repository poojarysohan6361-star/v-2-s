/**
 * Quest Board — useTurnSequence hook
 *
 * Manages the frontend game state machine:
 * idle → rolling → moving → effect → question → answering → result → idle
 * Also supports: runOver, win
 */
import { useState, useCallback, useRef } from 'react';

/**
 * @typedef {'idle'|'rolling'|'moving'|'effect'|'question'|'answering'|'result'|'runOver'|'win'} GamePhase
 */

/**
 * @typedef {Object} TurnState
 * @property {GamePhase} phase
 * @property {import('../api/types.js').MoveResponse|null} moveResult
 * @property {import('../api/types.js').AnswerResponse|null} answerResult
 * @property {{ text: string, type: string }[]} turnLog
 */

export function useTurnSequence() {
  const [phase, setPhase] = useState(/** @type {GamePhase} */ ('idle'));
  const [moveResult, setMoveResult] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [turnLog, setTurnLog] = useState(/** @type {{ text: string, type: string }[]} */ ([]));
  const lockRef = useRef(false);

  const addLog = useCallback((/** @type {string} */ text, /** @type {string} */ type = 'info') => {
    setTurnLog(prev => {
      const next = [{ text, type, timestamp: Date.now() }, ...prev];
      return next.slice(0, 10); // Keep last 10
    });
  }, []);

  const startRoll = useCallback(() => {
    if (lockRef.current) return false;
    lockRef.current = true;
    setPhase('rolling');
    setMoveResult(null);
    setAnswerResult(null);
    return true;
  }, []);

  const onMoveResult = useCallback((/** @type {import('../api/types.js').MoveResponse} */ result) => {
    setMoveResult(result);
    setPhase('moving');
  }, []);

  const onMoveDone = useCallback(() => {
    setPhase('effect');
  }, []);

  const onEffectDone = useCallback((/** @type {import('../api/types.js').MoveResponse|null} */ result) => {
    const eff = result?.effect || moveResult?.effect;
    if (eff?.type === 'question' || eff?.type === 'final_checkpoint' ||
        result?.promptAnswer) {
      setPhase('question');
    } else {
      setPhase('idle');
      lockRef.current = false;
    }
  }, [moveResult]);

  const startAnswer = useCallback(() => {
    setPhase('answering');
  }, []);

  const onAnswerResult = useCallback((/** @type {import('../api/types.js').AnswerResponse} */ result) => {
    setAnswerResult(result);
    if (result.outcome === 'win') {
      setPhase('win');
    } else {
      setPhase('result');
    }
  }, []);

  const dismiss = useCallback(() => {
    setPhase('idle');
    lockRef.current = false;
    setMoveResult(null);
    setAnswerResult(null);
  }, []);

  const setRunOver = useCallback(() => {
    setPhase('runOver');
    lockRef.current = false;
  }, []);

  const setWin = useCallback(() => {
    setPhase('win');
    lockRef.current = false;
  }, []);

  const forceIdle = useCallback(() => {
    setPhase('idle');
    lockRef.current = false;
  }, []);

  const restoreQuestion = useCallback(() => {
    setPhase('question');
    lockRef.current = true;
  }, []);

  const isLocked = lockRef.current;

  return {
    phase,
    moveResult,
    answerResult,
    turnLog,
    addLog,
    isLocked,
    startRoll,
    onMoveResult,
    onMoveDone,
    onEffectDone,
    startAnswer,
    onAnswerResult,
    dismiss,
    setRunOver,
    setWin,
    forceIdle,
    restoreQuestion,
  };
}
