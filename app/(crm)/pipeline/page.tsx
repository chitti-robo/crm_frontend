'use client';
import { STAGES } from '@/lib/data';
import { useCRM } from '@/lib/store';
import { Chips } from '@/lib/ui';

export default function Pipeline() {
  const { mine, setOpen } = useCRM();
  return (
    <>
      <h1>Pipeline</h1><p className="sub">Open a card to move it to another stage.</p>
      <div className="kan">
        {STAGES.map((s) => {
          const ls = mine.filter((l) => l.stage === s);
          return (
            <div className="col" key={s}>
              <h3>{s}<span>{ls.length}</span></h3>
              {ls.map((l) => (
                <div className="card" key={l.id} tabIndex={0} onClick={() => setOpen(l.id)} onKeyDown={(e) => e.key === 'Enter' && setOpen(l.id)}>
                  <b>{l.name}</b><br /><Chips l={l} /><small style={{ color: 'var(--mute)' }}>{l.src}</small>
                </div>
              ))}
              {!ls.length && <small style={{ color: 'var(--mute)' }}>Empty</small>}
            </div>
          );
        })}
      </div>
    </>
  );
}
