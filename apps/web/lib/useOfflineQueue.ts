"use client";
import { useEffect } from 'react';
import Dexie, { Table } from 'dexie';
import { encryptData, decryptData } from '@/lib/encryption';

interface QueueItem {
  id?: number;
  method: string;
  url: string;
  iv: string;
  payload: string;
  createdAt: number;
}

class OfflineDB extends Dexie {
  queue!: Table<QueueItem, number>;
  constructor() {
    super('offlineQueue');
    this.version(1).stores({
      queue: '++id, createdAt'
    });
  }
}

const db = new OfflineDB();

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(str: string): ArrayBuffer {
  const binary = atob(str);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function useOfflineQueue() {
  const enqueue = async (method: string, url: string, body: any) => {
    const secret = localStorage.getItem('queueSecret') || 'default-secret';
    const { iv, ciphertext } = await encryptData(secret, body);
    await db.queue.add({
      method,
      url,
      iv: toBase64(iv.buffer),
      payload: toBase64(ciphertext),
      createdAt: Date.now()
    });
  };

  const processQueue = async () => {
    const secret = localStorage.getItem('queueSecret') || 'default-secret';
    const items = await db.queue.orderBy('createdAt').toArray();
    for (const item of items) {
      const ivBuf = fromBase64(item.iv);
      const cipherBuf = fromBase64(item.payload);
      const iv = new Uint8Array(ivBuf);
      const body = await decryptData(secret, iv, cipherBuf);
      try {
        await fetch(item.url, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        await db.queue.delete(item.id!);
      } catch (e) {
        // stop if offline
        break;
      }
    }
  };

  useEffect(() => {
    function handleOnline() {
      processQueue();
    }
    window.addEventListener('online', handleOnline);
    if (navigator.onLine) {
      processQueue();
    }
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return { enqueue, processQueue };
}