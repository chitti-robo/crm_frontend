import { INTEGRATIONS } from '@/lib/data';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.yourdomain.com';

type Guide = { webhook?: string; env: string[]; steps: string[]; link: string; fallback?: string };
type Live = { source: string; ok: boolean | null; ran_at: string | null; rows: number; error: string | null };
type Rzp = {
  configured: boolean; mode: 'test' | 'live' | null; webhook_secret_set: boolean;
  last_webhook_at: string | null; last_webhook_status: string | null; last_paid_at: string | null;
};
type LeadStat = { last_at: string | null; last_7d: number; total: number };

// Cards whose status comes from the backend (INTEGRATIONS name -> backend source key)
const LIVE_KEY: Record<string, string> = { 'Search Console': 'search_console', GA4: 'ga4' };
const LEADS_KEY: Record<string, string> = { 'Website forms': 'website', 'Google Forms': 'google_forms', WhatsApp: 'whatsapp' };

// Server-side fetch, so no CORS setup is needed. Returns null when the backend can't be reached.
async function loadLive(): Promise<Record<string, Live> | null> {
  try {
    const r = await fetch(`${API}/api/integrations/status`, { cache: 'no-store' });
    if (!r.ok) return null;
    const list: Live[] = await r.json();
    return Object.fromEntries(list.map((l) => [l.source, l]));
  } catch {
    return null;
  }
}

