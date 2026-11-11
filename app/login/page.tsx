'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, USERS } from '@/lib/data';
import { useCRM } from '@/lib/store';

export default function Login() {
  const { user, ready, login } = useCRM();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => { if (ready && user) router.replace(NAV[user.role][0]); }, [ready, user, router]);

  return (
    <div className="auth">
      <div className="authside">
        <Link href="/" className="brand" style={{ padding: 0 }}>L&amp;L CRM<small>AI Solutions</small></Link>
        <p>Every enquiry, from first click to first fee.</p>
      </div>
      <div className="authmain">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!pw) return setErr('Enter your password.');
          if (!login(email.trim())) setErr('No account uses this email. Pick a demo account below.');
        }} noValidate>
          <h1>Sign in</h1>
          <p className="sub">Use your L&amp;L work email.</p>
          <label htmlFor="em">Email</label>
          <input id="em" type="email" autoComplete="username" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} />
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(''); }} />
          {err && <p role="alert" className="err">{err}</p>}
          <button className="btn p big" style={{ width: '100%', marginTop: 18 }} type="submit">Sign in</button>
          <div className="demo">
            <b>Demo accounts</b>
            <small>The password can be anything until the backend is connected.</small>
            <div>{USERS.map((u) => <button type="button" className="btn" key={u.email} onClick={() => { setEmail(u.email); setPw('demo'); setErr(''); }}>{u.label}</button>)}</div>
          </div>
          <Link href="/" className="back">Back to home</Link>
        </form>
      </div>
    </div>
  );
}
