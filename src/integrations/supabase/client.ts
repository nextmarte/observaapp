// ============================================================
// ObservaApp — Mock Supabase Client
//
// This file replaces the real Supabase client with a local
// mock that returns static data from src/lib/mockData/data.ts.
//
// To connect a real Supabase backend:
// 1. Copy .env.example → .env.local and fill in your credentials
// 2. Replace this file content with:
//
//    import { createClient } from '@supabase/supabase-js';
//    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
//    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
//    export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
//      auth: { storage: localStorage, persistSession: true, autoRefreshToken: true }
//    });
// ============================================================

import {
  mockPerfis,
  mockPosts,
  mockColetas,
  mockMencoes,
  mockMencoesInsmed,
  mockCommentariosResumo,
  mockTopComentaristas,
  mockRenovacao,
  mockScoreSemanal,
  mockEngajamentoPorTipo,
  mockInteligencia,
  mockAlertas,
  mockAlertasConfig,
  mockRelatorios,
  mockUsuarios,
} from '@/lib/mockData/data';

// --------------- mock session / user ---------------
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'admin@observaapp.com',
  role: 'authenticated',
  aud: 'authenticated',
  created_at: '2025-01-01T00:00:00.000Z',
} as any;

const MOCK_SESSION = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: MOCK_USER,
} as any;

let _currentSession: typeof MOCK_SESSION | null = MOCK_SESSION;
const _authListeners: Array<(event: string, session: any) => void> = [];

// --------------- table registry ---------------
const TABLE_MAP: Record<string, any[]> = {
  fpobserva_perfis: mockPerfis,
  fpobserva_posts: mockPosts,
  fpobserva_coletas: mockColetas,
  fpobserva_vw_mencoes_reitoria: mockMencoes,
  fpobserva_vw_mencoes_ebserh: mockMencoesInsmed,
  fpobserva_vw_comentaristas_resumo: [mockCommentariosResumo],
  fpobserva_vw_top_comentaristas: mockTopComentaristas,
  fpobserva_vw_renovacao_comentaristas: mockRenovacao,
  fpobserva_vw_score_semanal: mockScoreSemanal,
  fpobserva_vw_engajamento_por_tipo: mockEngajamentoPorTipo,
  fpobserva_vw_inteligencia_campanha: mockInteligencia,
  fpobserva_alertas: mockAlertas,
  fpobserva_alertas_config: mockAlertasConfig,
  fpobserva_relatorios: mockRelatorios,
  fpobserva_usuarios: mockUsuarios,
};

// --------------- query builder ---------------
type FilterFn = (row: any) => boolean;

class QueryBuilder {
  private _data: any[];
  private _filters: FilterFn[] = [];
  private _order: { column: string; ascending: boolean } | null = null;
  private _limitVal: number | null = null;
  private _insertData: any[] | null = null;
  private _updateData: any | null = null;
  private _isDelete = false;
  private _countMode = false;

  constructor(data: any[]) {
    this._data = [...data];
  }

  select(_columns?: string, options?: { count?: string; head?: boolean }) {
    if (options?.count) this._countMode = true;
    return this;
  }

  insert(rows: any | any[]) {
    this._insertData = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(values: any) {
    this._updateData = values;
    return this;
  }

  delete() {
    this._isDelete = true;
    return this;
  }

  eq(column: string, value: any) {
    this._filters.push((row) => row[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this._filters.push((row) => row[column] !== value);
    return this;
  }

  gte(column: string, value: any) {
    this._filters.push((row) => row[column] >= value);
    return this;
  }

  lte(column: string, value: any) {
    this._filters.push((row) => row[column] <= value);
    return this;
  }

  gt(column: string, value: any) {
    this._filters.push((row) => row[column] > value);
    return this;
  }

  lt(column: string, value: any) {
    this._filters.push((row) => row[column] < value);
    return this;
  }

  in(column: string, values: any[]) {
    this._filters.push((row) => values.includes(row[column]));
    return this;
  }

  not(column: string, operator: string, value: any) {
    if (operator === 'is') {
      this._filters.push((row) => row[column] !== value);
    }
    return this;
  }

  or(_filter: string) {
    // In mock mode, .or() is a no-op — all data is returned without filtering
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this._order = { column, ascending: options?.ascending ?? true };
    return this;
  }

  limit(n: number) {
    this._limitVal = n;
    return this;
  }

  private _execute(): any[] {
    if (this._insertData) return this._insertData;
    if (this._updateData) return [];
    if (this._isDelete) return [];

    let result = this._data.filter((row) => this._filters.every((f) => f(row)));

    if (this._order) {
      const { column, ascending } = this._order;
      result = result.sort((a, b) => {
        const va = a[column] ?? '';
        const vb = b[column] ?? '';
        if (va < vb) return ascending ? -1 : 1;
        if (va > vb) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (this._limitVal !== null) {
      result = result.slice(0, this._limitVal);
    }

    return result;
  }

  // Make the builder thenable (await builder)
  then(
    resolve: (value: { data: any[] | null; error: null; count?: number }) => any,
    reject?: (reason: any) => any
  ) {
    try {
      const data = this._execute();
      const count = this._countMode ? data.length : undefined;
      return Promise.resolve({ data, error: null, count }).then(resolve, reject);
    } catch (err) {
      return Promise.reject(err).then(resolve, reject);
    }
  }

  async maybeSingle(): Promise<{ data: any | null; error: null }> {
    const results = this._execute();
    return { data: results[0] ?? null, error: null };
  }

  async single(): Promise<{ data: any | null; error: any }> {
    const results = this._execute();
    if (results.length === 0) return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
    return { data: results[0], error: null };
  }
}

// --------------- mock auth ---------------
const mockAuth = {
  onAuthStateChange(callback: (event: string, session: any) => void) {
    _authListeners.push(callback);
    // Immediately notify with the current session
    setTimeout(() => callback('SIGNED_IN', _currentSession), 0);
    return {
      data: {
        subscription: {
          unsubscribe() {
            const idx = _authListeners.indexOf(callback);
            if (idx > -1) _authListeners.splice(idx, 1);
          },
        },
      },
    };
  },

  async getSession(): Promise<{ data: { session: any } }> {
    return { data: { session: _currentSession } };
  },

  async signInWithPassword(_credentials: { email: string; password: string }): Promise<{ error: null }> {
    _currentSession = MOCK_SESSION;
    _authListeners.forEach((cb) => cb('SIGNED_IN', _currentSession));
    return { error: null };
  },

  async signOut(): Promise<void> {
    _currentSession = null;
    _authListeners.forEach((cb) => cb('SIGNED_OUT', null));
  },
};

// --------------- main mock client ---------------
export const supabase = {
  from(table: string): QueryBuilder {
    const data = TABLE_MAP[table] ?? [];
    return new QueryBuilder(data);
  },
  auth: mockAuth,
};
