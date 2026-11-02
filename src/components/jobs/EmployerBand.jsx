import { ArrowRightIcon, ArrowUpRightIcon } from './icons';

export const REGISTER_URL = 'https://app.forkhr.com/register?use=workplace&plan=essential';
export const POST_JOB_URL = 'https://app.forkhr.com/hiring?new-job-listing=true';
export const HOW_TO_POST_URL = 'https://medium.com/@bohdankhv/how-to-post-a-job-on-fork-in-under-2-minutes-bf957c35d46d';

const STEPS = [
  {
    title: 'Write the listing',
    text: 'Pay, hours, location and your own screening questions. Six role templates to start from.',
  },
  {
    title: 'Publish to your board',
    text: 'Your openings live at jobs.forkhr.com/your-company and here, with a QR code for the window.',
  },
  {
    title: 'Interview and hire',
    text: 'Applications, resumes, interview notes and the hire itself, from the web or your phone.',
  },
];

/** The dark band for employers at the end of the home and list pages. */
export default function EmployerBand() {
  return (
    <section className="jb-emp jb-section" id="for-employers">
      <div className="jb-dots jb-dots--dark" aria-hidden="true" />
      <div className="jb-wrap">
        <div className="jb-emp__grid">
          <div>
            <span className="jb-eyebrow">For employers</span>
            <h2 className="jb-emp__title">Put your openings where people can find them</h2>
            <p className="jb-emp__lede">
              Fork gives your business its own job board and the hiring tools behind it. Every listing you publish is
              searchable here, with the applications going to the person doing the hiring.
            </p>
            <div className="jb-emp__actions">
              <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--white jb-btn--lg">
                Create your job board
                <ArrowRightIcon size={16} />
              </a>
              <a href={HOW_TO_POST_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--dark-outline jb-btn--lg">
                How to post a job in 2 minutes
                <ArrowUpRightIcon size={15} />
              </a>
            </div>
            <p className="jb-emp__note">Hiring is part of Fork’s Essential plan, $39 per location · 30-day money-back guarantee</p>
          </div>
          <ol className="jb-emp__steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="jb-emp__num">{String(i + 1).padStart(2, '0')}</div>
                <div className="jb-emp__step-title">{s.title}</div>
                <p className="jb-emp__step-text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** The small employer card at the foot of the list pages. */
export function EmployerNote() {
  return (
    <aside className="jb-card jb-note">
      <div>
        <div className="jb-note__title">Hiring for your business?</div>
        <p className="jb-note__text">
          Post your openings on a Fork job board and they show up here, with the applications going straight to you.
        </p>
      </div>
      <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer" className="jb-btn jb-btn--ink">
        Create your job board
        <ArrowRightIcon size={16} />
      </a>
    </aside>
  );
}
