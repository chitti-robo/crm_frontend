import Link from 'next/link';
import { COURSES, STAGES } from '@/lib/data';

const channels = ['Meta Lead Ads', 'Google Ads', 'LinkedIn', 'Website forms', 'Google Forms', 'YouTube and Reels', 'Search (SEO)', 'WhatsApp', 'Referrals', 'Campus events'];
const roles: [string, string][] = [
  ['Counsellors', 'See who to call today, log a call in two taps, and book demos.'],
  ['Marketing', 'Compare campaigns by cost per lead and cost per admission.'],
  ['Mentors', 'See upcoming demos and record attendance and feedback.'],
  ['Finance', 'Track instalments, receipts and outstanding balances.'],
];
const blurbs: Record<string, string> = { DS: 'Foundations to production analytics', AIML: 'Models, evaluation and deployment', GENAI: 'LLM apps, agents and retrieval', FDE: 'Ship AI inside customer teams' };

export default function Landing() {
  return (
    <div className="land">
      <header className="lnav">
        <span className="brand" style={{ padding: 0, color: 'var(--ink)' }}>L&amp;L AI Solutions</span>
        <Link href="/login" className="btn p">Sign in</Link>
      </header>

      <section className="hero">
        <div>
          <h1>Every enquiry, from first click to first fee.</h1>
          <p>The L&amp;L Marketing CRM keeps each lead in one place across Data Science, AI &amp; ML, Generative AI and Forward Deployed Engineer courses. Counselling, demos, admissions and payments follow the same record.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/login" className="btn p big">Sign in to the CRM</Link>
            <a href="#how" className="btn big">See how it works</a>
          </div>
        </div>
        <ol className="journey" aria-label="Lead journey">
          {STAGES.filter((s) => s !== 'Lost').map((s) => <li key={s}>{s}</li>)}
        </ol>
      </section>

      <section id="how" className="lsec">
        <h2>Leads arrive from everywhere, and land in one record</h2>
        <p className="sub">Duplicate people are matched by phone and email, so a second enquiry adds a course interest instead of a second lead.</p>
        <div>{channels.map((c) => <span className="chip big" key={c}>{c}</span>)}</div>
      </section>

      <section className="lsec">
        <h2>Four courses, one workflow</h2>
        <div className="cgrid">{(Object.keys(COURSES) as (keyof typeof COURSES)[]).map((c) => <div className="panel" key={c}><span className="chip">{c}</span><h3 style={{ margin: '10px 0 4px', font: '700 17px var(--hd)' }}>{COURSES[c]}</h3><small style={{ color: 'var(--mute)' }}>{blurbs[c]}</small></div>)}</div>
      </section>

      <section className="lsec">
        <h2>Each role sees only what it needs</h2>
        <div className="cgrid">{roles.map(([t, d]) => <div key={t}><h3 style={{ margin: '0 0 4px', font: '700 17px var(--hd)' }}>{t}</h3><p style={{ margin: 0, color: 'var(--mute)' }}>{d}</p></div>)}</div>
      </section>

      <footer className="lfoot">
        <span>© 2026 L&amp;L AI Solutions Pvt Ltd</span>
        <Link href="/login">Sign in</Link>
      </footer>
    </div>
  );
}
