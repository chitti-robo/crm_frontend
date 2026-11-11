'use client';
import { useEffect, useState } from 'react';
import { COURSES, STAGES, type Course, type Lead, type Stage } from '@/lib/data';
import { useCRM } from '@/lib/store';
import { Chips, DueChip } from '@/lib/ui';

type ApiLead = {
  id: number; name: string; phone: string | null; email: string | null; stage: string;
  owner: string | null; source: string; courses: string[];
};

const toLead = (r: ApiLead): Lead => ({
  id: r.id,
  name: r.name,
  phone: r.phone ?? '',
  city: '',
  c: r.courses.filter((x): x is Course => x in COURSES),
  stage: (STAGES as readonly string[]).includes(r.stage) ? (r.stage as Stage) : 'New',
  src: r.source,
  owner: r.owner ?? 'Unassigned',
  due: null,
  email: r.email ?? '',
  acts: [],
});

export default function Leads() {
  const { newOpen, setNewOpen } = useCRM();
  const [real, setReal] = useState<Lead[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState(''); const [fs, setFs] = useState(''); const [fc, setFc] = useState('');
  const [wa, setWa] = useState<Lead | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);

  const load = () =>
    fetch('/api/leads', { cache: 'no-store' })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((rows: ApiLead[]) => { setReal(rows.map(toLead)); setFailed(false); })
      .catch(() => setFailed(true));

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (newOpen) return;
    const t = setTimeout(load, 700);
    return () => clearTimeout(t);
  }, [newOpen]);

  const send = async () => {
    if (!wa) return;
    setBusy(true); setNote(null);
    try {
      const r = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: wa.id, text: msg }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) setNote({ ok: true, text: 'Sent. It should reach the phone within a few seconds.' });
      else setNote({ ok: false, text: typeof d.detail === 'string' ? d.detail : 'Could not send (error ' + r.status + ')' });
    } catch {
      setNote({ ok: false, text: 'Could not reach the server.' });
    }
    setBusy(false);
  };

  const ls = (real ?? []).filter((l) =>
    (!q || (l.name + l.phone + l.city).toLowerCase().includes(q.toLowerCase())) &&
    (!fs || l.stage === fs) && (!fc || l.c.includes(fc as Course)));

  return (
    <>
      <div className="top"><div><h1>Leads</h1><p className="sub">One person, one record. Extra courses are added as interests.</p></div><button className="btn p" onClick={() => setNewOpen(true)}>Add lead</button></div>
      <div className="bar">
        <input aria-label="Search leads" placeholder="Search name, phone or city" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Stage" value={fs} onChange={(e) => setFs(e.target.value)}><option value="">All stages</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Course" value={fc} onChange={(e) => setFc(e.target.value)}><option value="">All courses</option>{(Object.keys(COURSES) as Course[]).map((c) => <option key={c} value={c}>{COURSES[c]}</option>)}</select>
      </div>
      <div className="tw"><table>
        <thead><tr><th>Name</th><th>Courses</th><th>Stage</th><th>Source</th><th>Owner</th><th>Next follow-up</th><th></th></tr></thead>
        <tbody>
          {ls.map((l) => (
            <tr key={l.id}>
              <td><b>{l.name}</b><br /><small style={{ color: 'var(--mute)' }}>{l.phone}</small></td>
              <td><Chips l={l} /></td><td>{l.stage}</td><td>{l.src}</td><td>{l.owner}</td><td><DueChip l={l} />{l.due === null && '—'}</td>
              <td><button className="btn" disabled={!l.phone} onClick={() => { setWa(l); setMsg(''); setNote(null); }}>WhatsApp</button></td>
            </tr>
          ))}
          {failed && <tr><td colSpan={7} className="empty">Could not load leads. Check that the API is running and CRM_API_KEY is set.</td></tr>}
          {!failed && real === null && <tr><td colSpan={7} className="empty">Loading leads…</td></tr>}
          {!failed && real !== null && !ls.length && <tr><td colSpan={7} className="empty">No leads match these filters. Clear a filter to see more.</td></tr>}
        </tbody>
      </table></div>

      {wa && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'grid', placeItems: 'center', zIndex: 50 }} onClick={() => setWa(null)}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 10, width: 'min(440px, 92vw)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>WhatsApp to {wa.name}</h2>
            <p className="sub">{wa.phone}</p>
            <label htmlFor="wa-msg">Message</label>
            <textarea id="wa-msg" rows={4} style={{ width: '100%' }} value={msg} onChange={(e) => setMsg(e.target.value)}
              placeholder="Leave empty to send the student_followup template" />
            <p style={{ fontSize: 13, color: 'var(--mute)' }}>Typed messages are delivered only within 24 hours of the student's last message to you. For a first message, leave this empty to send the follow-up template.</p>
            {note && <p role="status" style={{ fontSize: 14, color: note.ok ? '#0a6b3d' : '#b3261e' }}>{note.text}</p>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button className="btn" onClick={() => setWa(null)}>Close</button>
              <button className="btn p" onClick={send} disabled={busy}>{busy ? 'Sending…' : msg.trim() ? 'Send message' : 'Send template'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}