async function loadRzp(): Promise<Rzp | null> {
  try {
    const r = await fetch(`${API}/api/integrations/razorpay/status`, { cache: 'no-store' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

async function loadLeads(): Promise<Record<string, LeadStat> | null> {
  try {
    const r = await fetch(`${API}/api/integrations/leads-status`, { cache: 'no-store' });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}

const when = (s: string | null) =>
  s ? new Date(s).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : '';

// Keyed by the names used in INTEGRATIONS (lib/data.ts)
const GUIDE: Record<string, Guide> = {
  'Meta Lead Ads': {
    webhook: `${API}/webhooks/meta`,
    env: ['META_APP_ID', 'META_APP_SECRET', 'META_VERIFY_TOKEN', 'META_PAGE_TOKEN', 'META_AD_ACCOUNT_ID'],
    link: 'https://developers.facebook.com/apps',
    steps: [
      'Create a Business app and verify your business in Business Manager.',
      'Add the Webhooks product, choose Page, paste the webhook URL and your verify token, then subscribe to leadgen.',
      'Subscribe the Page to the app (POST /{page-id}/subscribed_apps?subscribed_fields=leadgen).',
      'Request leads_retrieval, pages_show_list, pages_read_engagement, pages_manage_metadata and ads_read in App Review.',
      'Generate a long-lived Page token and save it as META_PAGE_TOKEN.',
      'Test with the Lead Ads Testing Tool before going live.',
    ],
  },
  'Google Ads': {
    webhook: `${API}/webhooks/google-ads`,
    env: ['GOOGLE_ADS_WEBHOOK_KEY', 'GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID'],
    link: 'https://ads.google.com/aw/apicenter',
    steps: [
      'In your manager (MCC) account open Tools > API Center and apply for a developer token.',
      'In the lead form asset, set the webhook URL and a key. Save the key as GOOGLE_ADS_WEBHOOK_KEY.',
      'Create an OAuth client in Google Cloud for the nightly cost and click import.',
      'Store the gclid on every lead so admissions can be uploaded as offline conversions.',
    ],
    fallback: 'Until the token is approved, rely on website forms with UTM and gclid.',
  },
  'LinkedIn Lead Gen': {
    env: ['LINKEDIN_CLIENT_ID', 'LINKEDIN_CLIENT_SECRET', 'LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_FORM_COURSE_MAP'],
    link: 'https://developer.linkedin.com/',
    steps: [
      'Create an app linked to your Company Page and have the page admin verify it.',
      'Request access to the Lead Sync API product (Products tab) and submit its access request form.',
      'After approval, authorise with r_marketing_leadgen_automation.',
      'The backend polls the Lead Sync API every few minutes. Map each form ID to a course.',
    ],
    fallback: 'Until approved, download leads as CSV from Campaign Manager and import them with source "LinkedIn".',
  },
  'Google Forms': {
    webhook: `${API}/api/public/google-forms`,
    env: ['PUBLIC_API_KEY'],
    link: 'https://script.google.com/',
    steps: [
      'Open the form > Extensions > Apps Script and paste the onFormSubmit script (apps/api/apps_script.js).',
      'Triggers > Add trigger > From form > On form submit.',
    ],
  },
  'Search Console': {
    env: ['GOOGLE_SERVICE_ACCOUNT_JSON', 'GSC_SITE_URL'],
    link: 'https://search.google.com/search-console',
    steps: [
      'Enable the Search Console API in Google Cloud and create a service account with a JSON key (keep it out of git).',
      'Search Console > Settings > Users and permissions > add the service account email as Restricted.',
      'Set GSC_SITE_URL to the exact property name: https://ll-aisolutions.com/ for a URL-prefix property, or sc-domain:ll-aisolutions.com for a domain property.',
      'Check with: python -m app.integrations.google_reports',
    ],
  },
  GA4: {
    env: ['GOOGLE_SERVICE_ACCOUNT_JSON', 'GA4_PROPERTY_ID'],
    link: 'https://analytics.google.com/',
    steps: [
      'Enable the Analytics Data API in Google Cloud.',
      'Admin > Property access management > add the service account email as Viewer.',
      'Set GA4_PROPERTY_ID to the numeric Property ID (Admin > Property details), not the G- measurement ID.',
    ],
  },
  'WhatsApp': {
  webhook: `${API}/webhooks/whatsapp`,
  env: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_ID', 'WHATSAPP_WABA_ID', 'WHATSAPP_VERIFY_TOKEN'],
  link: 'https://developers.facebook.com/apps',
  steps: [
    'Add the WhatsApp product to your Meta app and verify the number.',
    'Create a System User token and save it as WHATSAPP_TOKEN.',
    'Set the webhook URL and verify token, then subscribe to messages.',
    'Create templates for outbound messages outside the 24-hour window.',
  ],
},
};

export default async function Integrations() {
  const [live, rzp, leads] = await Promise.all([loadLive(), loadRzp(), loadLeads()]);
  return (
    <>
      <h1>Integrations</h1>
      <p className="sub">Where each lead source stands. Approvals can take weeks, so website forms and manual entry carry the load meanwhile.</p>
      <div className="panel">
        {INTEGRATIONS.map((i) => {
          const g = GUIDE[i[0]];
          let status = i[1];
          let tone: 'o' | 'w' = i[2];
          let note = i[3];
          const key = LIVE_KEY[i[0]];
          if (key) {
            const l = live?.[key];
            if (!live) {
              status = 'Backend not reachable'; tone = 'w'; note = 'Check NEXT_PUBLIC_API_URL and that the API is running';
            } else if (!l || l.ok === null) {
              status = 'No import yet'; tone = 'w'; note = 'Runs within the hour after the API starts';
            } else if (l.ok) {
              status = 'Connected'; tone = 'o'; note = `Last import ${when(l.ran_at)}, ${l.rows} rows`;
            } else {
              status = 'Import failed'; tone = 'w'; note = `${when(l.ran_at)}: ${l.error ?? 'unknown error'}`;
            }
          }
          const lk = LEADS_KEY[i[0]];
          if (lk) {
            const s = leads?.[lk];
            if (!leads) {
              status = 'Backend not reachable'; tone = 'w'; note = 'Check NEXT_PUBLIC_API_URL and that the API is running';
            } else if (!s || s.total === 0) {
              status = 'No leads yet'; tone = 'w'; note = 'Waiting for the first lead';
            } else {
              status = 'Connected'; tone = 'o'; note = `Last lead ${when(s.last_at)}, ${s.last_7d} in the last 7 days`;
            }
          }
          if (i[0] === 'Razorpay') {
            if (!rzp) {
              status = 'Backend not reachable'; tone = 'w'; note = 'Check NEXT_PUBLIC_API_URL and that the API is running';
            } else if (!rzp.configured || !rzp.webhook_secret_set) {
              status = 'Keys missing'; tone = 'w';
              note = 'Set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET';
            } else {
              status = rzp.mode === 'live' ? 'Connected (live)' : 'Connected (test mode)'; tone = 'o';
              note = rzp.last_paid_at ? `Last payment ${when(rzp.last_paid_at)}`
                : rzp.last_webhook_at ? `Last webhook ${when(rzp.last_webhook_at)}` : 'No payments yet';
            }
          }
          return (
            <div key={i[0]}>
              <div className="row">
                <div className="g"><b>{i[0]}</b><small>{note}</small></div>
                <span className={`chip ${tone}`}>{status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}