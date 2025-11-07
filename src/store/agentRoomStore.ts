import { create } from 'zustand';

interface AgentRoomState {
  agentRoomId: string | null;
  setAgentRoomId: (id: string) => void;
  currentUserPage: string | null;
  setCurrentUserPage: (id: string) => void;
}

export const useAgentRoomStore = create<AgentRoomState>((set) => ({
  agentRoomId: null,
  setAgentRoomId: (id) => set({ agentRoomId: id }),
  currentUserPage: null,
  setCurrentUserPage: (page) => set({ currentUserPage: page }),
}));