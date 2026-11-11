export type Course = 'DS' | 'AIML' | 'GENAI' | 'FDE';
export const COURSES: Record<Course, string> = { DS: 'Data Science', AIML: 'AI & ML', GENAI: 'Generative AI', FDE: 'Forward Deployed Eng.' };
export const STAGES = ['New', 'Contacted', 'Interested', 'Demo scheduled', 'Demo attended', 'Negotiation', 'Admitted', 'Lost'] as const;
export type Stage = (typeof STAGES)[number];
export type Role = 'admin' | 'marketing' | 'counsellor' | 'mentor' | 'finance';
export type Act = { t: 'call' | 'whatsapp' | 'note'; x: string; w: string };
export type Lead = { id: number; name: string; phone: string; city: string; c: Course[]; stage: Stage; src: string; owner: string; due: number | null; email: string; acts: Act[] };
export type Demo = { id: number; lead: number; c: Course; mentor: string; at: string; att: boolean | null };
export type Inst = { a: number; d: string; p: boolean };
export type Admission = { id: number; lead: number; c: Course; batch: string; fee: number; disc: number; inst: Inst[] };

export const ME = 'Ritu';
export type User = { email: string; name: string; role: Role; label: string };
export const USERS: User[] = [
  { email: 'admin@llai.in', name: 'Founder', role: 'admin', label: 'Admin' },
  { email: 'marketing@llai.in', name: 'Marketing lead', role: 'marketing', label: 'Marketing' },
  { email: 'ritu@llai.in', name: 'Ritu', role: 'counsellor', label: 'Counsellor' },
  { email: 'mentor@llai.in', name: 'Dr. Mahapatra', role: 'mentor', label: 'Mentor' },
  { email: 'finance@llai.in', name: 'Accounts', role: 'finance', label: 'Finance' },
];
export const NAV: Record<Role, string[]> = {
  admin: ['/dashboard', '/leads', '/pipeline', '/demos', '/finance', '/marketing', '/integrations'],
  marketing: ['/dashboard', '/leads', '/marketing'],
  counsellor: ['/dashboard', '/leads', '/pipeline', '/demos'],
  mentor: ['/demos'],
  finance: ['/finance'],
};
export const NAMES: Record<string, string> = { '/dashboard': 'Home', '/leads': 'Leads', '/pipeline': 'Pipeline', '/demos': 'Demos', '/finance': 'Admissions and fees', '/marketing': 'Marketing', '/integrations': 'Integrations' };

type Row = [number, string, string, string, Course[], Stage, string, string, number | null];
const rows: Row[] = [
  [1, 'Aarav Mohanty', '9437012345', 'Bhubaneswar', ['DS'], 'Demo scheduled', 'Meta Ads', 'Ritu', 0],
  [2, 'Sneha Patra', '9861123456', 'Cuttack', ['AIML', 'GENAI'], 'Interested', 'Google Ads', 'Ritu', 0],
  [3, 'Rohan Das', '7008234567', 'Bhubaneswar', ['FDE'], 'New', 'Website', 'Imran', 0],
  [4, 'Priyanka Nayak', '9348345678', 'Puri', ['GENAI'], 'Contacted', 'LinkedIn', 'Ritu', -1],
  [5, 'Suman Behera', '9124456789', 'Rourkela', ['DS'], 'Negotiation', 'Referral', 'Imran', 1],
  [6, 'Ananya Sahoo', '8249567890', 'Bhubaneswar', ['AIML'], 'Admitted', 'Meta Ads', 'Ritu', null],
  [7, 'Kiran Rout', '9937678901', 'Berhampur', ['FDE'], 'Demo attended', 'Google Forms', 'Imran', 0],
  [8, 'Debashish Jena', '9777789012', 'Bhubaneswar', ['DS', 'AIML'], 'New', 'YouTube', 'Ritu', 0],
  [9, 'Meera Pradhan', '9556890123', 'Sambalpur', ['GENAI'], 'Lost', 'Meta Ads', 'Imran', null],
  [10, 'Tushar Mishra', '8895901234', 'Bhubaneswar', ['FDE'], 'Interested', 'LinkedIn', 'Ritu', 2],
  [11, 'Lopamudra Swain', '7894012345', 'Balasore', ['AIML'], 'Contacted', 'Search (SEO)', 'Imran', 1],
  [12, 'Harsh Panda', '9040123456', 'Bhubaneswar', ['DS'], 'Admitted', 'Referral', 'Ritu', null],
];
export const SEED_LEADS: Lead[] = rows.map((r) => ({ id: r[0], name: r[1], phone: r[2], city: r[3], c: r[4], stage: r[5], src: r[6], owner: r[7], due: r[8], email: '', acts: [{ t: 'note', x: 'Lead created from ' + r[6], w: '3 days ago' }] }));
export const SEED_DEMOS: Demo[] = [
  { id: 1, lead: 1, c: 'DS', mentor: 'Dr. Mahapatra', at: 'Wed 5 Nov, 11:00', att: null },
  { id: 2, lead: 7, c: 'FDE', mentor: 'S. Kar', at: 'Mon 3 Nov, 16:00', att: true },
  { id: 3, lead: 2, c: 'GENAI', mentor: 'A. Dash', at: 'Fri 7 Nov, 15:00', att: null },
  { id: 4, lead: 5, c: 'DS', mentor: 'Dr. Mahapatra', at: 'Sat 1 Nov, 10:30', att: false },
];
export const SEED_ADM: Admission[] = [
  { id: 1, lead: 6, c: 'AIML', batch: 'Nov-26 weekend', fee: 85000, disc: 5000, inst: [{ a: 40000, d: '1 Nov', p: true }, { a: 20000, d: '1 Dec', p: false }, { a: 20000, d: '1 Jan', p: false }] },
  { id: 2, lead: 12, c: 'DS', batch: 'Nov-26 weekday', fee: 75000, disc: 0, inst: [{ a: 25000, d: '20 Oct', p: true }, { a: 25000, d: '20 Nov', p: false }, { a: 25000, d: '20 Dec', p: false }] },
];
export const CAMPAIGNS: [string, string, number, number, number, number][] = [
  ['Meta', 'DS lead ad, Oct', 42000, 61, 14, 4], ['Google Ads', 'AIML search', 36000, 28, 9, 3],
  ['LinkedIn', 'FDE lead gen', 28000, 11, 4, 1], ['YouTube', 'GenAI reels', 6000, 19, 5, 2],
];
export const SEO: [string, number, number][] = [
  ['data science course bhubaneswar', 412, 3.2], ['generative ai course odisha', 188, 4.8],
  ['machine learning training bhubaneswar', 154, 5.4], ['forward deployed engineer course', 96, 7.1],
];
export const INTEGRATIONS: [string, string, 'o' | 'w', string][] = [
  ['Website forms', 'Connected', 'o', '2 min ago'], ['Meta Lead Ads', 'Connected', 'o', 'Token expires in 41 days'],
  ['Google Forms', 'Connected', 'o', '1 h ago'], ['Search Console', 'Connected', 'o', 'Nightly import done'],
  ['GA4', 'Connected', 'o', 'Nightly import done'], ['Google Ads', 'API approved, needs ad account', 'w', 'Add crm-reader to your ad account to start the cost import'],
  ['LinkedIn Lead Gen', 'Waiting for Marketing Developer access', 'w', 'Not started'], ['Razorpay', 'KYC pending', 'w', 'Not started'],
  ['WhatsApp', 'Not connected', 'w', 'Cloud API test number works; webhook pending'],
];
