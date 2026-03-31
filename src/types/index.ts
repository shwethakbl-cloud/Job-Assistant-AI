export type JobStatus = 'wishlist' | 'applied' | 'follow-up' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  title: string;
  url: string;
  resumeName: string;
  dateApplied: string; // ISO string
  interviewDate?: string; // ISO string
  interviewType?: 'technical' | 'hr' | 'culture' | 'manager' | 'other' | '';
  coverLetter?: string;
  interest: number; // 1-5
  salary: string;
  notes: string;
  status: JobStatus;
  order: number;
}

export const STATUS_COLUMNS: { id: JobStatus; label: string; color: string }[] = [
  { id: 'wishlist', label: 'Wishlist', color: 'border-slate-400' },
  { id: 'applied', label: 'Applied', color: 'border-blue-400' },
  { id: 'follow-up', label: 'Follow-up', color: 'border-amber-400' },
  { id: 'interview', label: 'Interview', color: 'border-indigo-400' },
  { id: 'offer', label: 'Offer', color: 'border-emerald-400' },
  { id: 'rejected', label: 'Rejected', color: 'border-rose-400' },
];

export interface AppState {
  jobs: Job[];
  resumes: string[];
  searchQuery: string;
  theme: 'light' | 'dark';
}
