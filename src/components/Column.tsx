import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Job, JobStatus } from '../types';
import { JobCard } from './JobCard';

interface ColumnProps {
  id: JobStatus;
  label: string;
  jobs: Job[];
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

export function Column({ id, label, jobs, onEditJob, onDeleteJob }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full min-w-[320px] w-full max-w-[420px] bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border-2 border-slate-100/50 dark:border-slate-800/40 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center space-x-3">
          <h2 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">{label}</h2>
          <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[10px] font-black bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full border shadow-sm">{jobs.length}</span>
        </div>
      </div>
      <div ref={setNodeRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar min-h-[300px]">
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
             {jobs.map(job => (
                <JobCard key={job.id} job={job} onEdit={onEditJob} onDelete={onDeleteJob} />
             ))}
          </div>
          {jobs.length === 0 && (
            <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/60 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-transparent">
               <p className="text-[11px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">No entries</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
