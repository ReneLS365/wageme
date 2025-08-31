"use client";
import React, { useEffect, useRef } from 'react';

export interface ScafixWrapperProps {
  token: string;
}

/**
 * Wrapper komponent der embedder Scafix i et iframe og lytter efter events.
 * Event data sendes videre til vores backend for persistence.
 */
export const ScafixWrapper: React.FC<ScafixWrapperProps> = ({ token }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_SCAFIX_URL) return;
      const { type, payload } = event.data ?? {};
      if (type === 'countSheetCreated') {
        fetch('/api/scafix/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);
  const src = `${process.env.NEXT_PUBLIC_SCAFIX_URL}?token=${encodeURIComponent(token)}`;
  return <iframe ref={iframeRef} src={src} className="w-full h-96 border-0" title="Scafix" />;
};

export default ScafixWrapper;