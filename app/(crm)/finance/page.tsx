'use client';
import { useCRM } from '@/lib/store';
import { inr } from '@/lib/ui';

export default function Finance() {
  const { adm, leads, pay } = useCRM();
  const owed = (a: (typeof adm)[number]) => a.inst.filter((i) => !i.p).reduce((x, i) => x + i.a, 0);
  return (
    <>
      <h1>Admissions and fees</h1>
      <p className="sub">Outstanding across all admissions: <b>{inr(adm.reduce((s, a) => s + owed(a), 0))}</b></p>
      {adm.map((a) => {
        const l = leads.find((x) => x.id === a.lead)!;
        return (
          <div className="panel" style={{ marginBottom: 16 }} key={a.id}>
            <div className="top">
              <div><h2>{l.name} <span className="chip">{a.c}</span></h2><small style={{ color: 'var(--mute)' }}>{a.batch} · Fee {inr(a.fee)}{a.disc ? ` · Discount ${inr(a.disc)}` : ''}</small></div>
              <div><b>{inr(owed(a))}</b> <small style={{ color: 'var(--mute)' }}>outstanding</small></div>
            </div>
            {a.inst.map((i, n) => (
              <div className="row" key={n}>
                <div className="g">Instalment {n + 1}<small>Due {i.d}</small></div><b>{inr(i.a)}</b>
                {i.p ? <span className="chip o">Paid · RCP-{a.id}{n + 1}</span> : <button className="btn" onClick={() => pay(a.id, n)}>Record payment</button>}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
