import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { AuthProfile, DEFAULT_PROFILE } from '../types/auth';
import {
  ApiUnreachableError,
  checkBackendHealth,
  loginRequest,
  registerRequest,
} from '../api/client';

type AuthGate = 'checking' | 'form' | 'app';

interface AuthContextType {
  gate: AuthGate;
  profile: AuthProfile | null;
  token: string | null;
  offline: boolean;
  backendAvailable: boolean;
  busy: boolean;
  error: string | null;
  signIn: (name: string, password: string) => Promise<void>;
  createAccount: (name: string, password: string) => Promise<void>;
  continueOffline: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gate, setGate] = useState<AuthGate>('checking');
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoFallbackUsed = useRef(false);

  const enterDefaultProfile = useCallback((fromUnreachableBackend: boolean) => {
    setProfile(DEFAULT_PROFILE);
    setToken(null);
    setOffline(fromUnreachableBackend);
    setError(null);
    setGate('app');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      const up = await checkBackendHealth();
      if (cancelled) return;
      setBackendAvailable(up);
      if (up) {
        setGate('form');
        return;
      }
      if (!autoFallbackUsed.current) {
        autoFallbackUsed.current = true;
        enterDefaultProfile(true);
      } else {
        setGate('form');
      }
    };

    probe();
    return () => {
      cancelled = true;
    };
  }, [enterDefaultProfile]);

  const applySession = (session: { token: string; profile: AuthProfile }) => {
    setToken(session.token);
    setProfile(session.profile);
    setOffline(false);
    setBackendAvailable(true);
    setError(null);
    setGate('app');
  };

  const signIn = async (name: string, password: string) => {
    setBusy(true);
    setError(null);
    try {
      const session = await loginRequest(name.trim(), password);
      applySession(session);
    } catch (err) {
      if (err instanceof ApiUnreachableError) {
        setBackendAvailable(false);
        enterDefaultProfile(true);
      } else {
        setError(err instanceof Error ? err.message : 'Could not sign in');
      }
    } finally {
      setBusy(false);
    }
  };

  const createAccount = async (name: string, password: string) => {
    setBusy(true);
    setError(null);
    try {
      const session = await registerRequest(name.trim(), password);
      applySession(session);
    } catch (err) {
      if (err instanceof ApiUnreachableError) {
        setBackendAvailable(false);
        enterDefaultProfile(true);
      } else {
        setError(err instanceof Error ? err.message : 'Could not create account');
      }
    } finally {
      setBusy(false);
    }
  };

  const continueOffline = () => {
    enterDefaultProfile(true);
  };

  const signOut = () => {
    setProfile(null);
    setToken(null);
    setOffline(false);
    setError(null);
    setGate('form');
  };

  const value = useMemo(
    () => ({
      gate,
      profile,
      token,
      offline,
      backendAvailable,
      busy,
      error,
      signIn,
      createAccount,
      continueOffline,
      signOut,
    }),
    [gate, profile, token, offline, backendAvailable, busy, error, enterDefaultProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
