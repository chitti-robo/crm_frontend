'use client';
import { STAGES, type Lead, type Stage } from '@/lib/data';

// Funnel layers, top to bottom. "Lost" is not a layer; it is shown as a note underneath.
const LAYERS = STAGES.filter((s) => s !== 'Lost') as Exclude<Stage, 'Lost'>[];
// Layers before this index are "Leads" (unqualified); the rest are "Opportunities".
const SPLIT = LAYERS.indexOf('Demo scheduled');
const COLORS = ['#6fcf97', '#4cbf80', '#2fae6c', '#1a9a5a', '#128450', '#0a6b3d', '#07532f'];

const W = 760, CX = 380, TOP_W = 400, BOT_W = 70, H = 44, GAP = 4;
const TOTAL_H = LAYERS.length * H + (LAYERS.length - 1) * GAP;
const widthAt = (y: number) => TOP_W - (TOP_W - BOT_W) * (y / TOTAL_H);

export default function SalesFunnel({ leads }: { leads: Lead[] }) {
  const count = (s: Stage) => leads.filter((l) => l.stage === s).length;
  const lost = count('Lost');
  const admitted = count('Admitted');
  const rate = leads.length ? Math.round((admitted / leads.length) * 100) : 0;
  const splitY = SPLIT * (H + GAP) - GAP / 2;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${TOTAL_H + 8}`} width="100%" role="img"
        aria-label={'Sales funnel: ' + LAYERS.map((s) => `${s} ${count(s)}`).join(', ')}>
        {LAYERS.map((s, i) => {
          const y0 = i * (H + GAP), y1 = y0 + H;
          const w0 = widthAt(y0), w1 = widthAt(y1);
          const pts = `${CX - w0 / 2},${y0 + 4} ${CX + w0 / 2},${y0 + 4} ${CX + w1 / 2},${y1 + 4} ${CX - w1 / 2},${y1 + 4}`;
          const rightEdge = CX + (w0 + w1) / 4;
          return (
            <g key={s}>
              <polygon points={pts} fill={COLORS[i]} />
              <text x={CX} y={y0 + H / 2 + 10} textAnchor="middle" fill="#fff" fontSize="20" fontWeight="700">{count(s)}</text>
              <line x1={rightEdge + 8} x2={596} y1={y0 + H / 2 + 4} y2={y0 + H / 2 + 4} stroke="#c9d3df" strokeWidth="1" />
              <text x={604} y={y0 + H / 2 + 9} fontSize="14" fill="#444">{s}</text>
            </g>
          );
        })}

        {/* Dashed divider between Leads and Opportunities */}
        <line x1={20} x2={W - 20} y1={splitY + 4} y2={splitY + 4} stroke="#5fbf8a" strokeWidth="2" strokeDasharray="6 5" />
        <rect x={14} y={splitY - 2} width={12} height={12} fill="#5fbf8a" rx="2" />
        <rect x={W - 26} y={splitY - 2} width={12} height={12} fill="#5fbf8a" rx="2" />

        <text x={20} y={30} fontSize="15" fontWeight="700" fill="#0a3d24">Leads</text>
        <text x={20} y={50} fontSize="13" fill="#555">Unqualified prospects</text>
        <text x={20} y={70} fontSize="13" fill="#555">at the top of the funnel</text>

        <text x={20} y={splitY + 34} fontSize="15" fontWeight="700" fill="#0a3d24">Opportunities</text>
        <text x={20} y={splitY + 54} fontSize="13" fill="#555">Qualified prospects in the</text>
        <text x={20} y={splitY + 74} fontSize="13" fill="#555">middle and bottom</text>
      </svg>
      <p className="sub" style={{ marginTop: 8 }}>
        {rate}% of {leads.length} leads admitted · {lost} lost
      </p>
    </div>
  );
}