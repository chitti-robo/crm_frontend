'use client';
import { useCRM } from '@/lib/store';

export default function Demos() {
  const { demos, leads, markAtt } = useCRM();
  return (
    <>
      <h1>Demos</h1><p className="sub">Schedule from a lead. Mentors record attendance and feedback here.</p>
      <div className="panel">
        {demos.map((d) => {
          const l = leads.find((x) => x.id === d.lead)!;
          return (
            <div className="row" key={d.id}>
              <div className="g"><b>{l.name}</b> <span className="chip">{d.c}</span><small>{d.at} · {d.mentor}</small></div>
              {d.att === null ? <><button className="btn" onClick={() => markAtt(d.id, true)}>Attended</button><button className="btn" onClick={() => markAtt(d.id, false)}>No-show</button></>
                : <span className={`chip ${d.att ? 'o' : 'w'}`}>{d.att ? 'Attended' : 'No-show'}</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}
