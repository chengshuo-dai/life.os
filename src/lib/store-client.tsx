'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  UserCredits,
  Narrative,
  NarrativeNode,
  ChoiceResponse,
  PathSyncItem,
} from '@/models/types';

// ─── State Shape ───────────────────────────────────────
export interface LifeOSState {
  // Auth
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  // User
  profile: UserProfile | null;
  credits: UserCredits | null;

  // Narratives
  narratives: Narrative[] | null;
  activeNarrative: Narrative | null;
  currentNode: NarrativeNode | null;
  pathSync: PathSyncItem[];

  // UI State
  terminalOpen: boolean;
  glitchActive: boolean;
  currentPage: string;
  isLoading: boolean;
}

const initialState: LifeOSState = {
  token: null,
  isAuthenticated: false,
  isInitializing: true,
  profile: null,
  credits: null,
  narratives: null,
  activeNarrative: null,
  currentNode: null,
  pathSync: [],
  terminalOpen: false,
  glitchActive: false,
  currentPage: '/',
  isLoading: false,
};

// ─── Actions ───────────────────────────────────────────
type Action =
  | { type: 'SET_TOKEN'; token: string }
  | { type: 'SET_AUTH'; isAuthenticated: boolean }
  | { type: 'SET_INITIALIZING'; isInitializing: boolean }
  | { type: 'SET_PROFILE'; profile: UserProfile }
  | { type: 'SET_CREDITS'; credits: UserCredits }
  | { type: 'SET_NARRATIVES'; narratives: Narrative[] }
  | { type: 'SET_ACTIVE_NARRATIVE'; narrative: Narrative | null }
  | { type: 'SET_CURRENT_NODE'; node: NarrativeNode | null }
  | { type: 'SET_PATH_SYNC'; pathSync: PathSyncItem[] }
  | { type: 'APPLY_CHOICE'; response: ChoiceResponse }
  | { type: 'TOGGLE_TERMINAL' }
  | { type: 'SET_GLITCH'; active: boolean }
  | { type: 'SET_PAGE'; page: string }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'LOGOUT' };

function reducer(state: LifeOSState, action: Action): LifeOSState {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.token };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.isAuthenticated };
    case 'SET_INITIALIZING':
      return { ...state, isInitializing: action.isInitializing };
    case 'SET_PROFILE':
      return { ...state, profile: action.profile };
    case 'SET_CREDITS':
      return { ...state, credits: action.credits };
    case 'SET_NARRATIVES':
      return { ...state, narratives: action.narratives };
    case 'SET_ACTIVE_NARRATIVE':
      return { ...state, activeNarrative: action.narrative, currentNode: null };
    case 'SET_CURRENT_NODE':
      return { ...state, currentNode: action.node };
    case 'SET_PATH_SYNC':
      return { ...state, pathSync: action.pathSync };
    case 'APPLY_CHOICE':
      return {
        ...state,
        currentNode: action.response.next_node,
        profile: action.response.updated_profile,
        credits: state.credits
          ? {
              ...state.credits,
              balance: action.response.updated_profile.reality_sync_percentage * 20, // Approximate
            }
          : null,
      };
    case 'TOGGLE_TERMINAL':
      return { ...state, terminalOpen: !state.terminalOpen };
    case 'SET_GLITCH':
      return { ...state, glitchActive: action.active };
    case 'SET_PAGE':
      return { ...state, currentPage: action.page };
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading };
    case 'LOGOUT':
      localStorage.removeItem('lifeos_token');
      return { ...initialState, isInitializing: false };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────
interface LifeOSContextType {
  state: LifeOSState;
  dispatch: React.Dispatch<Action>;
  apiFetch: <T>(
    path: string,
    options?: RequestInit
  ) => Promise<{ success: boolean; data?: T; error?: string }>;
}

const LifeOSContext = createContext<LifeOSContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

// ─── Provider ──────────────────────────────────────────
export function LifeOSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // API fetch wrapper that includes auth token
  const apiFetch = useCallback(
    async <T,>(
      path: string,
      options?: RequestInit
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      };

      if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
      }

      try {
        const res = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers,
        });

        const json = await res.json();
        return json;
      } catch (error) {
        return { success: false, error: 'Network error' };
      }
    },
    [state.token]
  );

  // Initialize from localStorage token
  useEffect(() => {
    const savedToken = localStorage.getItem('lifeos_token');
    if (savedToken) {
      dispatch({ type: 'SET_TOKEN', token: savedToken });
      dispatch({ type: 'SET_AUTH', isAuthenticated: true });
    }
    dispatch({ type: 'SET_INITIALIZING', isInitializing: false });
  }, []);

  return (
    <LifeOSContext.Provider value={{ state, dispatch, apiFetch }}>
      {children}
    </LifeOSContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────
export function useLifeOS() {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
}
