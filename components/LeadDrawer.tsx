'use client';
import { useEffect, useState } from 'react';
import { STAGES, type Stage } from '@/lib/data';
import { useCRM } from '@/lib/store';
import { Chips, wa } from '@/lib/ui';

export default function LeadDrawer() {
  const { open, setOpen, leads, logAct, setStage, scheduleDemo } = useCRM();
  const [note, setNote] = useState('');
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [setOpen]);
  const l = leads.find((x) => x.id === open);
  if (!l) return null;
  const log = (t: 'call' | 'whatsapp' | 'note') => { logAct(l.id, t, note.trim()); setNote(''); };
  return (
    <div className="drawer" role="dialog" aria-label={`Lead ${l.name}`}>
      <div className="top"><div><h2 style={{ margin: 0 }}>{l.name}</h2><Chips l={l} /></div><button className="btn" onClick={() => setOpen(null)}>Close</button></div>
      <dl className="dl">
        <dt>Phone</dt><dd>+91 {l.phone}</dd><dt>City</dt><dd>{l.city || '—'}</dd>
        <dt>First source</dt><dd>{l.src}</dd><dt>Owner</dt><dd>{l.owner}</dd>
        <dt>Stage</dt>
        <dd><select value={l.stage} onChange={(e) => setStage(l.id, e.target.value as Stage)}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select></dd>
      </dl>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <a className="btn p" target="_blank" rel="noopener noreferrer" href={wa(l)}>Chat on WhatsApp</a>
        <a className="btn" href={`tel:+91${l.phone}`}>Call</a>
        <button className="btn" onClick={() => scheduleDemo(l.id)}>Schedule demo</button>
      </div>
      <label htmlFor="nt">Log what happened</label>
      <textarea id="nt" rows={2} placeholder="Outcome or note" value={note} onChange={(e) => setNote(e.target.value)} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn" onClick={() => log('call')}>Log call</button>
        <button className="btn" onClick={() => log('whatsapp')}>Log WhatsApp</button>
        <button className="btn" onClick={() => log('note')}>Add note</button>
      </div>
      <h2 style={{ marginTop: 22 }}>Activity</h2>
      <div className="tl">{l.acts.map((a, i) => <p key={i}><b>{a.t === 'whatsapp' ? 'WhatsApp' : a.t[0].toUpperCase() + a.t.slice(1)}</b> {a.x}<small>{a.w}</small></p>)}</div>
    </div>
  );
}
