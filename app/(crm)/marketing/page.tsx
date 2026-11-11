import { CAMPAIGNS, SEO } from '@/lib/data';
import { inr } from '@/lib/ui';

export default function Marketing() {
  const [spend, leads, adm] = CAMPAIGNS.reduce((a, c) => [a[0] + c[2], a[1] + c[3], a[2] + c[5]], [0, 0, 0]);
  return (
    <>
      <h1>Marketing</h1><p className="sub" style={{ color: '#b3261e' }}>Sample figures for illustration. Live campaign data appears once Google Ads and LinkedIn are connected.</p>
      <p className="sub">Spend {inr(spend)} · {leads} leads · {adm} admissions · {inr(Math.round(spend / adm))} per admission</p>
      <h2>Campaign return</h2>
      <div className="tw"><table>
        <thead><tr><th>Platform</th><th>Campaign</th><th>Spend</th><th>Leads</th><th>Cost per lead</th><th>Demos</th><th>Admissions</th><th>Cost per admission</th></tr></thead>
        <tbody>{CAMPAIGNS.map((c) => <tr key={c[1]}><td>{c[0]}</td><td>{c[1]}</td><td>{inr(c[2])}</td><td>{c[3]}</td><td>{inr(Math.round(c[2] / c[3]))}</td><td>{c[4]}</td><td>{c[5]}</td><td><b>{inr(Math.round(c[2] / c[5]))}</b></td></tr>)}</tbody>
      </table></div>
      <h2 style={{ marginTop: 26 }}>Search queries sending visitors</h2>
      <div className="tw"><table>
        <thead><tr><th>Query</th><th>Clicks</th><th>Avg. position</th></tr></thead>
        <tbody>{SEO.map((s) => <tr key={s[0]}><td>{s[0]}</td><td>{s[1]}</td><td>{s[2]}</td></tr>)}</tbody>
      </table></div>
    </>
  );
}
