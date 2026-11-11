'use client';
import { useEffect, useRef } from 'react';
import { COURSES, type Course } from '@/lib/data';
import { useCRM } from '@/lib/store';

const PLATFORMS = ['Website', 'Meta Ads', 'Google Forms', 'Google Ads', 'LinkedIn', 'WhatsApp', 'YouTube', 'Search (SEO)', 'Referral', 'Walk-in', 'Phone call', 'Campus event'];

export default function NewLeadDialog() {
  const { newOpen, setNewOpen, addLead } = useCRM();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (newOpen && !d.open) d.showModal();
    if (!newOpen && d.open) d.close();
  }, [newOpen]);
  return (
    <dialog ref={ref} onClose={() => setNewOpen(false)}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const f = new FormData(form);
        addLead({ name: String(f.get('name')), phone: String(f.get('phone')), email: String(f.get('email') ?? ''), course: f.get('course') as Course, source: String(f.get('source')) });
        form.reset(); setNewOpen(false);
      }}>
        <h2>Add a lead</h2>
        <label htmlFor="n1">Full name</label><input id="n1" name="name" required />
        <label htmlFor="n2">Phone</label><input id="n2" name="phone" required inputMode="tel" placeholder="98610 12345" />
        <label htmlFor="n3">Email</label><input id="n3" name="email" type="email" />
        <label htmlFor="n4">Course</label>
        <select id="n4" name="course">{(Object.keys(COURSES) as Course[]).map((c) => <option key={c} value={c}>{COURSES[c]}</option>)}</select>
        <label htmlFor="n5">Platform</label>
        <select id="n5" name="source">{PLATFORMS.map((s) => <option key={s}>{s}</option>)}</select>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
          <button className="btn" type="button" onClick={() => setNewOpen(false)}>Cancel</button>
          <button className="btn p" type="submit">Save lead</button>
        </div>
      </form>
    </dialog>
  );
}
