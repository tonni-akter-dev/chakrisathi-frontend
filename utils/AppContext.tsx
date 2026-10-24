// utils/AppContext.tsx
'use client';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import type { AppState } from './types';

interface Ctx {
  state: AppState;
  update: (p: Partial<AppState>) => void;
  toggleSave: (id: string) => void;
  showToast: (m: string) => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    cat: 'all', q: '', view: 'circ', sort: 'dl', user: null, saved: [],
  });

  const update = useCallback(
    (p: Partial<AppState>) => setState((s) => ({ ...s, ...p })),
    []
  );

  const showToast = useCallback((m: string) => {
    toast.success(m);
  }, []);

  const toggleSave = useCallback((id: string) => {
    setState((s) => {
      const has = s.saved.includes(id);
      showToast(has ? 'সরানো হয়েছে' : 'সংরক্ষিত ✓');
      return { ...s, saved: has ? s.saved.filter((x) => x !== id) : [...s.saved, id] };
    });
  }, [showToast]);

  return (
    <AppContext.Provider value={{ state, update, toggleSave, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): Ctx {
  const c = useContext(AppContext);
  if (!c) throw new Error('useApp outside provider');
  return c;
}