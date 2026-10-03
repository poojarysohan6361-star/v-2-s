/**
 * Quest Board — Question Source
 *
 * The backend does NOT provide question text.
 * Questions are presented by the event host in-person.
 *
 * This module provides a placeholder that the QuestionPanel
 * can use. If the backend ever adds question text in the future,
 * this module would be the integration point.
 */

/**
 * @param {{ difficulty: string, tileNumber: number }} _params
 * @returns {{ text: string|null, options: string[]|null }}
 */
export function getQuestion(_params) {
  return {
    text: null,
    options: null,
  };
}

/** Host message displayed when no question text is available */
export const HOST_MESSAGE = 'Your question is presented by the event host.';
