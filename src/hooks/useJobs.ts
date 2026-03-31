import { useState, useEffect, useCallback } from 'react';
import type { Job, JobStatus } from '../types';
import * as db from '../lib/db';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const allJobs = await db.getAllJobs();
      setJobs(allJobs.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (jobData: Omit<Job, 'id' | 'order' | 'dateApplied'>) => {
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      dateApplied: new Date().toISOString(),
      order: jobs.filter(j => j.status === jobData.status).length,
    };
    await db.saveJob(newJob);
    setJobs(prev => [...prev, newJob].sort((a, b) => a.order - b.order));
    return newJob;
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const updatedJob = { ...job, ...updates };
    await db.saveJob(updatedJob);
    setJobs(prev => prev.map(j => (j.id === id ? updatedJob : j)));
  };

  const deleteJob = async (id: string) => {
    await db.deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const moveJob = async (id: string, newStatus: JobStatus, newOrder: number) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    const updatedJob = { ...job, status: newStatus, order: newOrder };
    await db.saveJob(updatedJob);
    
    setJobs(prev => {
      const otherJobs = prev.filter(j => j.id !== id);
      const newJobs = [...otherJobs, updatedJob].sort((a, b) => {
        if (a.status !== b.status) return 0;
        return a.order - b.order;
      });
      return newJobs;
    });
  };

  const reorderJobs = async (_status: JobStatus, orderedIds: string[]) => {
    const updatedJobs = [...jobs];
    
    const idToIndex = new Map(orderedIds.map((id, index) => [id, index]));
    
    const promises = updatedJobs.map(async (job) => {
      if (idToIndex.has(job.id)) {
        job.order = idToIndex.get(job.id)!;
        await db.saveJob(job);
      }
    });

    await Promise.all(promises);
    setJobs([...updatedJobs].sort((a, b) => a.order - b.order));
  };

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob,
    moveJob,
    reorderJobs,
  };
}
