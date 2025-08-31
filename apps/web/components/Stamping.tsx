"use client";

import React, { useState } from 'react';
import { useOfflineQueue } from '@/lib/useOfflineQueue';

interface TimeEntryPayload {
  project_id: string;
  type: 'stamp' | 'pause';
  start_at: string;
}

export default function Stamping() {
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const { enqueue } = useOfflineQueue();

  const projectId = '11111111-1111-1111-1111-111111111111'; // demo project id; in real app hentes fra context

  const start = async () => {
    const payload: TimeEntryPayload = {
      project_id: projectId,
      type: 'stamp',
      start_at: new Date().toISOString()
    };
    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      // offline; læg i kø
      await enqueue('POST', '/api/time-entries', payload);
    }
    setStatus('running');
  };

  const pause = async () => {
    const payload: TimeEntryPayload = {
      project_id: projectId,
      type: 'pause',
      start_at: new Date().toISOString()
    };
    try {
      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      await enqueue('POST', '/api/time-entries', payload);
    }
    setStatus(status === 'paused' ? 'running' : 'paused');
  };

  const stop = async () => {
    // send afsluttende post med type 'stamp' og slut tidspunkt; i denne simple demo bruger vi pause knap til både pause og stop
    setStatus('idle');
  };

  return (
    <div className="flex flex-col space-y-2">
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={start}
        disabled={status !== 'idle'}
      >
        Start
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        onClick={pause}
        disabled={status === 'idle'}
      >
        {status === 'paused' ? 'Fortsæt' : 'Pause'}
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        onClick={stop}
        disabled={status === 'idle'}
      >
        Stop
      </button>
      <p>Status: {status === 'idle' ? 'Ingen aktiv registrering' : status === 'running' ? 'I gang' : 'På pause'}</p>
    </div>
  );
}