'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { COURSES, ME, SEED_ADM, SEED_DEMOS, STAGES, type Act, type Admission, type Course, type Demo, type Lead, type Role, type Stage, type User, USERS } from './data';

type NewLead = { name: string; phone: string; email: string; course: Course; source: string };
type Store = {
  user: User | null; ready: boolean; role: Role; login: (email: string) => boolean; logout: () => void;
  leads: Lead[]; mine: Lead[]; demos: Demo[]; adm: Admission[];
  open: number | null; setOpen: (id: number | null) => void;
  newOpen: boolean; setNewOpen: (b: boolean) => void;
  toast: string | null;
  logAct: (id: number, t: Act['t'], x: string) => void;
  setStage: (id: number, s: Stage) => void;
  scheduleDemo: (id: number) => void;
  markAtt: (id: number, v: boolean) => void;
  pay: (aid: number, n: number) => void;
  addLead: (f: NewLead) => void;
};
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

const Ctx = createContext<Store>(null as unknown as Store);
export const useCRM = () => useContext(Ctx);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const role: Role = user?.role ?? 'admin';
  useEffect(() => {
    try { const s = sessionStorage.getItem('ll-user'); if (s) setUser(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);
  const [leads, setLeads] = useState<Lead[]>([]);
const refresh = useCallback(() => {
  fetch('/api/leads', { cache: 'no-store' })
    .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
    .then((rows: ApiLead[]) => setLeads(rows.map(toLead)))
    .catch(() => {});
}, []);
useEffect(() => { refresh(); }, [refresh]);
  const [demos, setDemos] = useState(SEED_DEMOS);
  const [adm, setAdm] = useState(SEED_ADM);
  const [open, setOpen] = useState<number | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const mine = useMemo(() => (role === 'counsellor' ? leads.filter((l) => l.owner === ME) : leads), [role, leads]);

  const say = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(null), 2600); }, []);
  const patch = (id: number, f: (l: Lead) => Lead) => setLeads((ls) => ls.map((l) => (l.id === id ? f(l) : l)));
  const withAct = (l: Lead, t: Act['t'], x: string): Lead => ({ ...l, acts: [{ t, x: x || '(no note)', w: 'Just now' }, ...l.acts], due: t !== 'note' && l.due !== null ? 2 : l.due });

  const store: Store = {
    user, ready, role, leads, mine, demos, adm, open, setOpen, newOpen, setNewOpen, toast,
    login: (email) => {
      const u = USERS.find((x) => x.email === email.toLowerCase());
      if (!u) return false;
      setUser(u);
      try { sessionStorage.setItem('ll-user', JSON.stringify(u)); } catch {}
      return true;
    },
    logout: () => { setUser(null); setOpen(null); try { sessionStorage.removeItem('ll-user'); } catch {} },
    logAct: (id, t, x) => { patch(id, (l) => withAct(l, t, x)); say(t === 'note' ? 'Note added' : 'Logged. Next follow-up in 2 days'); },
    setStage: (id, s) => { patch(id, (l) => ({ ...withAct(l, 'note', `Stage changed from ${l.stage} to ${s}`), stage: s, due: s === 'Admitted' || s === 'Lost' ? null : l.due })); say('Stage updated'); },
    scheduleDemo: (id) => {
      const l = leads.find((x) => x.id === id)!;
      setDemos((d) => [...d, { id: d.length + 1, lead: id, c: l.c[0], mentor: 'To be assigned', at: 'Date to be set', att: null }]);
      patch(id, (x) => ({ ...withAct(x, 'note', 'Demo scheduled'), stage: 'Demo scheduled' })); say('Demo scheduled');
    },
    markAtt: (id, v) => { setDemos((d) => d.map((x) => (x.id === id ? { ...x, att: v } : x))); say('Attendance saved'); },
    pay: (aid, n) => { setAdm((a) => a.map((x) => (x.id === aid ? { ...x, inst: x.inst.map((i, k) => (k === n ? { ...i, p: true } : i)) } : x))); say('Payment recorded. Receipt created'); },
    addLead: (f) => {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name, phone: f.phone, email: f.email || null, course: f.course, source: f.source }),
      })
        .then((r) => { if (!r.ok) say('Saved here, but not synced to the server'); else setTimeout(refresh, 700); })
        .catch(() => say('Saved here, but not synced to the server'));
      const phone = f.phone.replace(/\D/g, '').slice(-10);
      const ex = leads.find((l) => l.phone === phone);
      if (ex) {
        patch(ex.id, (l) => ({ ...withAct(l, 'note', 'Enquired again for ' + COURSES[f.course]), c: l.c.includes(f.course) ? l.c : [...l.c, f.course] }));
        say(`${ex.name} is already a lead. Added ${COURSES[f.course]} as an interest`);
      } else {
        setLeads((ls) => [{ id: ls.length + 1, name: f.name, phone, city: '', c: [f.course], stage: 'New', src: f.source, owner: role === 'counsellor' ? ME : 'Imran', due: 0, email: f.email, acts: [{ t: 'note', x: 'Lead created manually', w: 'Just now' }] }, ...ls]);
        say('Lead saved and assigned');
      }
    },
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
