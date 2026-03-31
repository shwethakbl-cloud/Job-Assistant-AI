import { useState } from 'react';
import { useJobs } from './hooks/useJobs';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { JobForm } from './components/JobForm';
import type { Job } from './types';

function App() {
  const { jobs, addJob, updateJob, deleteJob, moveJob, reorderJobs, loading } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);

  const handleAddJob = (jobData: any) => {
    if (editingJob) updateJob(editingJob.id, jobData);
    else addJob(jobData);
    setEditingJob(undefined);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `job-tracker-ai-enhanced-backup.json`);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedJobs = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedJobs)) {
          for (const job of importedJobs) {
             if (job.company && job.title) {
                // Ensure interest is a number
                job.interest = job.interest || 3;
                addJob(job);
             }
          }
          alert('Import successful!');
        }
      } catch (err) { alert('Failed to import data.'); }
    };
    reader.readAsText(file);
  };

  const resumes = Array.from(new Set(jobs.map(j => j.resumeName).filter(Boolean)));

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-slate-950 transition-colors pb-12 overflow-x-hidden">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAddJob={() => { setEditingJob(undefined); setIsFormOpen(true); }} onExport={handleExport} onImport={handleImport} />
      <main className="max-w-[1600px] mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
             <p className="text-sm font-medium text-slate-400">Loading your board...</p>
          </div>
        ) : (
          <KanbanBoard jobs={jobs} onMoveJob={moveJob} onReorderJobs={reorderJobs} onEditJob={(job) => { setEditingJob(job); setIsFormOpen(true); }} onDeleteJob={(id) => window.confirm('Are you sure you want to delete this job entry?') && deleteJob(id)} searchQuery={searchQuery} />
        )}
      </main>
      <JobForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingJob(undefined); }} onSubmit={handleAddJob} initialData={editingJob} resumes={resumes} />
      <footer className="mt-12 text-center">
         <p className="text-xs font-semibold text-slate-400/60 uppercase tracking-[0.2em]">Built for Professionals • React 19 • Tailwind v4 • IndexedDB</p>
      </footer>
    </div>
  );
}

export default App;
