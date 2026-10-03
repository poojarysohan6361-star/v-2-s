import { BookOpen, Gem, HelpCircle, Sparkles, Swords, Shield, Crown, Dices, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './RulesPage.css';

export function RulesPage() {
  return (
    <main className="rules-page" id="main-content">
      <div className="rules-page__container">
        <header className="rules-page__header">
          <BookOpen size={36} className="rules-page__header-icon" aria-hidden="true" />
          <div>
            <h1 className="rules-page__title">Adventurer's Tome of Rules</h1>
            <p className="rules-page__subtitle">
              Master the board mechanics, tile encounters, and host trivia challenges
            </p>
          </div>
        </header>

        {/* Section 1: Objective & Core Cycle */}
        <section className="rules-card">
          <h2 className="rules-card__title">
            <Dices size={20} aria-hidden="true" /> Core Gameplay Loop
          </h2>
          <ol className="rules-list">
            <li>
              <strong>Enter your Name:</strong> Begin your run by entering a player name on the home screen. Progress is saved under your name.
            </li>
            <li>
              <strong>Roll the d6:</strong> On your turn, roll a standard 6-sided die to advance along the 30-tile path.
            </li>
            <li>
              <strong>Uncover Fog Tiles:</strong> Tiles are shrouded in fog until stepped on. Uncovering a tile reveals its hidden nature.
            </li>
            <li>
              <strong>Resolve Tile Effects & Host Questions:</strong> Face traps, gain treasure, jump through portals, or answer event host trivia.
            </li>
            <li>
              <strong>Reach Tile 30:</strong> The first players to reach Tile 30 and complete the final trial claim top ranks on the leaderboard!
            </li>
          </ol>
        </section>

        {/* Section 2: Tile Types Reference */}
        <section className="rules-card">
          <h2 className="rules-card__title">
            <Gem size={20} aria-hidden="true" /> Tile Types Reference
          </h2>

          <div className="tile-grid-ref">
            <div className="tile-ref-item">
              <div className="tile-ref-icon tile-ref-icon--treasure">
                <Gem size={24} aria-hidden="true" />
              </div>
              <div className="tile-ref-content">
                <h3>Treasure Tile</h3>
                <p>Grants an instant bonus to your score upon landing (+50 to +100 pts).</p>
              </div>
            </div>

            <div className="tile-ref-item">
              <div className="tile-ref-icon tile-ref-icon--portal">
                <Sparkles size={24} aria-hidden="true" />
              </div>
              <div className="tile-ref-content">
                <h3>Portal Tile</h3>
                <p>Teleports you forward or backward 2 to 4 spaces instantly!</p>
              </div>
            </div>

            <div className="tile-ref-item">
              <div className="tile-ref-icon tile-ref-icon--encounter">
                <Swords size={24} aria-hidden="true" />
              </div>
              <div className="tile-ref-content">
                <h3>Encounter Tile</h3>
                <p>Triggers a host event or question challenge with bonus stakes.</p>
              </div>
            </div>

            <div className="tile-ref-item">
              <div className="tile-ref-icon tile-ref-icon--checkpoint">
                <Shield size={24} aria-hidden="true" />
              </div>
              <div className="tile-ref-content">
                <h3>Checkpoint Tile</h3>
                <p>Saves your progress. Negative movement effects cannot push you back past your last checkpoint!</p>
              </div>
            </div>

            <div className="tile-ref-item">
              <div className="tile-ref-icon tile-ref-icon--question">
                <HelpCircle size={24} aria-hidden="true" />
              </div>
              <div className="tile-ref-content">
                <h3>Question Tile</h3>
                <p>Presents a active host question. Correct answers award points; wrong answers penalize score and position.</p>
              </div>
            </div>

            <div className="tile-ref-item">
              <div className="tile-ref-icon tile-ref-icon--final">
                <Crown size={24} aria-hidden="true" />
              </div>
              <div className="tile-ref-content">
                <h3>Tile 30 — Final Trial</h3>
                <p>The ultimate goal. Answer the final trial question correctly to finish your run and secure your leaderboard score.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Question & Scoring System */}
        <section className="rules-card">
          <h2 className="rules-card__title">
            <HelpCircle size={20} aria-hidden="true" /> Question Scoring & Penalties
          </h2>
          <p>
            Questions presented by the host vary in difficulty. Scoring and movement penalties depend on difficulty tier:
          </p>

          <table className="rules-table">
            <thead>
              <tr>
                <th>Difficulty</th>
                <th>Correct Reward</th>
                <th>Wrong Penalty</th>
                <th>Movement Penalty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="diff-tag diff-tag--easy">Easy</span></td>
                <td>+50 pts</td>
                <td>-25 pts</td>
                <td>None</td>
              </tr>
              <tr>
                <td><span className="diff-tag diff-tag--medium">Medium</span></td>
                <td>+100 pts</td>
                <td>-50 pts</td>
                <td>Back 1 tile</td>
              </tr>
              <tr>
                <td><span className="diff-tag diff-tag--hard">Hard</span></td>
                <td>+200 pts</td>
                <td>-100 pts</td>
                <td>Back 2 tiles</td>
              </tr>
              <tr>
                <td><span className="diff-tag diff-tag--final">Final Trial</span></td>
                <td>+500 pts (Win)</td>
                <td>-150 pts</td>
                <td>Back to Checkpoint</td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="rules-page__footer">
          <Link to="/play" className="btn btn--primary btn--lg">
            Return to Quest <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
