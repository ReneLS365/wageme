import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

/**
 * Hook der henter brugerens rolle fra users_info tabellen og eksponerer en `can` funktion.
 */
export function useRBAC() {
  const [role, setRole] = useState<string>('worker');
  useEffect(() => {
    async function fetchRole() {
      const { data, error } = await supabaseClient
        .from('users_info')
        .select('role')
        .single();
      if (!error && data) {
        setRole(data.role);
      }
    }
    fetchRole();
  }, []);
  function can(action: 'read' | 'create' | 'update' | 'delete'): boolean {
    if (role === 'admin') return true;
    if (role === 'manager') return action !== 'delete';
    if (role === 'worker') return action === 'read' || action === 'create';
    return false;
  }
  return { role, can };
}