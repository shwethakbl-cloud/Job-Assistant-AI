import { useState, useEffect } from 'react';
import { X, Save, Star } from 'lucide-react';
import type { Job, JobStatus } from '../types';
import { STATUS_COLUMNS } from '../types';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: Omit<Job, 'id' | 'order' | 'dateApplied'>) => void;
  initialData?: Job;
  resumes: string[];
}

export function JobForm({ isOpen, onClose, onSubmit, initialData, resumes }: JobFormProps) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    url: '',
    resumeName: '',
    salary: '',
    notes: '',
    status: 'wishlist' as JobStatus,
    interviewDate: '',
    interviewType: '' as any,
    coverLetter: '',
    interest: 3,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        title: initialData.title,
        url: initialData.url,
        resumeName: initialData.resumeName,
        salary: initialData.salary,
        notes: initialData.notes,
        status: initialData.status,
        interviewDate: initialData.interviewDate || '',
        interviewType: initialData.interviewType || '',
        coverLetter: initialData.coverLetter || '',
        interest: initialData.interest || 3,
      });
    } else {
      setFormData({
        company: '',
        title: '',
        url: '',
        resumeName: resumes[0] || '',
        salary: '',
        notes: '',
        status: 'wishlist',
        interviewDate: '',
        interviewType: '',
        coverLetter: '',
        interest: 3,
      });
    }
  }, [initialData, resumes]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'interest' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <h2 className="text-xl font-bold dark:text-white">{initialData ? 'Edit Job' : 'Add New Job'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Company *</label>
                  <input required name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Google" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Job Title *</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. SDE" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Job URL</label>
                <input type="url" name="url" value={formData.url} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="https://..." />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Application Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Resume Used</label>
                  <input name="resumeName" value={formData.resumeName} onChange={handleChange} list="res-sug" className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  <datalist id="res-sug">{resumes.map(r => <option key={r} value={r} />)}</datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Salary Range</label>
                  <input name="salary" value={formData.salary} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. $150K" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Cover Letter (URL or Notes)</label>
                <input name="coverLetter" value={formData.coverLetter} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Link to doc or brief text..." />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 dark:text-slate-200">Interest Level</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, interest: val }))}
                      className={`p-1 transition-transform active:scale-90 ${formData.interest >= val ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                    >
                      <Star size={24} fill={formData.interest >= val ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-400">{formData.interest}/5</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Status & Interview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                    {STATUS_COLUMNS.map(col => <option key={col.id} value={col.id}>{col.label}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Interview Date</label>
                   <input type="datetime-local" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5 dark:text-slate-200">Interview Type</label>
                <select name="interviewType" value={formData.interviewType} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                  <option value="">None / Not Set</option>
                  <option value="technical">Technical</option>
                  <option value="hr">HR</option>
                  <option value="culture">Culture</option>
                  <option value="manager">Manager</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Additional Notes</h3>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Recruiter info, referrals, etc..." />
            </section>
          </div>
          <div className="mt-8 flex justify-end space-x-3 pb-2">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl font-semibold border dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl font-semibold bg-blue-600 text-white flex items-center space-x-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95"><Save size={18} /><span>Save Job</span></button>
          </div>
        </form>
      </div>
    </div>
  );
}
