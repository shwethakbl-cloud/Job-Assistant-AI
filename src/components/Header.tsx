import { Search, Plus, Download, Upload, Briefcase } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddJob: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Header({ searchQuery, setSearchQuery, onAddJob, onExport, onImport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b dark:border-slate-800/60 mb-8 px-6 py-5">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]"><Briefcase size={24} /></div>
          <div>
            <h1 className="text-xl font-bold dark:text-white leading-none">Job Tracker AI</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Enhanced Dashboard</p>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search company, position, or tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white outline-none focus:border-blue-500 dark:focus:border-blue-600 transition-all shadow-sm" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl p-1 border dark:border-slate-800">
             <button onClick={onExport} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all" title="Export Backup"><Download size={20} /></button>
             <label className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer" title="Import Restore"><Upload size={20} /><input type="file" className="hidden" accept=".json" onChange={onImport} /></label>
          </div>
          <ThemeToggle />
          <button onClick={onAddJob} className="ml-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl active:scale-95 flex items-center space-x-2 transition-all shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)]"><Plus size={20} /><span>New Job</span></button>
        </div>
      </div>
    </header>
  );
}
