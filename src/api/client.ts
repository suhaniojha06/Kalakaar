import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AuthSession, CatalogPost } from '../types/auth';

export class ApiUnreachableError extends Error {
  constructor(message = 'Backend unreachable') {
    super(message);
    this.name = 'ApiUnreachableError';
  }
}

function hostFromExpo(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    (Constants as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost;

  if (!hostUri) return null;
  return hostUri.split(':')[0];
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const expoHost = hostFromExpo();
  if (expoHost) return `http://${expoHost}:8000`;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname || '127.0.0.1';
    return `http://${host}:8000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return 'http://127.0.0.1:8000';
}

function timeoutSignal(ms: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function isNetworkFailure(error: unknown): boolean {
  if (error instanceof ApiUnreachableError) return true;
  if (error instanceof Error) {
    const name = error.name;
    const message = error.message.toLowerCase();
    return (
      name === 'AbortError' ||
      name === 'TypeError' ||
      message.includes('network') ||
      message.includes('failed to fetch') ||
      message.includes('aborted')
    );
  }
  return false;
}

async function request<T>(
  path: string,
  options: RequestInit & { timeoutMs?: number; token?: string | null } = {},
): Promise<T> {
  const { timeoutMs = 4000, token, ...init } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers as Record<string, string> | undefined) },
      signal: timeoutSignal(timeoutMs),
    });
  } catch (error) {
    if (isNetworkFailure(error)) {
      throw new ApiUnreachableError();
    }
    throw error;
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      // keep generic message
    }
    const err = new Error(detail);
    (err as Error & { status?: number }).status = response.status;
    throw err;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    await request<{ ok: boolean }>('/health', { timeoutMs: 2000 });
    return true;
  } catch {
    return false;
  }
}

export function loginRequest(name: string, password: string): Promise<AuthSession> {
  return request<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, password }),
  });
}

export function registerRequest(name: string, password: string): Promise<AuthSession> {
  return request<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, password }),
  });
}

export function fetchPosts(token: string): Promise<CatalogPost[]> {
  return request<CatalogPost[]>('/posts', { token });
}

export function createPostRequest(
  token: string,
  payload: { title: string; content?: string; category?: string; status?: string; image_url?: string; price?: number },
): Promise<CatalogPost> {
  return request<CatalogPost>('/posts', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
