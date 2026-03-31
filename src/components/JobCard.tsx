import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, Trash2, Edit2, Calendar, Star, FileText } from 'lucide-react';
import type { Job } from '../types';
import { STATUS_COLUMNS } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  const statusColor = STATUS_COLUMNS.find(c => c.id === job.status)?.color || 'border-slate-200';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white dark:bg-slate-900 border-l-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] p-4 mb-3 transition-all hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-0.5",
        statusColor,
        isDragging && "ring-2 ring-blue-500 shadow-xl"
      )}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-xl" />
      
      <div className="relative pointer-events-auto">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.company}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              {job.title}
            </p>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={() => onEdit(job)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit2 size={13} /></button>
            <button onClick={() => onDelete(job.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={13} /></button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
          {job.resumeName && (
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 dark:text-slate-300 rounded-md uppercase tracking-wider">
              {job.resumeName}
            </span>
          )}
          {job.salary && (
             <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 rounded-md uppercase tracking-wider">
               {job.salary}
             </span>
          )}
          {job.interviewType && (
             <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 rounded-md uppercase tracking-wider">
               {job.interviewType}
             </span>
          )}
        </div>

        {job.interviewDate && (
          <div className="flex items-center space-x-1.5 mb-3 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg w-max">
            <Calendar size={12} />
            <span>{format(new Date(job.interviewDate), 'MMM d, h:mm a')}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 mb-3">
           <div className="flex space-x-0.5">
             {[1, 2, 3, 4, 5].map((val) => (
                <Star key={val} size={10} fill={job.interest >= val ? 'currentColor' : 'none'} className={job.interest >= val ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'} />
             ))}
           </div>
           {job.coverLetter && (
             <div className="text-slate-300 dark:text-slate-700">|</div>
           )}
           {job.coverLetter && (
             <div className="flex items-center space-x-1 text-slate-400 dark:text-slate-500">
                <FileText size={10} />
                <span className="text-[9px] font-medium">Letter added</span>
             </div>
           )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {formatDistanceToNow(new Date(job.dateApplied), { addSuffix: true })}
          </span>
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-500 text-slate-400 hover:text-white rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
