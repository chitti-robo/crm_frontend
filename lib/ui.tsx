import type { Lead } from './data';
import { COURSES } from './data';

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
export const wa = (l: Lead) =>
  `https://wa.me/91${l.phone}?text=${encodeURIComponent(`Hi ${l.name.split(' ')[0]}, this is L&L AI Solutions about your ${COURSES[l.c[0]]} enquiry.`)}`;
export const Chips = ({ l }: { l: Lead }) => <>{l.c.map((c) => <span key={c} className="chip">{c}</span>)}</>;
export function DueChip({ l }: { l: Lead }) {
  if (l.due === null) return null;
  if (l.due < 0) return <span className="chip w">Overdue</span>;
  if (l.due === 0) return <span className="chip w">Today</span>;
  return <span className="chip m">In {l.due} d</span>;
}
export function Funnel({ items }: { items: [string, number][] }) {
  const m = Math.max(...items.map((i) => i[1]), 1);
  return <>{items.map(([k, n]) => <div className="fb" key={k}><span>{k}</span><i style={{ width: `${(n / m) * 100}%` }} /><b>{n}</b></div>)}</>;
}
