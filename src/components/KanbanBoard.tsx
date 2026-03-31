import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Job, JobStatus } from '../types';
import { STATUS_COLUMNS } from '../types';
import { Column } from './Column';
import { JobCard } from './JobCard';

interface KanbanBoardProps {
  jobs: Job[];
  onMoveJob: (id: string, newStatus: JobStatus, newOrder: number) => void;
  onReorderJobs: (status: JobStatus, orderedIds: string[]) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  searchQuery: string;
}

export function KanbanBoard({ jobs, onMoveJob, onReorderJobs, onEditJob, onDeleteJob, searchQuery }: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredJobs = jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.resumeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = jobs.find((j) => j.id === active.id);
    if (job) setActiveJob(job);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    
    const activeJob = jobs.find((j) => j.id === activeId);
    if (!activeJob) return;

    const isOverAColumn = STATUS_COLUMNS.some((c) => c.id === overId);
    const overStatus = isOverAColumn ? (overId as JobStatus) : jobs.find((j) => j.id === overId)?.status;

    if (overStatus && activeJob.status !== overStatus) {
      onMoveJob(activeId, overStatus, 0);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeJob = jobs.find((j) => j.id === activeId);
    if (!activeJob) return;

    const isOverAColumn = STATUS_COLUMNS.some((c) => c.id === overId);
    const overStatus = isOverAColumn ? (overId as JobStatus) : jobs.find((j) => j.id === overId)?.status;
    if (!overStatus) return;

    if (activeJob.status === overStatus) {
        const columnJobs = jobs.filter(j => j.status === overStatus);
        const oldIndex = columnJobs.findIndex(j => j.id === activeId);
        const newIndex = isOverAColumn ? columnJobs.length - 1 : columnJobs.findIndex(j => j.id === overId);
        
        if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
            const reorderedIds = arrayMove(columnJobs.map(j => j.id), oldIndex, newIndex);
            onReorderJobs(overStatus, reorderedIds);
        }
    } else {
        const columnJobs = jobs.filter(j => j.status === overStatus);
        const newIndex = isOverAColumn ? columnJobs.length : columnJobs.findIndex(j => j.id === overId);
        onMoveJob(activeId, overStatus, Math.max(0, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-[calc(100vh-220px)] overflow-x-auto pb-6 custom-scrollbar px-1">
        {STATUS_COLUMNS.map((col) => (
          <Column key={col.id} id={col.id} label={col.label} jobs={filteredJobs.filter((j) => j.status === col.id)} onEditJob={onEditJob} onDeleteJob={onDeleteJob} />
        ))}
      </div>
      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
        {activeJob ? <div className="w-[320px] rotate-2 shadow-2xl"><JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} /></div> : null}
      </DragOverlay>
    </DndContext>
  );
}
