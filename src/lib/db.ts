import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Job } from '../types';

interface JobTrackerDB extends DBSchema {
  jobs: {
    key: string;
    value: Job;
    indexes: { 'by-status': string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DATABASE_NAME = 'job-tracker-db-enhanced';
const DATABASE_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase<JobTrackerDB>> {
  return openDB<JobTrackerDB>(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('jobs')) {
        const store = db.createObjectStore('jobs', { keyPath: 'id' });
        store.createIndex('by-status', 'status');
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
}

export const dbPromise = initDB();

export async function getAllJobs(): Promise<Job[]> {
  const db = await dbPromise;
  return db.getAll('jobs');
}

export async function saveJob(job: Job): Promise<string> {
  const db = await dbPromise;
  await db.put('jobs', job);
  return job.id;
}

export async function deleteJob(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete('jobs', id);
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await dbPromise;
  return db.get('settings', key);
}

export async function setSetting(key: string, value: any): Promise<void> {
  const db = await dbPromise;
  await db.put('settings', value, key);
}
