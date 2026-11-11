'use client';
import { COURSES, type Course } from '@/lib/data';
import { useCRM } from '@/lib/store';
import { Chips, DueChip, Funnel, inr, wa } from '@/lib/ui';
import SalesFunnel from '@/components/SalesFunnel';

export default function Home() {
  const { user, role, mine, demos, adm, setOpen, setNewOpen } = useCRM();
  const due = mine.filter((l) => l.due !== null && l.due <= 0).sort((a, b) => a.due! - b.due!);
  const paid = adm.reduce((s, a) => s + a.inst.filter((i) => i.p).reduce((x, i) => x + i.a, 0), 0);
  const srcs = [...new Set(mine.map((l) => l.src))];
  return (
    <>
      <div className="top">
        <div><h1>{role === 'counsellor' ? `Good morning, ${user?.name}` : 'Today at L&L'}</h1><p className="sub">{due.length} follow-ups are waiting. Start with the overdue ones.</p></div>
        <button className="btn p" onClick={() => setNewOpen(true)}>Add lead</button>
      </div>
      <div className="strip">
        <div><b>{mine.filter((l) => l.stage === 'New').length}</b><span>New leads</span></div>
        <div><b>{due.length}</b><span>Follow-ups due</span></div>
        <div><b>{demos.filter((d) => d.att === null).length}</b><span>Demos this week</span></div>
        <div><b>{mine.filter((l) => l.stage === 'Admitted').length}</b><span>Admissions this month</span></div>
        {role === 'counsellor' ? <div><b>{mine.length}</b><span>My leads</span></div> : <div><b>{inr(paid)}</b><span>Collected this month</span></div>}
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h2>Sales funnel</h2>
        <p className="sub">Where every lead stands right now, from first enquiry to admission.</p>
        <SalesFunnel leads={mine} />
      </div>

      <div className="grid">
        <div className="panel">
          <h2>Follow-ups due</h2>
          {due.length ? due.map((l) => (
            <div className="row" key={l.id}>
              <div className="g">
                <a href="#" onClick={(e) => { e.preventDefault(); setOpen(l.id); }} style={{ color: 'inherit', fontWeight: 600 }}>{l.name}</a> <DueChip l={l} />
                <small><Chips l={l} /> {l.stage} · {l.src}</small>
              </div>
              <a className="btn" target="_blank" rel="noopener noreferrer" href={wa(l)}>WhatsApp</a>
              <a className="btn p" href={`tel:+91${l.phone}`}>Call</a>
            </div>
          )) : <div className="empty">Nothing due. Add a lead or check the pipeline.</div>}
        </div>
        <div>
          <div className="panel" style={{ marginBottom: 18 }}><h2>Funnel by course</h2><Funnel items={(Object.keys(COURSES) as Course[]).map((c) => [COURSES[c], mine.filter((l) => l.c[0] === c).length])} /></div>
          <div className="panel"><h2>Leads by source</h2><Funnel items={srcs.map((s) => [s, mine.filter((l) => l.src === s).length])} /></div>
        </div>
      </div>
    </>
  );
}